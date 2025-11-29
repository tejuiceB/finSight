'use client';

import type { CategoryDetail } from '@/lib/types';

interface CategoryInsightsProps {
  categoryDetails: CategoryDetail[];
}

export default function CategoryInsights({ categoryDetails }: CategoryInsightsProps) {
  if (!categoryDetails || categoryDetails.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Category Insights
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No category data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📊 Category Insights
      </h2>

      <div className="space-y-6">
        {categoryDetails.slice(0, 5).map((category) => (
          <div key={category.category} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.transactionCount} transactions
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{category.totalAmount.toLocaleString('en-IN')}
                </p>
                {category.monthlyComparison && (
                  <p className={`text-sm ${category.monthlyComparison.change > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {category.monthlyComparison.change > 0 ? '↑' : '↓'} {Math.abs(category.monthlyComparison.change).toFixed(1)}% vs last month
                  </p>
                )}
              </div>
            </div>

            {/* Merchant Breakdown */}
            {category.merchantBreakdown && category.merchantBreakdown.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Top Merchants
                </h4>
                <div className="space-y-2">
                  {category.merchantBreakdown.slice(0, 3).map((merchant, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{merchant.merchant}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-500">{merchant.count}x</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{merchant.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Essential vs Non-Essential */}
            {category.essentialVsNonEssential && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Spending Type
                </h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Essential</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      ₹{category.essentialVsNonEssential.essential.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">Non-Essential</p>
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                      ₹{category.essentialVsNonEssential.nonEssential.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
