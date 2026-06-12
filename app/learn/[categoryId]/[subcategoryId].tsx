import { learnData } from '@/constants/learnData';
import { learnService } from '@/services/learnService';
import useLearningStore from '@/stores/useLearningStore';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SubcategoryPage() {
    const { categoryId, subcategoryId } = useLocalSearchParams();
    const completedLessons = useLearningStore(state => state.completedLessons);


    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);

    if (!category || !subcategory) {
        return <Text>زیردسته پیدا نشد</Text>;
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontFamily: 'Kaghaz' }}>← بازگشت</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontFamily: 'Kaghaz', marginBottom: 20, textAlign: 'right' }}>
                {subcategory.title}
            </Text>

            <ScrollView>
                {subcategory.pages.map(page => {
                    const isCompeleted = learnService.isLessonCompleted(categoryId, subcategoryId, page.id, completedLessons);

                    return (
                        <TouchableOpacity
                            key={page.id}
                            style={[styles.item, isCompeleted && styles.passed]}
                            onPress={() => router.push(`/learn/${categoryId}/${subcategoryId}/${page.id}`)}
                        >
                            <Text style={{ fontSize: 18, fontFamily: 'Kaghaz', textAlign: 'right' }}>
                                {page.title}
                            </Text>
                        </TouchableOpacity>
                    )
                }
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        backgroundColor: '#dee4e0',
        borderRadius: 12,
        marginBottom: 12,
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