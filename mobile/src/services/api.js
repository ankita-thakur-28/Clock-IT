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

async function fetchWithTimeout(url, options = {}, timeoutMs = 45000) {
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
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. The server may be waking up — please try again in a few moments.');
    }
    throw error;
  }
}

async function parseJsonResponse(res, defaultErrorMsg = 'Request failed') {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { error: text || `${defaultErrorMsg} (HTTP ${res.status})` };
  }

  if (!res.ok) {
    const message = data.error || data.message || `${defaultErrorMsg} (HTTP ${res.status})`;
    throw new Error(message);
  }
  return data;
}

export async function checkBackendHealth() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`, { method: 'GET' }, 10000);
    if (!res.ok) return false;
    const data = await parseJsonResponse(res);
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
  }, 45000);

  return await parseJsonResponse(res, 'Failed to create user');
}

export async function getUserById(id) {
  const res = await fetchWithTimeout(`${API_BASE}/users/${id}`, { method: 'GET' });
  return await parseJsonResponse(res, 'Failed to fetch user');
}

export async function fetchDashboard(userId = 1) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/dashboard`, { method: 'GET' });
  return await parseJsonResponse(res, 'Failed to fetch dashboard');
}

export async function updateTodayLog(userId = 1, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/logs/today`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await parseJsonResponse(res, 'Failed to update log');
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
  return await parseJsonResponse(res, 'Failed to fetch daily logs');
}

export async function updateLogForDate(userId = 1, dateStr, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/logs/${dateStr}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await parseJsonResponse(res, 'Failed to update log for date');
}

export async function registerUser({ name, email, password }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }, 45000);

  return await parseJsonResponse(res, 'Registration failed');
}

export async function loginUser({ email, password }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, 45000);

  return await parseJsonResponse(res, 'Invalid email or password');
}

export async function forgotPassword({ email }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }, 45000);

  return await parseJsonResponse(res, 'Failed to send verification code');
}

export async function resetPassword({ email, otp, newPassword }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  }, 45000);

  return await parseJsonResponse(res, 'Password reset failed');
}

export async function googleLogin({ email, name, googleId, avatarUrl, idToken }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, googleId, avatarUrl, idToken }),
  }, 45000);

  return await parseJsonResponse(res, 'Google login failed');
}

export async function getAuthProfile() {
  const res = await fetchWithTimeout(`${API_BASE}/auth/me`, {
    method: 'GET',
  }, 25000);

  return await parseJsonResponse(res, 'Failed to fetch profile');
}

export async function updateUserMilestone(userId, payload) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/milestone`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, 45000);

  return await parseJsonResponse(res, 'Failed to update milestone');
}

