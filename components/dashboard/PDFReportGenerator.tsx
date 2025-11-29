'use client';

import { useState } from 'react';
import type { AppState } from '@/lib/types';

interface PDFReportGeneratorProps {
  appState: AppState;
}

export default function PDFReportGenerator({ appState }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF report content as HTML
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>FinSight Financial Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2563eb; border-bottom: 3px solid #10b981; padding-bottom: 10px; }
            h2 { color: #1f2937; margin-top: 30px; }
            .metric { display: inline-block; margin: 10px 20px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            .metric-label { font-size: 14px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .risk { padding: 10px; margin: 10px 0; border-left: 4px solid #ef4444; background-color: #fef2f2; }
            .recommendation { padding: 10px; margin: 10px 0; border-left: 4px solid #10b981; background-color: #f0fdf4; }
          </style>
        </head>
        <body>
          <h1>📊 FinSight Financial Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Period:</strong> All Time</p>

          <h2>Financial Overview</h2>
          <div>
            <div class="metric">
              <div class="metric-label">Total Income</div>
              <div class="metric-value">₹${appState.analysisResult?.metrics.totalIncome.toLocaleString('en-IN') || 0}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Total Expenses</div>
              <div class="metric-value">₹${appState.analysisResult?.metrics.totalExpense.toLocaleString('en-IN') || 0}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Savings Rate</div>
              <div class="metric-value">${appState.analysisResult?.metrics.savingsRate.toFixed(1) || 0}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Net Savings</div>
              <div class="metric-value">₹${((appState.analysisResult?.metrics.totalIncome || 0) - (appState.analysisResult?.metrics.totalExpense || 0)).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <h2>Risk Alerts</h2>
          ${appState.risks?.length > 0 ? appState.risks.map(risk => `
            <div class="risk">
              <strong>${risk.title}</strong> (${risk.severity})
              <p>${risk.description}</p>
              <ul>
                ${risk.actionItems.map(action => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          `).join('') : '<p>No risks detected.</p>'}

          <h2>Recommendations</h2>
          ${appState.recommendations?.length > 0 ? appState.recommendations.map(rec => `
            <div class="recommendation">
              <strong>${rec.title}</strong> (${rec.impact} impact)
              ${rec.estimatedMonthlySavings ? `<p><em>Est. Monthly Savings: ₹${rec.estimatedMonthlySavings.toLocaleString('en-IN')}</em></p>` : ''}
              <ol>
                ${rec.steps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          `).join('') : '<p>No recommendations available.</p>'}

          <h2>Top Spending Categories</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${appState.analysisResult?.metrics.topCategories?.slice(0, 10).map(cat => `
                <tr>
                  <td>${cat.category}</td>
                  <td>₹${cat.amount.toLocaleString('en-IN')}</td>
                </tr>
              `).join('') || '<tr><td colspan="2">No data</td></tr>'}
            </tbody>
          </table>

          <h2>Financial Goals</h2>
          ${appState.goals?.length > 0 ? appState.goals.map(goal => `
            <div style="margin: 15px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px;">
              <strong>${goal.title}</strong> (${goal.status})
              <p>Target: ₹${goal.targetAmount.toLocaleString('en-IN')} | Current: ₹${goal.currentAmount.toLocaleString('en-IN')} | Progress: ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</p>
              <p>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</p>
            </div>
          `).join('') : '<p>No goals set.</p>'}

          <hr style="margin-top: 40px;">
          <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Generated by FinSight Agent - Your Intelligent Financial Assistant
          </p>
        </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finsight-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            📄 Financial Report
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download a comprehensive PDF report of your financial analysis
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </span>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
            Financial Overview
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Income, expenses, savings rate, and key metrics
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-2xl mb-2">📈</div>
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">
            Charts & Visualizations
          </h3>
          <p className="text-xs text-green-700 dark:text-green-400">
            Cashflow trends, category breakdowns, spending patterns
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-2xl mb-2">💡</div>
          <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
            Recommendations
          </h3>
          <p className="text-xs text-purple-700 dark:text-purple-400">
            Personalized action plans and smart reminders
          </p>
        </div>
      </div>

    </div>
  );
}
