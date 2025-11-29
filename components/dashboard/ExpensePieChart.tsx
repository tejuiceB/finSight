'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ExpenseCategory } from '@/lib/types';

interface ExpensePieChartProps {
  expenses: { [category: string]: number };
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export default function ExpensePieChart({ expenses }: ExpensePieChartProps) {
  if (!expenses || Object.keys(expenses).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spending by Category
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No expense data available</p>
          </div>
        </div>
      </div>
    );
  }

  const total = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  
  const data = Object.entries(expenses)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: (amount / total) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Spending by Category
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ payload }) => `${payload.name}: ${payload.percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Category List */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((cat, index) => (
          <div
            key={cat.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {cat.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{cat.value.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                ({cat.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
