'use client';

import type { Recommendation } from '@/lib/types';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'saving':
        return '💰';
      case 'budgeting':
        return '📊';
      case 'debt':
        return '💳';
      case 'income':
        return '📈';
      case 'subscription':
        return '🔔';
      default:
        return '✨';
    }
  };

  // Sort by impact: high -> medium -> low
  const sortedRecs = [...recommendations].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💡 Personalized Recommendations
      </h3>

      {sortedRecs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No recommendations yet. Upload your financial documents to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {sortedRecs.map((rec, index) => (
            <div
              key={rec.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {index + 1}. {rec.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {rec.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getImpactColor(
                    rec.impact
                  )}`}
                >
                  {rec.impact.toUpperCase()} IMPACT
                </span>
              </div>

              {/* Estimated Savings */}
              {rec.estimatedMonthlySavings && rec.estimatedMonthlySavings > 0 && (
                <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    💵 Estimated Monthly Savings:{' '}
                    <span className="font-bold">
                      ₹{rec.estimatedMonthlySavings.toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>
              )}

              {/* Action Steps */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Action Steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {rec.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
