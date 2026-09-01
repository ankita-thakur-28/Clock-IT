import { Platform } from 'react-native';

// Local Mac Wi-Fi IP for physical devices, 10.0.2.2 for Android Emulator, localhost for iOS/Web
const LOCAL_MAC_IP = '192.168.0.2';

export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  Platform.select({
    android: `http://${LOCAL_MAC_IP}:8088/api`,
    ios: `http://${LOCAL_MAC_IP}:8088/api`,
    web: 'http://localhost:8088/api',
    default: `http://${LOCAL_MAC_IP}:8088/api`,
  });

async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
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
    const res = await fetchWithTimeout(`${API_BASE}/health`, { method: 'GET' }, 1500);
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
  }, 2500);

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getUserById(id) {
  const res = await fetchWithTimeout(`${API_BASE}/users/${id}`, { method: 'GET' }, 2500);
  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

export async function fetchDashboard(userId = 1) {
  const res = await fetchWithTimeout(`${API_BASE}/v1/users/${userId}/dashboard`, { method: 'GET' }, 2500);
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
  }, 2500);

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

  const res = await fetchWithTimeout(url, { method: 'GET' }, 2500);
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
  }, 2500);

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}`);
  }
  return await res.json();
}

