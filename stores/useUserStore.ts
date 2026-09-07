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

const useUserStore = create((set, get) => ({
  user: { ...DEFAULT_USER },
  isLoading: false,
  eloHistory: [{ elo: 1500, timestamp: Date.now(), gameMode: 'initial', opponent: 'system', result: 'initial', matchLength: 0 }],
  statistics: {
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    totalWins: 0,
    totalGamesPlayed: 0,
    winStreak: 0,
    maxWinStreak: 0
  },

  // ─── مقداردهی اولیه ─────────────────────────────────────
  initializeFromStorage: async () => {
    set({ isLoading: true });

    const userData = await storageService.loadUserData();
    if (userData) {
      set({
        user: {
          username: userData.username || DEFAULT_USER.username,
          avatarKey: userData.avatarKey || DEFAULT_USER.avatarKey,
          coins: userData.coins ?? DEFAULT_USER.coins,
          age: userData.age ?? DEFAULT_USER.age,
          gender: userData.gender ?? DEFAULT_USER.gender,
          city: userData.city || DEFAULT_USER.city,
          province: userData.province || DEFAULT_USER.province,
          phoneNumber: userData.phoneNumber || DEFAULT_USER.phoneNumber,
          email: userData.email || DEFAULT_USER.email,
        },
      });
    }

    const eloHistory = await storageService.loadEloHistory();
    set({
      eloHistory:
        eloHistory.length > 0
          ? eloHistory
          : [
            {
              elo: 1500,
              timestamp: Date.now(),
              gameMode: 'initial',
              opponent: 'system',
              result: 'initial',
              matchLength: 0,
            },
          ],
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
        username: userData?.username || DEFAULT_USER.username,
        avatarKey: userData?.avatarKey || DEFAULT_USER.avatarKey,
        coins: userData?.coins ?? DEFAULT_USER.coins,
        // ... سایر فیلدها
      },
      eloHistory: eloHistory.length > 0 ? eloHistory : [/* default */],
      statistics: stats || { /* default */ },
    });

    // ۲. درخواست به سرور برای دریافت جدیدترین اطلاعات
    try {
      const serverUser = await fetchUserProfile(); // از userApi.ts
      if (serverUser) {
        // به‌روزرسانی state با داده‌های سرور
        set({
          user: {
            username: serverUser.displayName || serverUser.username || get().user.username,
            avatarKey: serverUser.avatarKey || get().user.avatarKey,
            coins: serverUser.coins ?? get().user.coins,
            // ... سایر فیلدها (در صورت وجود)
          },
          // در صورت نیاز elo و statistics را هم از سرور به‌روز کن
        });
        // ذخیره داده‌های جدید در localStorage برای دفعات بعد
        await storageService.saveUserData(get().user);
      }
    } catch (error) {
      // در صورت خطا، همان داده‌های محلی حفظ می‌شوند
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
      ? Math.max(...state.eloHistory.map(record => record.elo))
      : 1500;
  },

  getEloHistory: async () => {
    return await storageService.loadEloHistory();
  },

  resetEloHistory: async () => {
    const defaultHistory = [{ elo: 1500, timestamp: Date.now(), gameMode: 'initial', opponent: 'system', result: 'initial', matchLength: 0 }];
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

  // ─── به‌روزرسانی کاربر ──────────────────────────────────
  setUsername: async (name) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, username: name };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setAvatar: async (avatarKey) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, avatarKey };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setCoins: async (amount) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, coins: amount };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  addCoins: async (amount) => {
    const currentUser = get().user;
    const newCoins = currentUser.coins + amount;
    const updatedUser = { ...currentUser, coins: newCoins };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  deductCoins: async (amount) => {
    const currentUser = get().user;
    const newCoins = Math.max(0, currentUser.coins - amount);
    const updatedUser = { ...currentUser, coins: newCoins };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setAge: async (age) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, age };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setGender: async (gender) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, gender };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setCity: async (city) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, city };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setProvince: async (province) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, province };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setPhoneNumber: async (phoneNumber) => {
    // اعتبارسنجی ساده (اختیاری)
    const phoneRegex = /^09[0-9]{9}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      console.warn('شماره موبایل نامعتبر است');
    }
    const currentUser = get().user;
    const updatedUser = { ...currentUser, phoneNumber };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  setEmail: async (email) => {
    // اعتبارسنجی ساده (اختیاری)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      console.warn('آدرس ایمیل نامعتبر است');
    }
    const currentUser = get().user;
    const updatedUser = { ...currentUser, email };
    set({ user: updatedUser });
    await storageService.saveUserData(updatedUser);
  },

  // ─── بروزرسانی پس از بازی ──────────────────────────────
  updateEloAfterMatch: async (winner, userColor, opponentElo, matchLength = 5, gameMode = 'againstAI', opponent = 'AI') => {
    const { username, avatarKey, coins, age, gender, city, province, phoneNumber, email, statistics } = get();
    const isWin = (userColor === winner);
    const currentUserElo = get().getCurrentElo();

    // محاسبه الو جدید
    const newUserElo = userService.calculateElo(currentUserElo, opponentElo, isWin, matchLength);
    const newOpponentElo = userService.calculateElo(opponentElo, currentUserElo, !isWin, matchLength);

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

    await storageService.saveUserData({
      username,
      avatarKey,
      coins,
      age,
      gender,
      city,
      province,
      phoneNumber,
      email,
    });

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










