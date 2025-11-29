'use client';

import type { TransactionInsight } from '@/lib/types';

interface TransactionInsightsProps {
  insights: TransactionInsight[];
}

export default function TransactionInsightsView({ insights }: TransactionInsightsProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🔍 Transaction Insights
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No transaction insights available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        🔍 Transaction Insights
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Date</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Merchant</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Insights</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((item) => (
              <tr
                key={item.transactionId}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                  {new Date(item.transaction.date).toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                  {item.transaction.merchant}
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {item.transaction.category}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={`font-semibold ${
                    item.transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {item.transaction.type === 'income' ? '+' : '-'}₹{item.transaction.amount.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-wrap gap-1">
                    {item.insights.isRecurring && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        🔄 {item.insights.recurringFrequency}
                      </span>
                    )}
                    {item.insights.isLargePurchase && (
                      <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                        💰 Large
                      </span>
                    )}
                    {item.insights.isUnusual && (
                      <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                        ⚠️ Unusual
                      </span>
                    )}
                    {item.insights.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {insights.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing top {insights.length} transactions with insights
          </p>
        </div>
      )}
    </div>
  );
}
