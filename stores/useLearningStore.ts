// stores/useLearningStore.js
import { learnService } from '@/services/learnService';
import { lessonStorage } from '@/services/storage/lessonStorage';
import { create } from 'zustand';

const useLearningStore = create((set, get) => ({
  // State
  completedLessons: {},  // ساختار: { 'beginner-intro-1': true }
  isLoading: false,

  // مقداردهی اولیه
  initialize: async () => {
    set({ isLoading: true });
    try {
      const saved = await learnService.fetchOrLoadCachedLessons();
      if (saved) {
        set({ completedLessons: saved.completedLessons || {} });
      }
    } catch (error) {
      console.warn('initialize error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // علامت‌گذاری درس به عنوان کامل شده
  completeLesson: async (categoryKey, subcategoryKey, lessonId) => {
    const lessonKey = `${categoryKey}-${subcategoryKey}-${lessonId}`;

    // اگر قبلاً کامل شده بود، دوباره پردازش نکن
    if (get().completedLessons[lessonKey]) return;

    const updated = {
      ...get().completedLessons,
      [lessonKey]: true,
    };

    // ۱) آپدیت state و ذخیره محلی
    set({ completedLessons: updated });
    await lessonStorage.saveLearningProgress({ completedLessons: updated });

    // ۲) ارسال به سرور (fire-and-forget، UI را بلاک نمی‌کند)
    learnService.syncProgress(categoryKey, subcategoryKey, lessonId);
  },

  // محاسبه درصد پیشرفت
  getProgress: (categoryKey, subcategoryKey) => {
    const state = get();
    const allLessons = learnService.getLessonsCount(categoryKey, subcategoryKey);
    const completed = Object.keys(state.completedLessons)
      .filter(key => key.startsWith(`${categoryKey}-${subcategoryKey}`))
      .length;

    return allLessons > 0 ? (completed / allLessons) * 100 : 0;
  },

  // ریست کردن پیشرفت (برای تست یا دیباگ)
  resetProgress: async () => {
    set({ completedLessons: {} });
    await lessonStorage.saveLearningProgress({ completedLessons: {} });
  }
}));


export default useLearningStore;