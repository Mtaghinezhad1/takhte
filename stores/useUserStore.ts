import storageService from '@/services/storageService';
import { userService } from '@/services/userService';
import { create } from 'zustand';


const useUserStore = create((set, get) => ({
  username: 'بازیکن مهمان',
  avatarKey: 'avatar_3',
  coins: 0,
  age: null,
  gender: null,
  city: '',
  province: '',
  phoneNumber: '',
  email: '',
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

  initializeFromStorage: async () => {
    set({ isLoading: true });

    const userData = await storageService.loadUserData();
    if (userData) {
      set({
        username: userData.username || 'بازیکن مهمان',
        avatarKey: userData.avatarKey || 'avatar_1',
        coins: userData.coins || 0,
        age: userData.age || null,
        gender: userData.gender || null,
        city: userData.city || '',
        province: userData.province || '',
        phoneNumber: userData.phoneNumber || '',
        email: userData.email || '',
      });
    }

    const eloHistory = await storageService.loadEloHistory();
    set({
      eloHistory: eloHistory.length > 0
        ? eloHistory
        : [{ elo: 1500, timestamp: Date.now(), gameMode: 'initial', opponent: 'system', result: 'initial', matchLength: 0 }]
    });

    const stats = await storageService.loadStatistics();
    if (stats) {
      set({ statistics: stats });
    }

    set({ isLoading: false });
  },

  // دریافت الو فعلی
  getCurrentElo: () => {
    const state = get();
    return state.eloHistory.length > 0
      ? state.eloHistory[state.eloHistory.length - 1].elo
      : 1500;
  },

  // دریافت بالاترین الو
  getHighestElo: () => {
    const state = get();
    return state.eloHistory.length > 0
      ? Math.max(...state.eloHistory.map(record => record.elo))
      : 1500;
  },

  // دریافت تاریخچه کامل
  getEloHistory: async () => {
    return await storageService.loadEloHistory();
  },

  // ریست کردن تاریخچه
  resetEloHistory: async () => {
    const defaultHistory = [{ elo: 1500, timestamp: Date.now(), gameMode: 'initial', opponent: 'system', result: 'initial', matchLength: 0 }];
    await storageService.saveEloHistory(defaultHistory);
    set({ eloHistory: defaultHistory });
    return defaultHistory;
  },

  // به‌روزرسانی آمار پس از بازی
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

  // دریافت آمار کامل
  getStatistics: async () => {
    const stats = await storageService.getFullStatistics();
    set({ statistics: stats });
    return stats;
  },

  // ریست کردن آمار
  resetStatistics: async () => {
    const defaultStats = await storageService.resetStatistics();
    set({ statistics: defaultStats });
    return defaultStats;
  },

  setUsername: async (name) => {
    set({ username: name });
    const currentState = get();
    await storageService.saveUserData({
      username: name,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setAvatar: async (avatarKey) => {
    set({ avatarKey });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setCoins: async (amount) => {
    set({ coins: amount });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: amount,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  addCoins: async (amount) => {
    const newCoins = get().coins + amount;
    set({ coins: newCoins });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: newCoins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  deductCoins: async (amount) => {
    const newCoins = Math.max(0, get().coins - amount);
    set({ coins: newCoins });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: newCoins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setAge: async (age) => {
    set({ age });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setGender: async (gender) => {
    set({ gender });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setCity: async (city) => {
    set({ city });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setProvince: async (province) => {
    set({ province });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: province,
      phoneNumber: currentState.phoneNumber,
      email: currentState.email,
    });
  },

  setPhoneNumber: async (phoneNumber) => {
    // اعتبارسنجی ساده شماره موبایل (اختیاری)
    const phoneRegex = /^09[0-9]{9}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      console.warn('شماره موبایل نامعتبر است');
    }
    set({ phoneNumber });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: phoneNumber,
      email: currentState.email,
    });
  },

  setEmail: async (email) => {
    // اعتبارسنجی ساده ایمیل (اختیاری)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      console.warn('آدرس ایمیل نامعتبر است');
    }
    set({ email });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatarKey: currentState.avatarKey,
      elo: currentState.elo,
      coins: currentState.coins,
      age: currentState.age,
      gender: currentState.gender,
      city: currentState.city,
      province: currentState.province,
      phoneNumber: currentState.phoneNumber,
      email: email,
    });
  },

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

  resetUser: async () => {
    const defaultData = {
      username: 'بازیکن مهمان',
      avatarKey: 'avatar_1',
      coins: 0,
      age: null,
      gender: null,
      city: '',
      province: '',
      phoneNumber: '',
      email: '',
    };
    set(defaultData);
    await storageService.saveUserData(defaultData);
    await get().resetEloHistory();
  },
}));

export default useUserStore;










