import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@clockit:auth_token',
  ACTIVE_USER: '@clockit:active_user',
  DASHBOARD_CACHE: '@clockit:dashboard_cache',
  DAILY_LOGS_MAP: '@clockit:daily_logs_map',
};

/**
 * Persist the JWT auth token locally
 */
export async function saveAuthToken(token) {
  try {
    if (!token) {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Failed to save auth token to AsyncStorage:', error);
  }
}

/**
 * Retrieve the JWT auth token from local storage
 */
export async function getAuthToken() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Failed to read auth token from AsyncStorage:', error);
    return null;
  }
}

/**
 * Remove the JWT auth token from local storage
 */
export async function clearAuthToken() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Failed to clear auth token from AsyncStorage:', error);
  }
}

/**
 * Persist the current user profile locally
 */
export async function saveActiveUser(user) {
  try {
    if (!user) {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save active user to AsyncStorage:', error);
  }
}

/**
 * Retrieve the current user profile from local storage
 */
export async function getActiveUser() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to read active user from AsyncStorage:', error);
    return null;
  }
}

/**
 * Remove the current user profile and session (logout / reset)
 */
export async function clearActiveUser() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.DASHBOARD_CACHE);
  } catch (error) {
    console.error('Failed to clear active user from AsyncStorage:', error);
  }
}

/**
 * Cache full dashboard state for instantaneous 0ms restore on cold launch
 */
export async function saveCachedDashboard(dashboard) {
  try {
    if (!dashboard) return;
    await AsyncStorage.setItem(STORAGE_KEYS.DASHBOARD_CACHE, JSON.stringify(dashboard));
  } catch (error) {
    console.error('Failed to save dashboard cache to AsyncStorage:', error);
  }
}

/**
 * Retrieve cached dashboard
 */
export async function getCachedDashboard() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD_CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to read dashboard cache from AsyncStorage:', error);
    return null;
  }
}

/**
 * Save or update a specific date's log in local storage
 */
export async function saveDailyLog(dateStr, logData) {
  try {
    const all = await getAllDailyLogs();
    const updated = {
      ...all,
      [dateStr]: {
        ...(all[dateStr] || {}),
        ...logData,
        logDate: dateStr,
        updatedAt: new Date().toISOString(),
      },
    };
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS_MAP, JSON.stringify(updated));
    return updated[dateStr];
  } catch (error) {
    console.error(`Failed to save daily log for ${dateStr} to AsyncStorage:`, error);
  }
}

/**
 * Get a specific date's log from local storage
 */
export async function getDailyLog(dateStr) {
  try {
    const all = await getAllDailyLogs();
    return all[dateStr] || null;
  } catch (error) {
    console.error(`Failed to read daily log for ${dateStr} from AsyncStorage:`, error);
    return null;
  }
}

/**
 * Save full logs dictionary (e.g. after fetching from server)
 */
export async function saveAllDailyLogs(logsMap) {
  try {
    if (!logsMap || typeof logsMap !== 'object') return;
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS_MAP, JSON.stringify(logsMap));
  } catch (error) {
    console.error('Failed to save all daily logs to AsyncStorage:', error);
  }
}

/**
 * Retrieve all stored daily logs
 */
export async function getAllDailyLogs() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Failed to read all daily logs from AsyncStorage:', error);
    return {};
  }
}
