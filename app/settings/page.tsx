/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { loadAppState, updateSettings, clearAllData, exportData, importData } from '@/lib/storage';
import type { AppState } from '@/lib/types';

export default function SettingsPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const state = await loadAppState();
      setAppState(state);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    if (!appState) return;

    const newSettings = { ...appState.settings, [key]: value };
    await updateSettings(newSettings);
    setAppState({ ...appState, settings: newSettings });
    
    setSaveMessage('Settings saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleExportData = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finwise-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importData(text);
      await loadData();
      setSaveMessage('Data imported successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      await clearAllData();
      await loadData();
      setSaveMessage('All data cleared!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!appState) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">✓ {saveMessage}</p>
            </div>
          )}

          {/* Processing Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Processing Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900 dark:text-white">
                    Auto-process uploads
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically analyze files after upload
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appState.settings.autoProcess}
                    onChange={(e) => handleSettingChange('autoProcess', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900 dark:text-white">
                    Enable Reminders
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get browser notifications for reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appState.settings.enableReminders}
                    onChange={(e) => handleSettingChange('enableReminders', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-900 dark:text-white mb-2 block">
                  Privacy Mode
                </label>
                <select
                  value={appState.settings.privacyMode}
                  onChange={(e) => handleSettingChange('privacyMode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="server-allowed">Allow server processing (recommended)</option>
                  <option value="browser-only">Browser-only (no server calls)</option>
                </select>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {appState.settings.privacyMode === 'browser-only'
                    ? '⚠️ Browser-only mode will limit AI functionality'
                    : '✓ Extracted text sent to Gemini AI via secure server'}
                </p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Export Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Download all your data as JSON for backup
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export All Data
                </button>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Import Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Restore data from a previous export
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Permanently delete all stored data (cannot be undone)
                </p>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <strong>FinWise Agent</strong> v1.0.0
              </p>
              <p>Powered by Gemini 2.0 Flash</p>
              <p>Built with Next.js 16 & React 19</p>
              <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
                🔒 All data is stored locally in your browser using IndexedDB.
                No server database is used.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
