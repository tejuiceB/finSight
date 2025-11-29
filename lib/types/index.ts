/* eslint-disable @typescript-eslint/no-explicit-any */
// Core transaction type
export interface Transaction {
  date: string; // YYYY-MM-DD format
  amount: number;
  currency: string;
  merchant: string;
  type: 'expense' | 'income' | 'transfer';
  category: string;
  rawLine?: string;
  sourceFile?: string;
}

// Parsed file metadata
export interface ParsedFile {
  filename: string;
  text: string;
  fileType: 'pdf' | 'csv' | 'xlsx' | 'txt' | 'pptx';
  uploadedAt: string;
  transactions?: Transaction[];
}

// User profile
export interface UserProfile {
  name?: string;
  timezone: string;
  currency: string;
  monthlyGoal?: number;
  createdAt: string;
  updatedAt: string;
}

// Monthly summary
export interface MonthlySummary {
  month: string; // YYYY-MM format
  income: number;
  expense: number;
  net: number;
  savingsRate: number;
}

// Risk/issue detection
export interface Issue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  recommendation?: string;
}

// Analysis results
export interface AnalysisResult {
  monthlySummary: MonthlySummary[];
  issues: Issue[];
  metrics: {
    totalIncome: number;
    totalExpense: number;
    savingsRate: number;
    topCategories: { category: string; amount: number }[];
    topMerchants: { merchant: string; amount: number }[];
  };
  categorizedExpenses: { [category: string]: number };
  analyzedAt: string;
}

// Recommendation
export interface Recommendation {
  id: string;
  title: string;
  steps: string[];
  impact: 'low' | 'medium' | 'high';
  estimatedMonthlySavings?: number;
  category: string;
}

// Reminder
export interface Reminder {
  id: string;
  time: string; // ISO 8601 format
  text: string;
  type: 'bill' | 'saving' | 'subscription' | 'review' | 'custom';
  completed: boolean;
}

// Agent task plan
export interface AgentTask {
  taskId: string;
  agent: 'master' | 'parser' | 'classifier' | 'analyzer' | 'recommender' | 'reminder' | 'chat';
  input: any;
  expectedOutputSchema?: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

// Master agent plan
export interface MasterPlan {
  plan: AgentTask[];
  notes?: string[];
}

// Gemini API request
export interface GeminiRequest {
  prompt: {
    system: string;
    user: string;
  };
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Gemini API response
export interface GeminiResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Processing status
export interface ProcessingStatus {
  stage: 'idle' | 'parsing' | 'classifying' | 'analyzing' | 'recommending' | 'completed' | 'error';
  progress: number; // 0-100
  message: string;
  currentTask?: string;
}

// App state stored in localStorage
export interface AppState {
  userProfile: UserProfile;
  parsedFiles: ParsedFile[];
  transactions: Transaction[];
  analysisResult?: AnalysisResult;
  recommendations: Recommendation[];
  reminders: Reminder[];
  goals: FinancialGoal[];
  risks: RiskAlert[];
  behavioralTrends: BehavioralTrend[];
  transactionInsights: TransactionInsight[];
  categoryDetails: CategoryDetail[];
  chatHistory: ChatMessage[];
  settings: {
    autoProcess: boolean;
    enableReminders: boolean;
    privacyMode: 'browser-only' | 'server-allowed';
    customApiKey?: string;
  };
  lastUpdated: string;
}

// Income source breakdown
export interface IncomeSource {
  source: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'irregular';
}

// Expense category breakdown
export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
}

// Cashflow data
export interface CashflowData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

// Financial Goal
export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO 8601 date
  category: 'savings' | 'emergency-fund' | 'debt-clearance' | 'investment' | 'custom';
  createdAt: string;
  status: 'on-track' | 'at-risk' | 'completed' | 'overdue';
  weeklyTarget?: number;
  predictedCompletionDate?: string;
}

// Behavioral Trend
export interface BehavioralTrend {
  id: string;
  type: 'weekend-overspending' | 'impulse-shopping' | 'subscription-creep' | 'seasonal-spike' | 'recurring-pattern';
  title: string;
  description: string;
  frequency: string; // e.g., "Every weekend", "Monthly"
  averageAmount: number;
  occurrences: number;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  monthlyComparison?: {
    currentMonth: number;
    previousMonth: number;
    change: number;
  };
}

// Risk Alert
export interface RiskAlert {
  id: string;
  type: 'overspending' | 'subscription' | 'irregular-income' | 'high-emi' | 'low-balance';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedAmount?: number;
  affectedCategory?: string;
  detectedAt: string;
  actionItems: string[];
  autoResolved?: boolean;
}

// Transaction Insight
export interface TransactionInsight {
  transactionId: string;
  transaction: Transaction;
  insights: {
    isRecurring?: boolean;
    recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    isLargePurchase?: boolean;
    isUnusual?: boolean;
    merchantCategory?: string;
    tags: string[];
    relatedTransactions?: string[]; // Transaction IDs
  };
}

// Category Deep Dive
export interface CategoryDetail {
  category: string;
  totalAmount: number;
  transactionCount: number;
  merchantBreakdown: { merchant: string; amount: number; count: number }[];
  datePattern: { date: string; amount: number }[];
  essentialVsNonEssential: {
    essential: number;
    nonEssential: number;
  };
  monthlyComparison?: {
    currentMonth: number;
    previousMonth: number;
    change: number;
  };
}

// PDF Report Data
export interface PDFReportData {
  generatedAt: string;
  period: string;
  userProfile: UserProfile;
  metrics: AnalysisResult['metrics'];
  monthlySummary: MonthlySummary[];
  recommendations: Recommendation[];
  reminders: Reminder[];
  risks: RiskAlert[];
  goals?: FinancialGoal[];
  categoryInsights: CategoryDetail[];
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedData?: {
    transactionIds?: string[];
    categoryNames?: string[];
    chartType?: string;
  };
}
