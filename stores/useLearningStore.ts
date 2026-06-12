// stores/useLearningStore.js
import { learnService } from '@/services/learnService';
import storageService from '@/services/storageService';
import { create } from 'zustand';

const useLearningStore = create((set, get) => ({
  // State
  completedLessons: {},  // ساختار: { 'beginner-intro-1': true }
  isLoading: false,
  
  // مقداردهی اولیه
  initialize: async () => {
    set({ isLoading: true });
    const saved = await storageService.loadLearningProgress();
    if (saved) {
      set({ completedLessons: saved.completedLessons || {} });
    }
    set({ isLoading: false });
  },
  
  // علامت‌گذاری درس به عنوان کامل شده
  completeLesson: async (categoryKey, subcategoryKey, lessonId) => {
    const lessonKey = `${categoryKey}-${subcategoryKey}-${lessonId}`;
    const updated = { 
      ...get().completedLessons, 
      [lessonKey]: true
    };
    
    set({ completedLessons: updated });
    await storageService.saveLearningProgress({ completedLessons: updated });
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
    await storageService.saveLearningProgress({ completedLessons: {} });
  }
}));


export default useLearningStore;