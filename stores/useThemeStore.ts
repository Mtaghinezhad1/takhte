import StorageService from '@/services/storageService';
import { create } from 'zustand';

// رنگ‌ها
export const lightColors = {
  card: '#1e1e1e',
  text: '#ffffff',
  primary: '#4a8aff',
  secondary: '#a78bfa',
  tertiary: '#fb923c',
  danger: '#ef4444',
  tabBarActive: '#4a8aff',
  tabBarInactive: '#888888',
  shadow: '#000000',
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
  shadow: '#000000',
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