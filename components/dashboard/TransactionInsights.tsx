'use client';

import { useState } from 'react';
import type { TransactionInsight } from '@/lib/types';

interface TransactionInsightsProps {
  insights: TransactionInsight[];
}

export default function TransactionInsights({ insights }: TransactionInsightsProps) {
  const [filter, setFilter] = useState<'all' | 'recurring' | 'large' | 'unusual'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredInsights = insights.filter((insight) => {
    if (filter === 'all') return true;
    if (filter === 'recurring') return insight.insights.isRecurring;
    if (filter === 'large') return insight.insights.isLargePurchase;
    if (filter === 'unusual') return insight.insights.isUnusual;
    return true;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime();
    }
    return Math.abs(b.transaction.amount) - Math.abs(a.transaction.amount);
  });

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return '💸';
      case 'income':
        return '💰';
      case 'transfer':
        return '🔄';
      default:
        return '💳';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Transaction Insights Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload more documents to see detailed transaction analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'recurring', label: '🔁 Recurring' },
            { id: 'large', label: '💰 Large' },
            { id: 'unusual', label: '⚡ Unusual' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as typeof filter)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedInsights.map((insight) => (
          <div
            key={insight.transactionId}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl">{getTransactionTypeIcon(insight.transaction.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {insight.transaction.merchant}
                    </h4>
                    {insight.insights.merchantCategory && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {insight.insights.merchantCategory}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {new Date(insight.transaction.date).toLocaleDateString()} • {insight.transaction.category}
                  </p>

                  {/* Tags */}
                  {insight.insights.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {insight.insights.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Insights */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                    {insight.insights.isRecurring && (
                      <span className="flex items-center gap-1">
                        🔁 {insight.insights.recurringFrequency}
                      </span>
                    )}
                    {insight.insights.isLargePurchase && (
                      <span className="flex items-center gap-1">💰 Large Purchase</span>
                    )}
                    {insight.insights.isUnusual && (
                      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        ⚡ Unusual Activity
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold ${
                  insight.transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {insight.transaction.type === 'income' ? '+' : '-'}
                  {insight.transaction.currency} {Math.abs(insight.transaction.amount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedInsights.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No transactions match the selected filter.
        </p>
      )}
    </div>
  );
}
