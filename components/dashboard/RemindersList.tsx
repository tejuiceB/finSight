'use client';

import type { Reminder } from '@/lib/types';
import { format } from 'date-fns';

interface RemindersListProps {
  reminders: Reminder[];
  onToggleComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function RemindersList({
  reminders,
  onToggleComplete,
  onDelete,
}: RemindersListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bill':
        return '💳';
      case 'saving':
        return '💰';
      case 'subscription':
        return '🔔';
      case 'review':
        return '📊';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bill':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'saving':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'subscription':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Sort: upcoming first, then completed
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });

  const upcomingReminders = sortedReminders.filter((r) => !r.completed);
  const completedReminders = sortedReminders.filter((r) => r.completed);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🔔 Smart Reminders
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {upcomingReminders.length} upcoming
        </span>
      </div>

      {reminders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No reminders set. The AI will create reminders based on your transaction patterns.
        </p>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Upcoming
              </h4>
              <div className="space-y-2">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={(e) =>
                        onToggleComplete?.(reminder.id, e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getTypeIcon(reminder.type)}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTypeColor(
                            reminder.type
                          )}`}
                        >
                          {reminder.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {reminder.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(reminder.time), 'MMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(reminder.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete reminder"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Completed
              </h4>
              <div className="space-y-2">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60"
                  >
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={(e) =>
                        onToggleComplete?.(reminder.id, e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                        {reminder.text}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {format(new Date(reminder.time), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(reminder.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete reminder"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
