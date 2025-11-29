/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ParsedFile,
  Transaction,
  UserProfile,
  AnalysisResult,
  Recommendation,
  Reminder,
  ProcessingStatus,
  RiskAlert,
  BehavioralTrend,
  TransactionInsight,
  CategoryDetail,
  FinancialGoal,
} from '@/lib/types';
import {
  getMasterAgentPrompt,
  getParserAgentPrompt,
  getClassifierAgentPrompt,
  getAnalyzerAgentPrompt,
  getRecommendationAgentPrompt,
  getReminderAgentPrompt,
} from './prompts';
import { callGemini, parseGeminiJSON } from './gemini';
import {
  saveAnalysisResult,
  saveRecommendations,
  addReminder,
  addTransactions,
  saveAppState,
  loadAppState,
} from '@/lib/storage';

/**
 * Orchestrator for multi-agent financial analysis
 * Coordinates Parser -> Classifier -> Analyzer -> Recommender -> Reminder agents
 */
export class AgentOrchestrator {
  private userProfile: UserProfile;
  private onStatusUpdate?: (status: ProcessingStatus) => void;

  constructor(
    userProfile: UserProfile,
    onStatusUpdate?: (status: ProcessingStatus) => void
  ) {
    this.userProfile = userProfile;
    this.onStatusUpdate = onStatusUpdate;
  }

  private updateStatus(status: ProcessingStatus) {
    if (this.onStatusUpdate) {
      this.onStatusUpdate(status);
    }
  }

