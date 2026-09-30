import { learnData } from '@/constants/learnData';
import { learnService } from '@/services/learnService';
import useLearningStore from '@/stores/useLearningStore';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubcategoryPage() {
    const { categoryId, subcategoryId } = useLocalSearchParams();
    const completedLessons = useLearningStore(state => state.completedLessons);
    const { colors } = useThemeStore();



    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);

    if (!category || !subcategory) {
        return <Text>زیردسته پیدا نشد</Text>;
    }

    return (
        <LinearGradient
            colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, color: colors.text }}>← بازگشت</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 24, color: colors.text, marginBottom: 20, textAlign: 'right' }}>
                    {subcategory.title}
                </Text>

                <ScrollView>
                    {subcategory.pages.map(page => {
                        const isCompeleted = learnService.isLessonCompleted(categoryId, subcategoryId, page.id, completedLessons);

                        return (
                            <TouchableOpacity
                                key={page.id}
                                style={[styles.item,{backgroundColor: colors.profileBgPrimary}, isCompeleted && styles.passed]}
                                onPress={() => router.push(`/learn/${categoryId}/${subcategoryId}/${page.id}`)}
                            >
                                <Text style={{ fontSize: 18, textAlign: 'right', color: colors.text }}>
                                    {page.title}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        position: 'relative',
        flexDirection: 'row',
        gap: 18, // works on newer RN, fallback: use margin/padding
        backgroundColor: 'rgba(14, 45, 94, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(61, 132, 255, 0.25)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 8,
        overflow: 'hidden',
    },
    passed: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    quizOptionTextCorrect: {
        color: '#fff',
    },
    quizOptionWrong: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
    },
    quizOptionTextWrong: {
        color: '#c62828',
    },
});