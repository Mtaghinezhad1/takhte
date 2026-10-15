import { learnData } from '@/constants/learnData';
import { learnService } from '@/services/learnService';
import useLearningStore from '@/stores/useLearningStore';
import useRTLStore from '@/stores/useRTLStore';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubcategoryPage() {
    const { categoryId, subcategoryId } = useLocalSearchParams();
    const completedLessons = useLearningStore(state => state.completedLessons);
    const { colors } = useThemeStore();
    const isRTL = useRTLStore(state => state.isRTL);

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
                {/* Decorative glows (approximated; RN has no blur, so we use soft circles) */}
                <View style={[styles.glow, styles.glowOne]} />
                <View style={[styles.glow, styles.glowTwo]} />

                <TouchableOpacity
                    style={[styles.back, { borderColor: colors.border, shadowColor: colors.shadow }]}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 20, textAlign: isRTL ? 'left' : 'right', }}>
                    {subcategory.title}
                </Text>

                <ScrollView>
                    {subcategory.pages.map(page => {
                        const isCompeleted = learnService.isLessonCompleted(categoryId, subcategoryId, page.id, completedLessons);

                        return (
                            <TouchableOpacity
                                key={page.id}
                                style={[styles.item, { backgroundColor: colors.profileBgPrimary, borderColor: colors.border, shadowColor: colors.shadow }, isCompeleted && styles.passed]}
                                onPress={() => router.push(`/learn/${categoryId}/${subcategoryId}/${page.id}`)}
                            >
                                <Text style={{ fontSize: 18, textAlign: isRTL ? 'left' : 'right', color: colors.text, fontWeight: '800', }}>
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
    glow: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#1769ff',
        opacity: 0.14,
    },
    glowOne: {
        top: -120,
        right: -100,
    },
    glowTwo: {
        bottom: 100,
        left: -150,
    },
    back: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#0082ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
        overflow: 'hidden'
    },
    backIcon: {
        color: '#ffffff',
        fontSize: 28,
        lineHeight: 30,
        marginTop: -4,
    },
    item: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        position: 'relative',
        gap: 18, // works on newer RN, fallback: use margin/padding
        borderWidth: 1,
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