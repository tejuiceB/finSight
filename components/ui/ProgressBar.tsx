'use client';

import type { ProcessingStatus } from '@/lib/types';

interface ProgressBarProps {
  status: ProcessingStatus;
}

export default function ProgressBar({ status }: ProgressBarProps) {
  if (status.stage === 'idle') return null;

  const stages = [
    { key: 'parsing', label: 'Parsing' },
    { key: 'classifying', label: 'Classifying' },
    { key: 'analyzing', label: 'Analyzing' },
    { key: 'recommending', label: 'Recommending' },
    { key: 'completed', label: 'Complete' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === status.stage);

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Current Task */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {status.currentTask || 'Processing...'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {status.message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                status.stage === 'error'
                  ? 'bg-red-500'
                  : status.stage === 'completed'
                  ? 'bg-green-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${status.progress}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {status.progress}%
            </span>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="mt-6 flex justify-between items-center">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  index < currentStageIndex
                    ? 'bg-green-500 text-white'
                    : index === currentStageIndex
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index < currentStageIndex ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {status.stage === 'error' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-400">
              ⚠️ {status.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
