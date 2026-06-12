import { learnData } from "@/constants/learnData";

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
}