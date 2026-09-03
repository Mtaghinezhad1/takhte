import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// آدرس پایه سرور – می‌توانید از متغیر محیطی استفاده کنید
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── کلیدهای ذخیره‌سازی ──────────────────────────────
const DEVICE_ID_KEY = '@device_id';
const TOKEN_KEY = '@auth_token';

// ─── تابع کمکی برای دریافت یا تولید deviceId ──────────
const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // اگر دستگاه اندروید/ios است، از شناسه واقعی استفاده کنید
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        deviceId = Device.osBuildId || Device.deviceName || Device.modelName;
      }
      // در غیر این صورت یک UUID ساده تولید کنید
      if (!deviceId) {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch (error) {
    console.warn('Failed to get deviceId:', error);
    return 'fallback-device-id';
  }
};

// ─── اینترسپتور درخواست ──────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    // دریافت deviceId
    const deviceId = await getDeviceId();
    config.headers['x-device-id'] = deviceId;

    // دریافت توکن (در صورت وجود)
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── اینترسپتور پاسخ (مدیریت خطاهای عمومی) ──────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // اگر خطای ۴۰۱ (Unauthorized) رخ داد، می‌توانید توکن را پاک کنید
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      // می‌توانید رویداد خروج را منتشر کنید (مثلاً با استفاده از EventEmitter)
    }
    return Promise.reject(error);
  }
);

export default apiClient;