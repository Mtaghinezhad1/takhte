import apiClient from './apiClient';

export const lessonApi = {
    // دریافت تمام درس‌ها
    fetchLessons: async () => {
        const response = await apiClient.get('/api/v1/lessons');
        return response.data?.data || [];
    },

    // ارسال پیشرفت یک درس
    sendProgress: async (categoryKey, subcategoryKey, lessonId) => {
        await apiClient.post('/api/v1/lessons/progress', {
            categoryKey,
            subcategoryKey,
            lessonId,
            completed: true,
        });
    },
};