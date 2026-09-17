import apiClient from './apiClient';

export const lessonApi = {
    // دریافت تمام درس‌ها
    fetchLessons: async () => {
        const response = await apiClient.get('/api/v1/lessons');
        const raw = response.data?.data || [];

        // تبدیل آرایه به آبجکت تخت
        const completedLessons = {};
        for (const item of raw) {
            const key = `${item.categoryKey}-${item.subcategoryKey}-${item.lessonId}`;
            completedLessons[key] = true;
        }
        return completedLessons;
    },

    // ارسال پیشرفت یک درس
    sendProgress: async (categoryKey, subcategoryKey, lessonId) => {
        await apiClient.post('/api/v1/lessons/complete', {
            categoryKey,
            subcategoryKey,
            lessonId,
        });
    },
};