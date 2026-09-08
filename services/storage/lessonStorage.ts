
import AsyncStorage from '@react-native-async-storage/async-storage';

const COUNTER_KEY = '@lesson_cache_counter';
const LEARNING_PROGRESS = '@backgammon_learning_progress';


export const lessonStorage = {
    // ذخیره پیشرفت آموزشی
    saveLearningProgress: async (progressData) => {
        try {
            const jsonValue = JSON.stringify(progressData);
            await AsyncStorage.setItem(LEARNING_PROGRESS, jsonValue);
            return true;
        } catch (error) {
            console.error('خطا در ذخیره پیشرفت آموزشی:', error);
            return false;
        }
    },

    // بارگذاری پیشرفت آموزشی
    loadLearningProgress: async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(LEARNING_PROGRESS);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('خطا در بارگذاری پیشرفت آموزشی:', error);
            return null;
        }
    },

    // دریافت شمارنده
    getCounter: async () => {
        const val = await AsyncStorage.getItem(COUNTER_KEY);
        return val ? parseInt(val, 10) : 0;
    },

    // افزایش شمارنده
    incrementCounter: async () => {
        const current = await lessonStorage.getCounter();
        await AsyncStorage.setItem(COUNTER_KEY, String(current + 1));
    },

    // ریست شمارنده
    resetCounter: async () => {
        await AsyncStorage.setItem(COUNTER_KEY, '0');
    },
};