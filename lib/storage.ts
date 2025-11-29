import { get, set, del } from 'idb-keyval';
import type {
  AppState,
  UserProfile,
  ParsedFile,
  Transaction,
  AnalysisResult,
  Recommendation,
  Reminder,
} from '@/lib/types';

const STORAGE_KEYS = {
  APP_STATE: 'finwise_app_state',
  USER_PROFILE: 'finwise_user_profile',
  PARSED_FILES: 'finwise_parsed_files',
  TRANSACTIONS: 'finwise_transactions',
  ANALYSIS: 'finwise_analysis',
  RECOMMENDATIONS: 'finwise_recommendations',
  REMINDERS: 'finwise_reminders',
  SETTINGS: 'finwise_settings',
};

/**
 * Initialize default app state
 */
export function getDefaultAppState(): AppState {
  return {
    userProfile: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    parsedFiles: [],
    transactions: [],
    recommendations: [],
    reminders: [],
    goals: [],
    risks: [],
    behavioralTrends: [],
    transactionInsights: [],
    categoryDetails: [],
    chatHistory: [],
    settings: {
      autoProcess: true,
      enableReminders: true,
      privacyMode: 'server-allowed',
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Load complete app state from IndexedDB
 */
export async function loadAppState(): Promise<AppState> {
  try {
    const state = await get<AppState>(STORAGE_KEYS.APP_STATE);
    return state || getDefaultAppState();
  } catch (error) {
    console.error('Failed to load app state:', error);
    return getDefaultAppState();
  }
}

/**
 * Save complete app state to IndexedDB
 */
export async function saveAppState(state: AppState): Promise<void> {
  try {
    state.lastUpdated = new Date().toISOString();
    await set(STORAGE_KEYS.APP_STATE, state);
  } catch (error) {
    console.error('Failed to save app state:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const state = await loadAppState();
  state.userProfile = {
    ...state.userProfile,
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  await saveAppState(state);
}

/**
 * Add parsed file to storage
 */
export async function addParsedFile(file: ParsedFile): Promise<void> {
  const state = await loadAppState();
  state.parsedFiles.push(file);
  await saveAppState(state);
}

/**
 * Get all parsed files
 */
export async function getParsedFiles(): Promise<ParsedFile[]> {
  const state = await loadAppState();
  return state.parsedFiles;
}

/**
 * Add transactions to storage
 */
export async function addTransactions(transactions: Transaction[]): Promise<void> {
  const state = await loadAppState();
  state.transactions.push(...transactions);
  await saveAppState(state);
}

/**
 * Get all transactions
 */
export async function getTransactions(): Promise<Transaction[]> {
  const state = await loadAppState();
  return state.transactions;
}

/**
 * Save analysis result
 */
export async function saveAnalysisResult(analysis: AnalysisResult): Promise<void> {
  const state = await loadAppState();
  state.analysisResult = analysis;
  await saveAppState(state);
}

/**
 * Get analysis result
 */
export async function getAnalysisResult(): Promise<AnalysisResult | undefined> {
  const state = await loadAppState();
  return state.analysisResult;
}

/**
 * Save recommendations
 */
export async function saveRecommendations(recommendations: Recommendation[]): Promise<void> {
  const state = await loadAppState();
  state.recommendations = recommendations;
  await saveAppState(state);
}

/**
 * Get recommendations
 */
export async function getRecommendations(): Promise<Recommendation[]> {
  const state = await loadAppState();
  return state.recommendations;
}

/**
 * Add reminder
 */
export async function addReminder(reminder: Reminder): Promise<void> {
  const state = await loadAppState();
  state.reminders.push(reminder);
  await saveAppState(state);
}

/**
 * Get all reminders
 */
export async function getReminders(): Promise<Reminder[]> {
  const state = await loadAppState();
  return state.reminders;
}

/**
 * Update reminder completion status
 */
export async function updateReminder(id: string, completed: boolean): Promise<void> {
  const state = await loadAppState();
  const reminder = state.reminders.find(r => r.id === id);
  if (reminder) {
    reminder.completed = completed;
    await saveAppState(state);
  }
}

/**
 * Delete reminder
 */
export async function deleteReminder(id: string): Promise<void> {
  const state = await loadAppState();
  state.reminders = state.reminders.filter(r => r.id !== id);
  await saveAppState(state);
}

/**
 * Update settings
 */
export async function updateSettings(
  settings: Partial<AppState['settings']>
): Promise<void> {
  const state = await loadAppState();
  state.settings = { ...state.settings, ...settings };
  await saveAppState(state);
}

/**
 * Get settings
 */
export async function getSettings(): Promise<AppState['settings']> {
  const state = await loadAppState();
  return state.settings;
}

/**
 * Clear all data (reset app)
 */
export async function clearAllData(): Promise<void> {
  await del(STORAGE_KEYS.APP_STATE);
}

/**
 * Export all data as JSON
 */
export async function exportData(): Promise<string> {
  const state = await loadAppState();
  return JSON.stringify(state, null, 2);
}

/**
 * Import data from JSON
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const state = JSON.parse(jsonData) as AppState;
    await saveAppState(state);
  } catch (error) {
    console.error('Failed to import data:', error);
    throw new Error('Invalid data format');
  }
}
