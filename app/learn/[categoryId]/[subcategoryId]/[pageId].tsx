import { learnData } from '@/constants/learnData';
import useLearningStore from '@/stores/useLearningStore';
import * as Localization from 'expo-localization';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import ContentCard from '@/components/learn/contentCard';
import LearnHeader from '@/components/learn/LearnHeader';
import Quiz from '@/components/learn/quiz';
import ActionButton from '@/components/ui/actionButton';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { I18nManager, ScrollView, StyleSheet, Text, View } from 'react-native'; // TouchableOpacity حذف شد

export default function PageContent() {
    const insets = useSafeAreaInsets();
    const { colors } = useThemeStore();

    const completeLesson = useLearningStore(state => state.completeLesson);

    const { categoryId, subcategoryId, pageId } = useLocalSearchParams();

    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);
    const page = subcategory?.pages.find(p => p.id === Number(pageId));
    const [isRTL, setIsRTL] = useState(false);

    const checkRTL = () => {
        try {
            const locales = Localization.getLocales();
            const isRTLSystem = locales[0]?.textDirection === 'rtl';
            const isRTLManager = I18nManager.isRTL;
            const finalRTL = isRTLSystem || isRTLManager;
            setIsRTL(finalRTL);
        } catch (error) {
            console.error('Error checking RTL:', error);
            setIsRTL(I18nManager.isRTL);
        }
    };

    useEffect(() => {
        checkRTL();
    }, []);

    if (!page || !subcategory || !category) {
        return <Text style={styles.notFoundText}>صفحه پیدا نشد</Text>;
    }

    const currentIndex = subcategory.pages.findIndex(p => p.id === Number(pageId));
    const quizComponent = page.components?.find(c => c.type === 'quiz');

    const hasQuiz = !!quizComponent;
    const isNextEnabled = !hasQuiz || isAnswerCorrect;
    const isLastPage = currentIndex === subcategory.pages.length - 1;

    const goNext = async () => {
        if (!isNextEnabled || currentIndex > subcategory.pages.length - 1 || isNavigating) return;

        try {
            setIsNavigating(true);
            await completeLesson(categoryId, subcategoryId, subcategory.pages[currentIndex].id);

            setIsAnswerCorrect(false);
            if (isLastPage) {
                router.push('/learn');
            } else {
                router.replace(`/learn/${categoryId}/${subcategoryId}/${subcategory.pages[currentIndex + 1].id}`);
            }
        } catch (error) {
            console.warn('goNext error:', error);
        } finally {
            setIsNavigating(false);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setIsAnswerCorrect(false);
            router.replace(`/learn/${categoryId}/${subcategoryId}/${subcategory.pages[currentIndex - 1].id}`);
        }
    };

    return (
        <LinearGradient
            colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                {/* هدر جدید */}
                <LearnHeader
                    title={subcategory.title}
                    currentLesson={currentIndex}
                    totalLessons={subcategory.pages.length}
                    onBack={() => router.back()}
                />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <ContentCard categoryId={categoryId} subcategoryId={subcategoryId} pageId={pageId} />

                    {hasQuiz && (
                        <Quiz
                            categoryId={categoryId}
                            subcategoryId={subcategoryId}
                            pageId={pageId}
                            isAnswerCorrect={isAnswerCorrect}
                            setIsAnswerCorrect={setIsAnswerCorrect}
                        />
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <ActionButton onPress={goNext} disabled={!isNextEnabled} variant={isNextEnabled ? 'confirm' : 'cancel'}>بعدی ←</ActionButton>
                    <ActionButton onPress={goPrev} disabled={currentIndex === 0} variant={currentIndex! != 0 ? 'confirm' : 'cancel'}>→ قبلی</ActionButton>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    notFoundText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        fontFamily: 'Kaghaz',
        color: '#f44336',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroContainer: {
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'right',
        fontFamily: 'Kaghaz',
        color: '#070024',
        marginBottom: 8,
    },
    contentContainer: {
        marginBottom: 20,
    },
    contentText: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '800',
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
    },
    imageAlt: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        color: '#888',
        fontFamily: 'Kaghaz',
    },
    footer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 10,
    },
});