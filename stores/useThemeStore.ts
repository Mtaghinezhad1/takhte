import StorageService from '@/services/storageService';
import { create } from 'zustand';

// رنگ‌ها
export const lightColors = {
  card: '#ffffff',
  text: '#111827',

  primary: '#226eff',
  secondary: '#7c5ce6',
  tertiary: '#f59e0b',
  danger: '#ef4444',

  tabBarActive: '#226eff',
  tabBarInactive: '#7b8798',

  inputBg: '#f5f8fc',

  tabBar: '#ffffff',

  // --------- buttons ----------
  btnPrimary: '#226eff',
  btnSecondary: '#4a8aff',

  cancelBtnPrimary: '#eaf2ff',
  cancelBtnSecondary: '#dbe9ff',

  // ----------- border ----------
  border: 'rgba(0, 132, 255, 0.45)',

  // ----------- background ----------
  backgroundPrimary: '#f5f9ff',
  backgroundSecondary: '#edf4ff',
  backgroundTertiary: '#e4efff',

  // ----------- profile card background ----------
  profileBgPrimary: '#ffffff',
  profileBgSecondary: '#dbe9ff',

  //----------- tabs -------------
  inactiveTab: 'rgba(0, 102, 255, 0.19)',

  //----------- shadow -------------
  shadow: '#1a6aff',

};

export const darkColors = {
  card: '#1e1e1e',
  text: '#ffffff',
  primary: '#4a8aff',
  secondary: '#a78bfa',
  tertiary: '#fb923c',
  danger: '#ef4444',
  tabBarActive: '#4a8aff',
  tabBarInactive: '#888888',
  inputBg: '#2a2a2a',

  tabBar: '#071c39',
  //---------buttons----------
  btnPrimary: '#1244a7',
  btnSecondary: '#226eff',
  cancelBtnPrimary: 'rgba(4, 20, 43, 0.95)',
  cancelBtnSecondary: 'rgba(17, 54, 98, 0.85)',
  //-----------border-------------
  border: 'rgba(91,139,213,0.25)',
  //-----------background-------------
  backgroundPrimary: '#102b63',
  backgroundSecondary: '#061636',
  backgroundTertiary: '#02091c',
  //----------- profile card background-------------
  profileBgPrimary: 'rgba(18,43,87,0.95)',
  profileBgSecondary: 'rgba(5,19,47,0.9)',
  //----------- tabs -------------
  inactiveTab: 'rgba(9, 28, 56, 0.85)',
    //----------- shadow -------------
  shadow: '#1a6aff',



};

const useThemeStore = create((set, get) => ({
  theme: 'dark',
  isDark: true,
  isLoading: true,
  colors: darkColors,

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