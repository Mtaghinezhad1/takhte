import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

// ─── دریافت اطلاعات کامل کاربر (صفحه اصلی) ──────────
export const fetchUserProfile = async () => {
  const response = await apiClient.get('/api/v1/me');
  // ساختار پاسخ: { success: true, data: { ...user } }
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.error || 'Failed to fetch user profile');
};

// ─── لاگین ────────────────────────────────────────────
export const loginUser = async (username, password, deviceId) => {
  const response = await apiClient.post(
    '/api/v1/auth/login',
    { username, password },
    {
      headers: {
        'x-device-id': deviceId, // در apiClient به‌صورت خودکار اضافه می‌شود، اما در صورت نیاز می‌توانید صریحاً بفرستید
      },
    }
  );
  if (response.data?.success) {
    const { token, user } = response.data.data;
    // ذخیره توکن در AsyncStorage برای درخواست‌های بعدی
    await AsyncStorage.setItem('@auth_token', token);
    return user;
  }
  throw new Error(response.data?.error || 'Login failed');
};

// ─── ارتقا از مهمان به کاربر ثبت‌شده ────────────────
export const upgradeGuest = async (userData) => {
  const response = await apiClient.post('/api/v1/auth/upgrade', userData);
  if (response.data?.success) {
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('@auth_token', token);
    return user;
  }
  throw new Error(response.data?.error || 'Upgrade failed');
};


// ─── ویرایش پروفایل ────────────────
export const updateUserProfile = async (payload) => {
  const response = await apiClient.post('/api/v1/profile/edit', payload);
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.error || 'Update profile failed');
};

// ─── ویرایش آواتار────────────────
export const updateUserAvatar = async (avatarKey: string) => {
  const response = await apiClient.post('/api/v1/profile/updateAvatar', {
    avatarKey,
  });
  if (response.data?.success) {
    return response.data.data; // user به‌روزرسانی‌شده
  }
  throw new Error(response.data?.error || 'Update avatar failed');
};

// ─── ثبت نتیجه مسابقه در سرور ──────────────────────
export const submitMatchResult = async (payload) => {
  const response = await apiClient.post('/api/v1/match/result', payload);
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.error || 'Submit match result failed');
};

// ─── خروج ─────────────────────────────────────────────
export const logout = async () => {
  await AsyncStorage.removeItem('@auth_token');
  // در صورت نیاز، deviceId را می‌توانید نگه دارید یا پاک کنید
};