'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CashflowData } from '@/lib/types';

interface CashflowChartProps {
  data: CashflowData[];
}

export default function CashflowChart({ data }: CashflowChartProps) {
  const chartData = data.map((d) => ({
    month: d.month,
    Income: d.income,
    Expense: d.expense,
    Net: d.net,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Monthly Cashflow
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
          <Bar dataKey="Income" fill="#10b981" />
          <Bar dataKey="Expense" fill="#ef4444" />
          <Bar dataKey="Net" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Income</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{(data.reduce((sum, d) => sum + d.income, 0) / data.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Expense</p>
          <p className="text-lg font-semibold text-red-600">
            ₹{(data.reduce((sum, d) => sum + d.expense, 0) / data.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Savings</p>
          <p className="text-lg font-semibold text-blue-600">
            ₹{(data.reduce((sum, d) => sum + d.net, 0) / data.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
}
