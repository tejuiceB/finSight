'use client';

import type { BehavioralTrend } from '@/lib/types';

interface BehavioralTrendsProps {
  trends: BehavioralTrend[];
}

export default function BehavioralTrends({ trends }: BehavioralTrendsProps) {
  if (!trends || trends.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📈 Behavioral Trends
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Not enough data to detect behavioral patterns yet. Upload more statements!
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20';
      case 'low':
        return 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weekend-overspending': return '🎉';
      case 'impulse-shopping': return '🛒';
      case 'subscription-creep': return '🔄';
      case 'seasonal-spike': return '🌟';
      case 'recurring-pattern': return '📅';
      default: return '📊';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📈 Behavioral Trends Analysis
      </h2>

      <div className="space-y-4">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className={`${getSeverityColor(trend.severity)} border rounded-lg p-5`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{getTypeIcon(trend.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {trend.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    trend.severity === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                    trend.severity === 'medium' ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' :
                    'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                  }`}>
                    {trend.severity.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {trend.description}
                </p>

                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Frequency</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {trend.frequency}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Amount</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{trend.averageAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Occurrences</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {trend.occurrences}x
                    </p>
                  </div>
                </div>

                {trend.monthlyComparison && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Monthly Comparison</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{trend.monthlyComparison.currentMonth.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-bold ${
                          trend.monthlyComparison.change > 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {trend.monthlyComparison.change > 0 ? '↑' : '↓'} {Math.abs(trend.monthlyComparison.change).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Last Month</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{trend.monthlyComparison.previousMonth.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                    💡 Suggestion
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {trend.suggestion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