  /**
   * Main orchestration method - processes files through all agents
   */
  async processFiles(files: ParsedFile[]): Promise<{
    transactions: Transaction[];
    analysis: AnalysisResult;
    recommendations: Recommendation[];
    reminders: Reminder[];
    risks: RiskAlert[];
    behavioralTrends: BehavioralTrend[];
    transactionInsights: TransactionInsight[];
    categoryDetails: CategoryDetail[];
    goals: FinancialGoal[];
  }> {
    try {
      // Stage 1: Parse files and extract transactions
      this.updateStatus({
        stage: 'parsing',
        progress: 10,
        message: 'Extracting transactions from files...',
        currentTask: 'Parser Agent',
      });
      
      const allTransactions = await this.runParserAgent(files);

      // Stage 2: Classify transactions
      this.updateStatus({
        stage: 'classifying',
        progress: 30,
        message: 'Categorizing transactions...',
        currentTask: 'Classifier Agent',
      });
      
      const categorizedTransactions = await this.runClassifierAgent(allTransactions);

      // Stage 3: Analyze financial data
      this.updateStatus({
        stage: 'analyzing',
        progress: 60,
        message: 'Analyzing spending patterns and risks...',
        currentTask: 'Analyzer Agent',
      });
      
      const analysis = await this.runAnalyzerAgent(categorizedTransactions);

      // Stage 4: Generate recommendations
      this.updateStatus({
        stage: 'recommending',
        progress: 80,
        message: 'Creating personalized recommendations...',
        currentTask: 'Recommender Agent',
      });
      
      const recommendations = await this.runRecommenderAgent(analysis);

      // Stage 5: Create reminders
      this.updateStatus({
        stage: 'recommending',
        progress: 90,
        message: 'Setting up smart reminders...',
        currentTask: 'Reminder Agent',
      });
      
      const reminders = await this.runReminderAgent(recommendations, categorizedTransactions);

      // Generate additional insights
      this.updateStatus({
        stage: 'analyzing',
        progress: 95,
        message: 'Generating insights and trends...',
        currentTask: 'Insight Generation',
      });

      const risks = this.generateRisks(analysis, categorizedTransactions);
      const behavioralTrends = this.generateBehavioralTrends(categorizedTransactions);
      const transactionInsights = this.generateTransactionInsights(categorizedTransactions);
      const categoryDetails = this.generateCategoryDetails(categorizedTransactions, analysis);
      const goals = await this.loadOrCreateGoals(analysis, categorizedTransactions);

      // Save results to storage
      await saveAnalysisResult(analysis);
      await saveRecommendations(recommendations);
      
      for (const reminder of reminders) {
        await addReminder(reminder);
      }

      // Save extended insights
      const appState = await loadAppState();
      appState.risks = risks;
      appState.behavioralTrends = behavioralTrends;
      appState.transactionInsights = transactionInsights;
      appState.categoryDetails = categoryDetails;
      appState.goals = goals;
      await saveAppState(appState);

      this.updateStatus({
        stage: 'completed',
        progress: 100,
        message: 'Analysis complete!',
      });

      return {
        transactions: categorizedTransactions,
        analysis,
        recommendations,
        reminders,
        risks,
        behavioralTrends,
        transactionInsights,
        categoryDetails,
        goals,
      };
    } catch (error) {
      this.updateStatus({
        stage: 'error',
        progress: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      throw error;
    }
  }

  /**
   * Parser Agent - Extract transactions from file text
   */
  private async runParserAgent(files: ParsedFile[]): Promise<Transaction[]> {
    const allTransactions: Transaction[] = [];

    for (const file of files) {
      try {
        const prompt = getParserAgentPrompt(file.text, file.filename, file.fileType);
        const response = await callGemini(prompt.system, prompt.user, {
          maxTokens: 4096,
          temperature: 0.1,
        });

        const parsed = parseGeminiJSON<{
          transactions: Transaction[];
          summary: any;
        }>(response);

        // Add source file to each transaction
        const transactions = parsed.transactions.map(t => ({
          ...t,
          sourceFile: file.filename,
        }));

        allTransactions.push(...transactions);
        
        // Save transactions incrementally
        await addTransactions(transactions);
      } catch (error) {
        console.error(`Failed to parse ${file.filename}:`, error);
        // Continue with other files
      }
    }

    return allTransactions;
  }

  /**
   * Classifier Agent - Categorize and identify patterns
   */
  private async runClassifierAgent(transactions: Transaction[]): Promise<Transaction[]> {
    if (transactions.length === 0) return [];

    try {
      const prompt = getClassifierAgentPrompt(transactions);
      const response = await callGemini(prompt.system, prompt.user, {
        maxTokens: 4096,
        temperature: 0.2,
      });

      const classified = parseGeminiJSON<{
        categorizedTransactions: Transaction[];
      }>(response);

      return classified.categorizedTransactions;
    } catch (error) {
      console.error('Classification failed:', error);
      return transactions; // Return uncategorized if fails
    }
  }

  /**
   * Analyzer Agent - Deep financial analysis
   */
  private async runAnalyzerAgent(transactions: Transaction[]): Promise<AnalysisResult> {
    const prompt = getAnalyzerAgentPrompt(transactions, this.userProfile);
    const response = await callGemini(prompt.system, prompt.user, {
      maxTokens: 4096,
      temperature: 0.1,
    });

    const analysis = parseGeminiJSON<AnalysisResult>(response);
    
    // Add timestamp
    analysis.analyzedAt = new Date().toISOString();

    return analysis;
  }

  /**
   * Recommender Agent - Generate actionable recommendations
   */
  private async runRecommenderAgent(analysis: AnalysisResult): Promise<Recommendation[]> {
    const prompt = getRecommendationAgentPrompt(analysis, this.userProfile);
    const response = await callGemini(prompt.system, prompt.user, {
      maxTokens: 3072,
      temperature: 0.3,
    });

    const result = parseGeminiJSON<{ recommendations: Recommendation[] }>(response);
    
    return result.recommendations;
  }

  /**
   * Reminder Agent - Create smart reminders
   */
  private async runReminderAgent(
    recommendations: Recommendation[],
    transactions: Transaction[]
  ): Promise<Reminder[]> {
    const prompt = getReminderAgentPrompt(recommendations, transactions);
    const response = await callGemini(prompt.system, prompt.user, {
      maxTokens: 2048,
      temperature: 0.2,
    });

    const result = parseGeminiJSON<{ reminders: Reminder[] }>(response);
    
    // Add completed flag
    return result.reminders.map(r => ({
      ...r,
      completed: false,
    }));
  }

  /**
   * Generate risk alerts from analysis
   */
  private generateRisks(analysis: AnalysisResult, transactions: Transaction[]): RiskAlert[] {
    const risks: RiskAlert[] = [];

    if (!analysis || !analysis.metrics) {
      return risks;
    }

    // High expense ratio
    if (analysis.metrics.savingsRate < 10) {
      risks.push({
        id: `risk-${Date.now()}-savings`,
        type: 'overspending',
        title: 'Low Savings Rate',
        description: `Your savings rate is only ${analysis.metrics.savingsRate.toFixed(1)}%. This is below the recommended 20% minimum.`,
        severity: 'high',
        affectedAmount: analysis.metrics.totalExpense - (analysis.metrics.totalIncome * 0.8),
        detectedAt: new Date().toISOString(),
        actionItems: [
          'Review non-essential expenses and identify areas to cut back',
          'Set up automatic savings transfers',
          'Track daily spending to stay within budget',
        ],
      });
    }

    // Detect recurring subscriptions
    const subscriptionCategories = ['Subscriptions', 'Entertainment', 'Software'];
    const subscriptionExpenses = analysis.categorizedExpenses
      ? Object.entries(analysis.categorizedExpenses)
          .filter(([cat]) => subscriptionCategories.some(s => cat.includes(s)))
          .reduce((sum, [, amt]) => sum + amt, 0)
      : 0;

    if (subscriptionExpenses > analysis.metrics.totalIncome * 0.1) {
      risks.push({
        id: `risk-${Date.now()}-subscription`,
        type: 'subscription',
        title: 'High Subscription Spending',
        description: 'Your subscription costs are consuming over 10% of your income.',
        severity: 'medium',
        affectedAmount: subscriptionExpenses,
        affectedCategory: 'Subscriptions',
        detectedAt: new Date().toISOString(),
        actionItems: [
          'Review all active subscriptions and cancel unused ones',
          'Look for family plans or annual discounts',
          'Consider free alternatives for non-essential services',
        ],
      });
    }

    return risks;
  }

  /**
   * Generate behavioral trends from transactions
   */
  private generateBehavioralTrends(transactions: Transaction[]): BehavioralTrend[] {
    const trends: BehavioralTrend[] = [];

    if (!transactions || transactions.length === 0) {
      return trends;
    }

    // Weekend spending pattern
    const weekendTransactions = transactions.filter(t => {
      const day = new Date(t.date).getDay();
      return day === 0 || day === 6;
    });

    if (weekendTransactions.length > 0) {
      const weekendTotal = weekendTransactions.reduce((sum, t) => 
        t.type === 'expense' ? sum + Math.abs(t.amount) : sum, 0);
      const weekdayTotal = transactions
        .filter(t => {
          const day = new Date(t.date).getDay();
          return day !== 0 && day !== 6 && t.type === 'expense';
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      if (weekendTotal > weekdayTotal * 0.4) {
        trends.push({
          id: `trend-${Date.now()}-weekend`,
          type: 'weekend-overspending',
          title: 'Weekend Overspending Pattern',
          description: 'You tend to spend significantly more on weekends compared to weekdays.',
          frequency: 'Weekly',
          averageAmount: weekendTotal / Math.max(weekendTransactions.length / 7, 1),
          occurrences: Math.ceil(weekendTransactions.length / 2),
          suggestion: 'Plan weekend activities with a budget. Consider free or low-cost entertainment options.',
          severity: weekendTotal > weekdayTotal ? 'high' : 'medium',
        });
      }
    }

    return trends;
  }

  /**
   * Generate transaction insights
   */
  private generateTransactionInsights(transactions: Transaction[]): TransactionInsight[] {
    const insights: TransactionInsight[] = [];

    if (!transactions || transactions.length === 0) {
      return insights;
    }

    const merchantMap = new Map<string, Transaction[]>();

    // Group by merchant
    transactions.forEach(t => {
      const existing = merchantMap.get(t.merchant) || [];
      existing.push(t);
      merchantMap.set(t.merchant, existing);
    });

    // Detect recurring transactions
    merchantMap.forEach((txns, merchant) => {
      if (txns.length >= 2) {
        const amounts = txns.map(t => Math.abs(t.amount));
        const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const isRecurring = amounts.every(amt => Math.abs(amt - avgAmount) < avgAmount * 0.1);

        txns.forEach(t => {
          insights.push({
            transactionId: `${t.date}-${t.merchant}-${t.amount}`,
            transaction: t,
            insights: {
              isRecurring,
              recurringFrequency: isRecurring ? 'monthly' : undefined,
              isLargePurchase: Math.abs(t.amount) > avgAmount * 2,
              isUnusual: false,
              merchantCategory: t.category,
              tags: [
                isRecurring ? 'Recurring' : 'One-time',
                t.type === 'expense' ? 'Expense' : 'Income',
              ],
            },
          });
        });
      }
    });

    return insights.slice(0, 50); // Limit to 50 most relevant
  }

  /**
   * Generate category details
   */
  private generateCategoryDetails(transactions: Transaction[], analysis: AnalysisResult): CategoryDetail[] {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, Transaction[]>();

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const existing = categoryMap.get(t.category) || [];
        existing.push(t);
        categoryMap.set(t.category, existing);
      }
    });

    const details: CategoryDetail[] = [];

    categoryMap.forEach((txns, category) => {
      const totalAmount = txns.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const merchantBreakdown = new Map<string, { amount: number; count: number }>();

      txns.forEach(t => {
        const existing = merchantBreakdown.get(t.merchant) || { amount: 0, count: 0 };
        existing.amount += Math.abs(t.amount);
        existing.count += 1;
        merchantBreakdown.set(t.merchant, existing);
      });

      details.push({
        category,
        totalAmount,
        transactionCount: txns.length,
        merchantBreakdown: Array.from(merchantBreakdown.entries())
          .map(([merchant, data]) => ({ merchant, ...data }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5),
        datePattern: txns.map(t => ({ date: t.date, amount: Math.abs(t.amount) })),
        essentialVsNonEssential: {
          essential: ['Food', 'Bills', 'Healthcare', 'Transport'].includes(category) ? totalAmount : 0,
          nonEssential: !['Food', 'Bills', 'Healthcare', 'Transport'].includes(category) ? totalAmount : 0,
        },
      });
    });

    return details.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * Load existing goals or create personalized goal suggestions
   */
  private async loadOrCreateGoals(analysis?: AnalysisResult, transactions?: Transaction[]): Promise<FinancialGoal[]> {
    const appState = await loadAppState();
    
    if (appState.goals && appState.goals.length > 0) {
      return appState.goals;
    }

    // Generate personalized goal suggestions based on financial data
    const suggestedGoals: FinancialGoal[] = [];
    
    if (analysis && transactions) {
      const monthlyIncome = analysis.metrics.totalIncome / (transactions.length > 0 ? 6 : 1); // Assuming 6 months data
      const monthlyExpense = analysis.metrics.totalExpense / (transactions.length > 0 ? 6 : 1);
      const monthlySavings = monthlyIncome - monthlyExpense;

      // 1. Emergency Fund (3-6 months of expenses)
      const emergencyFundTarget = Math.round(monthlyExpense * 6);
      suggestedGoals.push({
        id: `goal-${Date.now()}-1`,
        title: 'Emergency Fund (6 Months)',
        targetAmount: emergencyFundTarget,
        currentAmount: Math.round(monthlySavings * 0.2), // Assume 20% already saved
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        category: 'emergency-fund',
        createdAt: new Date().toISOString(),
        status: 'on-track',
        weeklyTarget: emergencyFundTarget / 52,
      });

      // 2. Debt Clearance (if EMI detected)
      const emiCategories = ['Loans & EMI', 'Credit Card', 'EMI'];
      const monthlyEMI = Object.entries(analysis.categorizedExpenses || {})
        .filter(([cat]) => emiCategories.some(emi => cat.includes(emi)))
        .reduce((sum, [, amt]) => sum + amt, 0) / 6;

      if (monthlyEMI > 0) {
        const debtClearanceTarget = Math.round(monthlyEMI * 12); // 1 year of EMI
        suggestedGoals.push({
          id: `goal-${Date.now()}-2`,
          title: 'Clear Outstanding Debt',
          targetAmount: debtClearanceTarget,
          currentAmount: 0,
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'debt-clearance',
          createdAt: new Date().toISOString(),
          status: 'on-track',
          weeklyTarget: debtClearanceTarget / 52,
        });
      }

      // 3. Savings Goal (based on current savings capacity)
      if (monthlySavings > 0) {
        const savingsTarget = Math.round(monthlySavings * 12); // 1 year of savings
        suggestedGoals.push({
          id: `goal-${Date.now()}-3`,
          title: 'Annual Savings Target',
          targetAmount: savingsTarget,
          currentAmount: Math.round(monthlySavings * 2), // Assume 2 months saved
          deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'savings',
          createdAt: new Date().toISOString(),
          status: 'on-track',
          weeklyTarget: savingsTarget / 52,
        });
      }

      // 4. Investment Goal (if user has investment capacity)
      if (monthlySavings > monthlyExpense * 0.1) { // If savings > 10% of expenses
        const investmentTarget = Math.round(monthlySavings * 6); // 6 months of investment
        suggestedGoals.push({
          id: `goal-${Date.now()}-4`,
          title: 'Start Investment Portfolio',
          targetAmount: investmentTarget,
          currentAmount: 0,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
          category: 'investment',
          createdAt: new Date().toISOString(),
          status: 'on-track',
          weeklyTarget: investmentTarget / 26,
        });
      }

      // 5. Custom Goal - Vacation/Big Purchase
      const vacationTarget = Math.round(monthlyIncome * 2); // 2 months salary
      suggestedGoals.push({
        id: `goal-${Date.now()}-5`,
        title: 'Dream Vacation Fund',
        targetAmount: vacationTarget,
        currentAmount: 0,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'custom',
        createdAt: new Date().toISOString(),
        status: 'on-track',
        weeklyTarget: vacationTarget / 52,
      });
    } else {
      // Default goal if no analysis data
      suggestedGoals.push({
        id: `goal-${Date.now()}`,
        title: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 0,
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'emergency-fund',
        createdAt: new Date().toISOString(),
        status: 'on-track',
        weeklyTarget: 100000 / 52,
      });
    }

    return suggestedGoals;
  }
}
