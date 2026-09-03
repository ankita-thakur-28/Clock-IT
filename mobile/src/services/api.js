import { Platform } from 'react-native';
import { getAuthToken } from './storage';

// Local Mac Wi-Fi IP for physical devices, 10.0.2.2 for Android Emulator, localhost for iOS/Web
const LOCAL_MAC_IP = '192.168.0.2';

export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://clockit-backend.onrender.com/api'
    : Platform.select({
        android: 'https://clockit-backend.onrender.com/api',
        ios: 'https://clockit-backend.onrender.com/api',
        web: 'http://localhost:8088/api',
        default: 'https://clockit-backend.onrender.com/api',
      }));

async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const token = await getAuthToken();
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`, { method: 'GET' }, 8000);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'UP';
  } catch (err) {
    return false;
  }
}

export async function createUser(payload) {
  const res = await fetchWithTimeout(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }, 25000);

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getUserById(id) {
  const res = await fetchWithTimeout(`${API_BASE}/users/${id}`, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function fetchDashboard(userId = 1) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/dashboard`, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function updateTodayLog(userId = 1, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/logs/today`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function fetchUserDailyLogs(userId = 1, startDate, endDate) {
  let url = `${API_BASE}/v1/users/${userId}/logs`;
  const params = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  const res = await fetchWithTimeout(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function updateLogForDate(userId = 1, dateStr, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/logs/${dateStr}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function registerUser({ name, email, password }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }, 25000);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Registration failed with status ${res.status}`);
  }
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, 25000);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password');
  }
  return data;
}

export async function getAuthProfile() {
  const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
    method: 'GET',
  }, 15000);

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function updateUserMilestone(userId, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/milestone`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, 25000);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Failed to update milestone (HTTP ${res.status})`);
  }
  return data;
}

