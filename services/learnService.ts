import { learnData } from '@/constants/learnData';
import { lessonApi } from './api/lessonApi';
import { lessonStorage } from './storage/lessonStorage';

const MAX_CACHE_USES = 10;

export const learnService = {
    getLessonsCount(categoryKey, subcategoryKey) {
        const category = learnData.find(c => c.key === categoryKey);
        if (!category) return 0;

        const subcategory = category.subcategories.find(s => s.key === subcategoryKey);
        return subcategory ? subcategory.pages.length : 0;
    },

    isLessonCompleted(categoryKey, subcategoryKey, lessonId, completedLessons) {
        const lessonKey = `${categoryKey}-${subcategoryKey}-${lessonId}`;
        return completedLessons[lessonKey] || false;
    },

    // دریافت درس‌ها با استراتژی کش
    fetchOrLoadCachedLessons: async () => {
        const counter = await lessonStorage.getCounter();

        // اگر شمارنده کمتر از حد مجاز و کش موجود باشد
        if (counter < MAX_CACHE_USES) {
            const cached = await lessonStorage.loadLearningProgress();
            if (cached) {
                await lessonStorage.incrementCounter();
                return cached;
            }
        }

        // در غیر این صورت از سرور دریافت کن
        try {   
            const data = await lessonApi.fetchLessons();
            await lessonStorage.saveLearningProgress(data);
            await lessonStorage.resetCounter();
            return data;
        } catch (error) {
            console.warn('خطا در دریافت از سرور، استفاده از کش یا fallback');
            const cached = await lessonStorage.loadLearningProgress();

            return cached;
        }
    },

    // همگام‌سازی پیشرفت با سرور (غیرهمزمان)
    syncProgress: async (categoryKey, subcategoryKey, lessonId) => {
        try {
            await lessonApi.sendProgress(categoryKey, subcategoryKey, lessonId);
        } catch (error) {
            console.warn('خطا در همگام‌سازی با سرور:', error);
            // می‌توانید درخواست را در صف قرار دهید
        }
    },
}