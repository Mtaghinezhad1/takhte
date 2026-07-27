import StorageService from '@/services/storageService';
import { create } from 'zustand';

// رنگ‌ها
export const lightColors = {
  background: '#ffffff',
  card: '#f8f9fa',
  text: '#1a1a1a',
  border: '#e0e0e0',
  primary: '#1d5cdd',
  secondary: '#7c3aed',
  tertiary: '#ea580c',
  danger: '#dc2626',
  tabBar: '#ffffff',
  tabBarActive: '#1d5cdd',
  tabBarInactive: '#888888',
  shadow: '#000000',
  profileBg: '#f0f2f5',
  inputBg: '#f0f2f5',
};

export const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  border: '#2c2c2c',
  primary: '#4a8aff',
  secondary: '#a78bfa',
  tertiary: '#fb923c',
  danger: '#ef4444',
  tabBar: '#1e1e1e',
  tabBarActive: '#4a8aff',
  tabBarInactive: '#888888',
  shadow: '#000000',
  profileBg: '#2a2a2a',
  inputBg: '#2a2a2a',
};

const useThemeStore = create((set, get) => ({
  theme: 'light',
  isDark: false,
  isLoading: true,
  colors: lightColors,

  // مقداردهی اولیه از storage
  initialize: async () => {
    try {
      const savedTheme = await StorageService.loadTheme();
      const isDark = savedTheme === 'dark';
      const newColors = isDark ? darkColors : lightColors;
      set({
        theme: savedTheme,
        isDark,
        isLoading: false,
        colors: newColors
      });
    } catch (error) {
      console.error('خطا در مقداردهی تم:', error);
      set({ isLoading: false });
    }
  },

  // تغییر تم
  toggleTheme: async () => {
    const { theme } = get();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const isDark = newTheme === 'dark';
    const newColors = isDark ? darkColors : lightColors;

    await StorageService.saveTheme(newTheme);
    set({ theme: newTheme, isDark, colors: newColors });
  },

  // تنظیم دستی تم
  setTheme: async (theme) => {
    const isDark = theme === 'dark';
    await StorageService.saveTheme(theme);
    set({ theme, isDark });
  },

  // دریافت رنگ‌ها
  getColors: () => {
    const { isDark } = get();
    return isDark ? darkColors : lightColors;
  }
}));

export default useThemeStore;