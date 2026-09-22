import { fetchUserProfile } from '@/services/api/userApi';
import storageService from '@/services/storageService';
import { userService } from '@/services/userService';
import { create } from 'zustand';

const DEFAULT_USER = {
  username: 'بازیکن مهمان',
  avatarKey: 'avatar_3',
  coins: 0,
  age: null,
  gender: null,
  city: '',
  province: '',
  phoneNumber: '',
  email: '',
};

const DEFAULT_ELO_HISTORY = [
  {
    elo: 1500,
    timestamp: Date.now(),
    gameMode: 'initial',
    opponent: 'system',
    result: 'initial',
    matchLength: 0,
  },
];

const DEFAULT_STATISTICS = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  totalWins: 0,
  totalGamesPlayed: 0,
  winStreak: 0,
  maxWinStreak: 0,
};

const useUserStore = create((set, get) => ({
  user: { ...DEFAULT_USER },
  isLoading: false,
  eloHistory: [...DEFAULT_ELO_HISTORY],
  statistics: { ...DEFAULT_STATISTICS },

  // ─── مقداردهی اولیه ─────────────────────────────────────
  initializeFromStorage: async () => {
    set({ isLoading: true });

    const userData = await storageService.loadUserData();
    if (userData) {
      set({
        user: {
          ...DEFAULT_USER,
          ...userData,
        },
      });
    }

    const eloHistory = await storageService.loadEloHistory();
    set({
      eloHistory: eloHistory.length > 0 ? eloHistory : [...DEFAULT_ELO_HISTORY],
    });

    const stats = await storageService.loadStatistics();
    if (stats) {
      set({ statistics: stats });
    }

    set({ isLoading: false });
  },

  initializeFromServer: async () => {
    set({ isLoading: true });

    // ۱. بارگذاری داده‌های محلی (برای fallback)
    const userData = await storageService.loadUserData();
    const eloHistory = await storageService.loadEloHistory();
    const stats = await storageService.loadStatistics();

    // به‌روزرسانی اولیه state با داده‌های محلی
    set({
      user: {
        ...DEFAULT_USER,
        ...(userData || {}),
      },
      eloHistory: eloHistory.length > 0 ? eloHistory : [...DEFAULT_ELO_HISTORY],
      statistics: stats || { ...DEFAULT_STATISTICS },
    });

    // ۲. درخواست به سرور برای دریافت جدیدترین اطلاعات
    try {
      const serverUser = await fetchUserProfile();
      if (serverUser) {
        const currentUser = get().user;
        const updatedUser = {
          ...currentUser,
          username:
            serverUser.displayName ||
            serverUser.username ||
            currentUser.username,
          avatarKey: serverUser.avatarKey || currentUser.avatarKey,
          coins: serverUser.coins ?? currentUser.coins,
          age: serverUser.age ?? currentUser.age,
          gender: serverUser.gender ?? currentUser.gender,
          city: serverUser.city || currentUser.city,
          province: serverUser.province || currentUser.province,
          phoneNumber: serverUser.phoneNumber || currentUser.phoneNumber,
          email: serverUser.email || currentUser.email,
        };
        set({ user: updatedUser });
        await storageService.saveUserData(updatedUser);
      }
    } catch (error) {
      console.warn('Failed to fetch user from server, using local data:', error);
    }

    set({ isLoading: false });
  },

  // ─── الو ─────────────────────────────────────────────────
  getCurrentElo: () => {
    const state = get();
    return state.eloHistory.length > 0
      ? state.eloHistory[state.eloHistory.length - 1].elo
      : 1500;
  },

  getHighestElo: () => {
    const state = get();
    return state.eloHistory.length > 0
      ? Math.max(...state.eloHistory.map((record) => record.elo))
      : 1500;
  },

  getEloHistory: async () => {
    return await storageService.loadEloHistory();
  },

  resetEloHistory: async () => {
    const defaultHistory = [...DEFAULT_ELO_HISTORY];
    await storageService.saveEloHistory(defaultHistory);
    set({ eloHistory: defaultHistory });
    return defaultHistory;
  },

  // ─── آمار ───────────────────────────────────────────────
  updateStatisticsAfterMatch: async (result, eloChange) => {
    try {
      const updatedStats = await storageService.updateStatistics(result);
      if (updatedStats) {
        set({ statistics: updatedStats });
      }
      return updatedStats;
    } catch (error) {
      console.error('خطا در به‌روزرسانی آمار:', error);
      return null;
    }
  },

  getStatistics: async () => {
    const stats = await storageService.getFullStatistics();
    set({ statistics: stats });
    return stats;
  },

  resetStatistics: async () => {
    const defaultStats = await storageService.resetStatistics();
    set({ statistics: defaultStats });
    return defaultStats;
  },

  // ─── ذخیره پروفایل در سرور ──────────────────────────
  // اول سرور، بعد state + persist محلی
  saveProfileToServer: async ({ username, gender }) => {
    const serverUser = await userService.updateProfile({ username, gender });

    if (serverUser) {
      const currentUser = get().user;
      const newUser = {
        ...currentUser,
        username:
          serverUser.displayName || serverUser.username || currentUser.username,
        gender: serverUser.gender || currentUser.gender,
      };
      set({ user: newUser });
      await storageService.saveUserData(newUser);
    }

    return serverUser;
  },

  // ─── به‌روزرسانی کاربر ──────────────────────────────────
  setUsername: async (name) => {
    const updatedUser = { ...get().user, username: name };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setAvatar: async (avatarKey) => {
    const updatedUser = { ...get().user, avatarKey };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setCoins: async (amount) => {
    const updatedUser = { ...get().user, coins: amount };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  addCoins: async (amount) => {
    const updatedUser = { ...get().user, coins: get().user.coins + amount };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  deductCoins: async (amount) => {
    const updatedUser = {
      ...get().user,
      coins: Math.max(0, get().user.coins - amount),
    };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setAge: async (age) => {
    const updatedUser = { ...get().user, age };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setGender: async (gender) => {
    const updatedUser = { ...get().user, gender };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setCity: async (city) => {
    const updatedUser = { ...get().user, city };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setProvince: async (province) => {
    const updatedUser = { ...get().user, province };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setPhoneNumber: async (phoneNumber) => {
    const phoneRegex = /^09[0-9]{9}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      console.warn('شماره موبایل نامعتبر است');
    }
    const updatedUser = { ...get().user, phoneNumber };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setEmail: async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      console.warn('آدرس ایمیل نامعتبر است');
    }
    const updatedUser = { ...get().user, email };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  // ─── بروزرسانی پس از بازی ──────────────────────────────
  updateEloAfterMatch: async (
    winner,
    userColor,
    opponentElo,
    matchLength = 5,
    gameMode = 'againstAI',
    opponent = 'AI'
  ) => {
    const currentUserElo = get().getCurrentElo();
    const isWin = userColor === winner;

    // محاسبه الو جدید
    const newUserElo = userService.calculateElo(
      currentUserElo,
      opponentElo,
      isWin,
      matchLength
    );
    const newOpponentElo = userService.calculateElo(
      opponentElo,
      currentUserElo,
      !isWin,
      matchLength
    );

    await storageService.addEloRecord(
      newUserElo,
      gameMode,
      opponent,
      isWin ? 'win' : 'loss',
      matchLength
    );

    // به‌روزرسانی local state
    const updatedHistory = await storageService.loadEloHistory();
    set({ eloHistory: updatedHistory });

    // به‌روزرسانی آمار
    const result = isWin ? 'win' : 'loss';
    await get().updateStatisticsAfterMatch(result, newUserElo);

    return { newUserElo, newOpponentElo };
  },

  // ─── ریست ───────────────────────────────────────────────
  resetUser: async () => {
    set({ user: { ...DEFAULT_USER } });
    await storageService.saveUserData(DEFAULT_USER);
    await get().resetEloHistory();
  },
}));

export default useUserStore;