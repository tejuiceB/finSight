'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import MetricsOverview from '@/components/dashboard/MetricsOverview';
import CashflowChart from '@/components/dashboard/CashflowChart';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import RecommendationsList from '@/components/dashboard/RecommendationsList';
import RemindersList from '@/components/dashboard/RemindersList';
import CategoryInsights from '@/components/dashboard/CategoryInsights';
import RiskAlerts from '@/components/dashboard/RiskAlerts';
import TransactionInsights from '@/components/dashboard/TransactionInsights';
import GoalTracking from '@/components/dashboard/GoalTracking';
import BehavioralTrends from '@/components/dashboard/BehavioralTrends';
import PDFReportGenerator from '@/components/dashboard/PDFReportGenerator';
import FloatingChatbot from '@/components/dashboard/FloatingChatbot';
import type { AppState } from '@/lib/types';
import { loadAppState, updateReminder, deleteReminder } from '@/lib/storage';

export default function DashboardPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'goals' | 'trends'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const state = await loadAppState();
      setAppState(state);
    } catch (error) {
      console.error('Failed to load app state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (id: string, completed: boolean) => {
    await updateReminder(id, completed);
    await loadData();
  };

  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your financial dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasData = appState && appState.transactions.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your financial documents to see your personalized dashboard with AI-powered insights.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Documents
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with PDF Export */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Financial Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {appState.userProfile.name ? `Welcome, ${appState.userProfile.name}` : 'Your intelligent financial overview'}
              </p>
            </div>
            <PDFReportGenerator appState={appState} />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'insights', label: '🔍 Insights' },
              { id: 'goals', label: '🎯 Goals' },
              { id: 'trends', label: '📈 Trends' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Overview */}
              {appState.analysisResult && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Financial Health Overview
                  </h2>
                  <MetricsOverview
                    totalIncome={appState.analysisResult.metrics.totalIncome}
                    totalExpense={appState.analysisResult.metrics.totalExpense}
                    savingsRate={appState.analysisResult.metrics.savingsRate}
                    monthlySummary={appState.analysisResult.monthlySummary}
                  />
                </section>
              )}

          {/* Charts Section */}
          {appState.analysisResult && appState.analysisResult.categorizedExpenses && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Visual Analysis
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <CashflowChart data={appState.analysisResult.monthlySummary} />
                <ExpensePieChart expenses={appState.analysisResult.categorizedExpenses} />
              </div>
            </section>
          )}              {/* Risk Alerts */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🚨 Risk Detection
                </h2>
                <RiskAlerts risks={appState.risks || []} />
              </section>

              {/* Recommendations */}
              {appState.recommendations.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    💡 Personalized Recommendations
                  </h2>
                  <RecommendationsList recommendations={appState.recommendations} />
                </section>
              )}

              {/* Smart Reminders */}
              {appState.reminders.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    ⏰ Smart Reminders
                  </h2>
                  <RemindersList
                    reminders={appState.reminders}
                    onToggleComplete={handleToggleReminder}
                    onDelete={handleDeleteReminder}
                  />
                </section>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Category Insights */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  📂 Category Deep Dive
                </h2>
                <CategoryInsights categoryDetails={appState.categoryDetails || []} />
              </section>

              {/* Transaction Insights */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  💳 Transaction Insights
                </h2>
                <TransactionInsights insights={appState.transactionInsights || []} />
              </section>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🎯 Financial Goals
                </h2>
                <GoalTracking goals={appState.goals || []} />
              </section>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  📊 Behavioral Trends Analysis
                </h2>
                <BehavioralTrends trends={appState.behavioralTrends || []} />
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Floating Chatbot */}
      <FloatingChatbot appState={appState} />
    </div>
  );
}
