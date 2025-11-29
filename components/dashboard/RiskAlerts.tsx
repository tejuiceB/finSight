'use client';

import type { RiskAlert } from '@/lib/types';

interface RiskAlertsProps {
  risks: RiskAlert[];
}

export default function RiskAlerts({ risks }: RiskAlertsProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ⚠️ Risk Alerts
        </h2>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-400 font-semibold">
            ✅ No risks detected - Your finances look healthy!
          </p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300';
      case 'low':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '💡';
      default: return 'ℹ️';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overspending': return '💸';
      case 'subscription': return '🔄';
      case 'irregular-income': return '📊';
      case 'high-emi': return '🏦';
      case 'low-balance': return '💰';
      default: return '⚠️';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        ⚠️ Risk Alerts
      </h2>

      <div className="space-y-4">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className={`${getSeverityColor(risk.severity)} border rounded-lg p-4`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{getTypeIcon(risk.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{risk.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-800 font-semibold">
                    {getSeverityIcon(risk.severity)} {risk.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-3 opacity-90">{risk.description}</p>
                
                {risk.affectedAmount && (
                  <p className="text-sm font-semibold mb-2">
                    💵 Affected Amount: ₹{risk.affectedAmount.toLocaleString('en-IN')}
                  </p>
                )}

                {risk.actionItems && risk.actionItems.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold mb-2">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {risk.actionItems.map((action, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="shrink-0">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
