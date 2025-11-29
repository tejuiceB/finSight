'use client';

import type { MonthlySummary } from '@/lib/types';

interface MetricsOverviewProps {
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  monthlySummary: MonthlySummary[];
}

export default function MetricsOverview({ totalIncome, totalExpense, savingsRate, monthlySummary }: MetricsOverviewProps) {
  const netSavings = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Income',
      value: `₹${totalIncome.toLocaleString('en-IN')}`,
      trend: '+',
      color: 'green',
      icon: '💰',
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpense.toLocaleString('en-IN')}`,
      trend: '-',
      color: 'red',
      icon: '💸',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      trend: savingsRate > 20 ? '+' : '!',
      color: savingsRate > 20 ? 'green' : 'amber',
      icon: '📊',
    },
    {
      title: 'Net Savings',
      value: `₹${netSavings.toLocaleString('en-IN')}`,
      trend: netSavings > 0 ? '+' : '-',
      color: netSavings > 0 ? 'green' : 'red',
      icon: '💵',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${getColorClasses(card.color)} border rounded-lg p-6 transition-transform hover:scale-105`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-2xl">{card.icon}</div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                card.trend === '+'
                  ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'
                  : card.trend === '-'
                  ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300'
              }`}
            >
              {card.trend}
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-75 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
