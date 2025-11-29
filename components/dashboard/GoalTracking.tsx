'use client';

import { useState } from 'react';
import type { FinancialGoal } from '@/lib/types';

interface GoalTrackingProps {
  goals: FinancialGoal[];
}

export default function GoalTracking({ goals }: GoalTrackingProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const safeGoals = goals || [];

  const getStatusColor = (status: FinancialGoal['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'on-track':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'at-risk':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'overdue':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    }
  };

  const getStatusIcon = (status: FinancialGoal['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'on-track':
        return '🎯';
      case 'at-risk':
        return '⚠️';
      case 'overdue':
        return '🚨';
    }
  };

  const getCategoryIcon = (category: FinancialGoal['category']) => {
    switch (category) {
      case 'savings':
        return '💰';
      case 'emergency-fund':
        return '🛡️';
      case 'debt-clearance':
        return '💳';
      case 'investment':
        return '📈';
      case 'custom':
        return '🎯';
    }
  };

  if (safeGoals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Goals Set Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Set financial goals to track your progress and get personalized recommendations.
        </p>
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Your First Goal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Goal Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          + Add New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysUntilDeadline = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4"
              style={{
                borderLeftColor:
                  goal.status === 'completed'
                    ? '#10b981'
                    : goal.status === 'on-track'
                    ? '#3b82f6'
                    : goal.status === 'at-risk'
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                  {getStatusIcon(goal.status)} {goal.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(progress, 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Deadline & Prediction */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                  <span className={`font-semibold ${
                    daysUntilDeadline < 0
                      ? 'text-red-600 dark:text-red-400'
                      : daysUntilDeadline < 30
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {new Date(goal.deadline).toLocaleDateString()}
                    {daysUntilDeadline >= 0 && ` (${daysUntilDeadline} days)`}
                  </span>
                </div>

                {goal.weeklyTarget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weekly Target:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{goal.weeklyTarget.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {goal.predictedCompletionDate && goal.status !== 'completed' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Predicted Completion:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {new Date(goal.predictedCompletionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Message */}
              {goal.status === 'at-risk' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    ⚠️ You may need to increase your weekly savings to meet this goal on time.
                  </p>
                </div>
              )}

              {goal.status === 'completed' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                  <p className="text-xs text-green-800 dark:text-green-300">
                    🎉 Congratulations! You've achieved this goal!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal Placeholder */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 Create Financial Goal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Fund, Vacation"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="savings">💰 Savings</option>
                  <option value="emergency-fund">🛡️ Emergency Fund</option>
                  <option value="debt-clearance">💳 Debt Clearance</option>
                  <option value="investment">📈 Investment</option>
                  <option value="custom">🎯 Custom</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement goal creation
                  alert('Goal creation will be implemented soon! For now, personalized goals are auto-generated based on your spending patterns.');
                  setShowAddGoal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
