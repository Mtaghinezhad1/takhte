import storageService from '@/services/storageService';
import { userService } from '@/services/userService';
import { create } from 'zustand';


const useUserStore = create((set, get) => ({
  username: 'بازیکن مهمان',
  avatar: require('@/assets/avatar/1 (6).jpeg'),
  elo: 1500,
  coins: 0,
  isLoading: false,


  // مقداردهی اولیه از حافظه
  initializeFromStorage: async () => {
    set({ isLoading: true });

    // بارگذاری اطلاعات کاربر
    const userData = await storageService.loadUserData();
    if (userData) {
      set({
        username: userData.username || 'بازیکن مهمان',
        avatar: userData.avatar || null,
        elo: userData.elo || 1500,
        coins: userData.coins || 0,
      });
    }

    // بارگذاری تنظیمات بازی
    const gameSettings = await storageService.loadGameSettings();
    if (gameSettings && gameSettings.defaultAiLevel) {
      // می‌توانیم تنظیمات را در جای دیگری ذخیره کنیم
    }

    set({ isLoading: false });
  },

  setUsername: async (name) => {
    set({ username: name });
    const currentState = get();
    await storageService.saveUserData({
      username: name,
      avatar: currentState.avatar,
      elo: currentState.elo,
      coins: currentState.coins
    });
  },

  setAvatar: async (imgUrl) => {
    set({ avatar: imgUrl });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatar: imgUrl,
      elo: currentState.elo,
      coins: currentState.coins
    });
  },
  
  setCoins: async (amount) => {
    set({ coins: amount });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatar: currentState.avatar,
      elo: currentState.elo,
      coins: amount
    });
  },
  
  addCoins: async (amount) => {
    const newCoins = get().coins + amount;
    set({ coins: newCoins });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatar: currentState.avatar,
      elo: currentState.elo,
      coins: newCoins
    });
  },
  
  deductCoins: async (amount) => {
    const newCoins = Math.max(0, get().coins - amount);
    set({ coins: newCoins });
    const currentState = get();
    await storageService.saveUserData({
      username: currentState.username,
      avatar: currentState.avatar,
      elo: currentState.elo,
      coins: newCoins
    });
  },

  updateEloAfterMatch: async (winner, userColor, opponentElo, matchLength = 5) => {
    const { elo: userElo, username, avatar, coins } = get(); 
    const isWin = (userColor === winner);

    const newUserElo = userService.calculateElo(userElo, opponentElo, isWin, matchLength);
    const newOpponentElo = userService.calculateElo(opponentElo, userElo, !isWin, matchLength);

    set({ elo: newUserElo });

    // ذخیره اطلاعات به‌روز شده
    await storageService.saveUserData({
      username,
      avatar,
      elo: newUserElo,
      coins
    });

    return { newUserElo, newOpponentElo };
  },

  resetUser: async () => {
    const defaultData = {
      username: 'بازیکن مهمان',
      avatar: require('@/assets/avatar/1 (6).jpeg'),
      elo: 1500,
      coins: 0,
    };
    set(defaultData);
    await storageService.saveUserData(defaultData);
  },
}));

export default useUserStore;










