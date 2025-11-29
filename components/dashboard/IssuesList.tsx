'use client';

import type { Issue } from '@/lib/types';

interface IssuesListProps {
  issues: Issue[];
}

export default function IssuesList({ issues }: IssuesListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Sort by severity: high -> medium -> low
  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        ⚠️ Risk Detection
      </h3>

      {issues.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            No major issues detected!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your finances are looking healthy.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedIssues.map((issue) => (
            <div
              key={issue.id}
              className={`border-2 rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSeverityIcon(issue.severity)}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${getSeverityBadge(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {issue.category}
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {issue.description}
              </p>

              {issue.recommendation && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    💡 Recommendation:
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {issue.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {issues.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-red-600">
                {issues.filter((i) => i.severity === 'high').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {issues.filter((i) => i.severity === 'medium').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Medium</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {issues.filter((i) => i.severity === 'low').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
