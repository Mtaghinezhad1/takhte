import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: '@backgammon_user_data',
  GAME_SETTINGS: '@backgammon_game_settings',
  STATISTICS: '@backgammon_statistics',
  LEARNING_PROGRESS: '@backgammon_learning_progress',
  ACTIVE_GAMES: '@backgammon_active_games'
};

class StorageService {
  // ذخیره اطلاعات کاربر
  async saveUserData(userData) {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در ذخیره اطلاعات کاربر:', error);
      return false;
    }
  }

  // بارگذاری اطلاعات کاربر
  async loadUserData() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('خطا در بارگذاری اطلاعات کاربر:', error);
      return null;
    }
  }

  // ذخیره تنظیمات بازی
  async saveGameSettings(settings) {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات بازی:', error);
      return false;
    }
  }

  // بارگذاری تنظیمات بازی
  async loadGameSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('خطا در بارگذاری تنظیمات بازی:', error);
      return null;
    }
  }

  // ذخیره آمار بازی
  async saveStatistics(stats) {
    try {
      const jsonValue = JSON.stringify(stats);
      await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در ذخیره آمار بازی:', error);
      return false;
    }
  }

  // بارگذاری آمار بازی
  async loadStatistics() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.STATISTICS);
      return jsonValue != null ? JSON.parse(jsonValue) : {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        highestElo: 1500
      };
    } catch (error) {
      console.error('خطا در بارگذاری آمار بازی:', error);
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        highestElo: 1500
      };
    }
  }

  // ذخیره پیشرفت آموزشی
  async saveLearningProgress(progressData) {
    try {
      const jsonValue = JSON.stringify(progressData);
      await AsyncStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در ذخیره پیشرفت آموزشی:', error);
      return false;
    }
  }

  // بارگذاری پیشرفت آموزشی
  async loadLearningProgress() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('خطا در بارگذاری پیشرفت آموزشی:', error);
      return null;
    }
  }

  // ذخیره وضعیت بازی در حال انجام برای یک gameMode خاص
  async saveActiveGame(gameMode, gameState) {
    try {
      // دریافت بازی‌های ذخیره شده قبلی
      const activeGames = await this.loadActiveGames();

      // بروزرسانی یا اضافه کردن بازی جدید
      activeGames[gameMode] = {
        ...gameState,
        savedAt: Date.now(),
        gameMode: gameMode
      };

      const jsonValue = JSON.stringify(activeGames);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در ذخیره وضعیت بازی:', error);
      return false;
    }
  }

  // بارگذاری تمام بازی‌های ذخیره شده
  async loadActiveGames() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_GAMES);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('خطا در بارگذاری بازی‌های ذخیره شده:', error);
      return {};
    }
  }

  // بارگذاری وضعیت یک gameMode خاص
  async loadGameState(gameMode) {
    try {
      const activeGames = await this.loadActiveGames();
      const gameState = activeGames[gameMode];

      // بررسی اگر بازی بیش از 7 روز ذخیره شده باشد، منقضی شده در نظر گرفته شود
      if (gameState && Date.now() - gameState.savedAt > 7 * 24 * 60 * 60 * 1000) {
        await this.removeActiveGame(gameMode);
        return null;
      }

      return gameState || null;
    } catch (error) {
      console.error('خطا در بارگذاری وضعیت بازی:', error);
      return null;
    }
  }

  // حذف یک بازی ذخیره شده
  async removeActiveGame(gameMode) {
    try {
      const activeGames = await this.loadActiveGames();
      delete activeGames[gameMode];
      const jsonValue = JSON.stringify(activeGames);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_GAMES, jsonValue);
      return true;
    } catch (error) {
      console.error('خطا در حذف بازی ذخیره شده:', error);
      return false;
    }
  }

  // بررسی وجود بازی ذخیره شده برای یک gameMode
  async hasActiveGame(gameMode) {
    const gameState = await this.loadGameState(gameMode);
    return gameState !== null && !gameState.isMatchEndModalVisible && !gameState.gameWinner;
  }

  // حذف تمام داده‌ها
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.GAME_SETTINGS,
        STORAGE_KEYS.STATISTICS,
        STORAGE_KEYS.LEARNING_PROGRESS,
        STORAGE_KEYS.ACTIVE_GAMES
      ]);
      return true;
    } catch (error) {
      console.error('خطا در پاک کردن داده‌ها:', error);
      return false;
    }
  }
}

export default new StorageService();