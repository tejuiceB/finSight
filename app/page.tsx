'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import UploadCard from '@/components/ui/UploadCard';
import ProgressBar from '@/components/ui/ProgressBar';
import type { ParsedFile, ProcessingStatus } from '@/lib/types';
import { AgentOrchestrator } from '@/lib/agent/orchestrator';
import { loadAppState, saveAppState } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<ParsedFile[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: 'idle',
    progress: 0,
    message: '',
  });
  const [error, setError] = useState<string>('');

  const handleFilesUploaded = async (files: ParsedFile[]) => {
    setUploadedFiles([...uploadedFiles, ...files]);
    setError('');

    // Auto-process if enabled
    const appState = await loadAppState();
    if (appState.settings.autoProcess) {
      await processFiles([...uploadedFiles, ...files]);
    }
  };

  const processFiles = async (files: ParsedFile[]) => {
    try {
      setProcessingStatus({
        stage: 'parsing',
        progress: 5,
        message: 'Starting analysis...',
      });

      const appState = await loadAppState();
      const orchestrator = new AgentOrchestrator(
        appState.userProfile,
        setProcessingStatus
      );

      const result = await orchestrator.processFiles(files);

      // Update app state
      appState.transactions = result.transactions;
      appState.analysisResult = result.analysis;
      appState.recommendations = result.recommendations;
      appState.reminders = result.reminders;
      await saveAppState(appState);

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                🤖 Intelligent Agent-Powered Financial Intelligence
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              FinSight Agent
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload Documents, Get Smart Insights
            </p>

            {/* Upload Button - Prominent */}
            <div className="mb-8">
              <input
                type="file"
                id="hero-file-upload"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls,.txt"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const fileArray = Array.from(files);
                    Promise.all(fileArray.map(f => {
                      const ext = f.name.split('.').pop()?.toLowerCase();
                      if (!['pdf', 'csv', 'xlsx', 'xls', 'txt'].includes(ext || '')) {
                        setError(`Unsupported file type: ${f.name}`);
                        return Promise.resolve(null);
                      }
                      if (f.size > 10 * 1024 * 1024) {
                        setError(`File too large (max 10MB): ${f.name}`);
                        return Promise.resolve(null);
                      }
                      return import('@/lib/parsers').then(({ parseFile }) => parseFile(f));
                    })).then(results => {
                      const parsed = results.filter(r => r !== null) as ParsedFile[];
                      if (parsed.length > 0) handleFilesUploaded(parsed);
                    });
                  }
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => document.getElementById('hero-file-upload')?.click()}
                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all shadow-2xl hover:shadow-3xl text-xl inline-flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Your Documents
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                PDF, CSV, Excel, TXT • Max 10MB per file
              </p>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload your bank statements, invoices, or receipts. Our intelligent agent 
              automatically analyzes your spending, identifies risks, and creates personalized 
              recommendations to transform your financial health.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  100% Private
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All data stored locally in your browser. No server database, no tracking.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Smart Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  FinSights multi-agent system analyzes patterns and creates personalized recommendations.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Instant Insights
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload PDFs, CSVs, or Excel and get comprehensive analysis in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-400">⚠️ {error}</p>
              </div>
            )}

            {processingStatus.stage !== 'idle' && <ProgressBar status={processingStatus} />}
            {processingStatus.stage === 'idle' && (
              <UploadCard onFilesUploaded={handleFilesUploaded} onError={setError} />
            )}
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What FinSight Agent Does For You
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Automated Transaction Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our agent extracts and categorizes every transaction from your statements. Get complete 
                    breakdown of income vs expenses across 15+ categories like Food, Travel, Subscriptions, EMIs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Smart Risk Detection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Identifies overspending patterns, unused subscriptions, high EMI burden, cashflow risks, 
                    and irregular income. Each risk categorized by severity with specific recommendations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Personalized Recommendations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get 5-7 high-impact, actionable recommendations tailored to YOUR finances with step-by-step 
                    instructions, estimated savings, and difficulty level.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center text-2xl">
                  🔔
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Smart Reminders & Planning
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Never miss a bill payment or savings goal. FinSight creates smart reminders - bill due dates, 
                    subscription renewals, weekly savings transfers, monthly budget reviews.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center text-2xl">
                  📈
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Visual Financial Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Beautiful charts show spending by category, monthly cashflow trends, top merchants, 
                    savings rate. All data visualized for easy understanding.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Intelligent Chat Assistant
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ask questions in natural language. "Why did expenses rise?", "Show unnecessary expenses". 
                    FinSight knows your entire financial history and provides instant answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              How FinSight Agent Works
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🧠</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Multi-Agent Intelligence System
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    FinSight uses advanced artificial intelligence with a sophisticated multi-agent 
                    architecture for comprehensive financial analysis:
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 ml-16">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Parser Agent:</strong> Extracts transactions from PDFs, CSVs, Excel
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Classifier Agent:</strong> Categorizes expenses & detects patterns
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Analyzer Agent:</strong> Identifies risks & calculates metrics
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Recommender Agent:</strong> Creates personalized action plans
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Your Privacy is Our Priority
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">No Database</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All data stored only in your browser's local storage. Never saved on servers.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Files Stay Local</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Files parsed in browser. Only extracted text sent to our agent for analysis.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Full Control</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export data anytime, clear everything with one click. You're in control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Upload your first financial document and get instant AI-powered insights.
            </p>
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Free →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
