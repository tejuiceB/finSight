'use client';

import { useState } from 'react';
import type { FinancialGoal } from '@/lib/types';

interface GoalTrackerProps {
  goals: FinancialGoal[];
  onUpdateGoal?: (goalId: string, amount: number) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function GoalTracker({ goals, onUpdateGoal, onDeleteGoal }: GoalTrackerProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);

  if (!goals || goals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🎯 Goal Tracking
          </h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
          >
            + Add Goal
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No financial goals set yet. Start by adding a goal!</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800';
      case 'on-track':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800';
      case 'at-risk':
        return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-800';
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'on-track': return '🎯';
      case 'at-risk': return '⚠️';
      case 'overdue': return '🚨';
      default: return '📊';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return '💰';
      case 'emergency-fund': return '🛡️';
      case 'debt-clearance': return '💳';
      case 'investment': return '📈';
      case 'custom': return '🎯';
      default: return '💵';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          🎯 Goal Tracking
        </h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
        >
          + Add Goal
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysUntilDeadline = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={goal.id}
              className={`${getStatusColor(goal.status)} border rounded-lg p-5`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{goal.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {goal.category.replace('-', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
                <span className="text-lg">{getStatusIcon(goal.status)}</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      goal.status === 'completed' ? 'bg-green-600' :
                      goal.status === 'on-track' ? 'bg-blue-600' :
                      goal.status === 'at-risk' ? 'bg-amber-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {progress.toFixed(1)}% complete
                </p>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600 dark:text-gray-400">
                  📅 {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}
                </span>
                {goal.weeklyTarget && (
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                    ₹{goal.weeklyTarget.toLocaleString('en-IN')}/week
                  </span>
                )}
              </div>

              {/* Predicted Completion */}
              {goal.predictedCompletionDate && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  🔮 Predicted: {new Date(goal.predictedCompletionDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}

              {/* Actions */}
              {onUpdateGoal && onDeleteGoal && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onUpdateGoal(goal.id, goal.currentAmount + 1000)}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                  >
                    + ₹1,000
                  </button>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
