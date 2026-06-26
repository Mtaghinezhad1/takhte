import { learnData } from '@/constants/learnData';
import useLearningStore from '@/stores/useLearningStore';
import * as Localization from 'expo-localization';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ← اضافه کن


import { useEffect, useState } from 'react';
import { I18nManager, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function PageContent() {
    const insets = useSafeAreaInsets(); // ← اضافه کن

    const completeLesson = useLearningStore(state => state.completeLesson);
    const resetProgress = useLearningStore(state => state.resetProgress);

    const { width: screenWidth } = useWindowDimensions();
    const { categoryId, subcategoryId, pageId } = useLocalSearchParams();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);
    const page = subcategory?.pages.find(p => p.id === Number(pageId));
    const [isRTL, setIsRTL] = useState(false);

    const checkRTL = () => {
        try {
            // روش اول: از Localization
            const locales = Localization.getLocales();
            const isRTLSystem = locales[0]?.textDirection === 'rtl';

            // روش دوم: از I18nManager (برای پشتیبانی از نسخه‌های قدیمی)
            const isRTLManager = I18nManager.isRTL;

            // ترکیب هر دو روش
            const finalRTL = isRTLSystem || isRTLManager;

            setIsRTL(finalRTL);

        } catch (error) {
            console.error('Error checking RTL:', error);
            // Fallback به I18nManager
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

    const heroComponent = page.components?.find(c => c.type === 'hero');
    const contentComponent = page.components?.find(c => c.type === 'content');
    const imageComponent = page.components?.find(c => c.type === 'image');
    const quizComponent = page.components?.find(c => c.type === 'quiz');

    const hasQuiz = !!quizComponent;
    const isNextEnabled = !hasQuiz || isAnswerCorrect;
    const isLastPage = currentIndex === subcategory.pages.length - 1;

    const goNext = async () => {
        if (!isNextEnabled || currentIndex > subcategory.pages.length - 1 || isNavigating) return;


        try {
            setIsNavigating(true);
            await completeLesson(categoryId, subcategoryId, subcategory.pages[currentIndex].id);
            // await resetProgress();

            setSelectedAnswer(null);
            setIsAnswerCorrect(false);
            if (isLastPage) {
                router.push('/learn');
            } else {
                router.replace(`/learn/${categoryId}/${subcategoryId}/${subcategory.pages[currentIndex + 1].id}`);
            }
        } catch (error) {
            //dsfs
        } finally {
            setIsNavigating(false);
        }



    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setSelectedAnswer(null);
            setIsAnswerCorrect(false);
            router.replace(`/learn/${categoryId}/${subcategoryId}/${subcategory.pages[currentIndex - 1].id}`);
        }
    };

    const handleAnswer = (selectedIndex) => {
        if (isAnswerCorrect) return;

        setSelectedAnswer(selectedIndex);
        if (selectedIndex === quizComponent.correctAnswer) {
            setIsAnswerCorrect(true);
        }
    };

    return (
        <View style={[styles.container,{paddingBottom: insets.bottom}]}>
            {/* هدر */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.pageCounter}>
                    {currentIndex + 1} از {subcategory.pages.length}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* رندر hero */}
                {heroComponent && heroComponent.title && heroComponent.title.trim() !== '' && (
                    <View style={styles.heroContainer}>
                        <Text style={styles.heroTitle}>
                            {heroComponent.title}
                        </Text>
                    </View>
                )}

                {/* رندر تصویر */}
                {imageComponent && imageComponent.src && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageComponent.src}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        {imageComponent.alt && (
                            <Text style={styles.imageAlt}>
                                {imageComponent.alt}
                            </Text>
                        )}
                    </View>
                )}

                {/* رندر محتوای متنی ساده */}
                {contentComponent && (
                    <View style={styles.contentContainer}>
                        <Text style={[styles.contentText, { textAlign: isRTL ? 'left' : 'right' }]}>
                            {contentComponent.value}
                        </Text>
                    </View>
                )}

                {/* رندر سوال (quiz) */}
                {hasQuiz && (
                    <View style={styles.quizContainer}>
                        <Text style={[styles.quizQuestion, { textAlign: isRTL ? 'left' : 'right' }]}>
                            {quizComponent.question}
                        </Text>

                        {quizComponent.options.map((option, idx) => {
                            let optionStyle = styles.quizOption;
                            let textStyle = styles.quizOptionText;

                            if (isAnswerCorrect) {
                                if (idx === quizComponent.correctAnswer) {
                                    optionStyle = [styles.quizOption, styles.quizOptionCorrect];
                                    textStyle = [styles.quizOptionText, styles.quizOptionTextCorrect];
                                } else if (idx === selectedAnswer && idx !== quizComponent.correctAnswer) {
                                    optionStyle = [styles.quizOption, styles.quizOptionWrong];
                                    textStyle = [styles.quizOptionText, styles.quizOptionTextWrong];
                                } else {
                                    optionStyle = [styles.quizOption, styles.quizOptionDisabled];
                                }
                            }
                            else if (selectedAnswer !== null && selectedAnswer === idx && idx !== quizComponent.correctAnswer) {
                                optionStyle = [styles.quizOption, styles.quizOptionWrong];
                                textStyle = [styles.quizOptionText, styles.quizOptionTextWrong];
                            }

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={optionStyle}
                                    onPress={() => handleAnswer(idx)}
                                    disabled={isAnswerCorrect}
                                    activeOpacity={0.7}
                                >
                                    <Text style={textStyle}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        {isAnswerCorrect && (
                            <View style={styles.correctMessageContainer}>
                                <Text style={styles.correctMessage}>
                                    ✅ آفرین! جواب صحیح است. اکنون می‌توانید به صفحه بعد بروید.
                                </Text>
                            </View>
                        )}

                        {selectedAnswer !== null && !isAnswerCorrect && (
                            <View style={styles.wrongMessageContainer}>
                                <Text style={styles.wrongMessage}>
                                    ❌ جواب اشتباه است. دوباره تلاش کنید!
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* دکمه‌های پایین */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={goNext}
                    disabled={!isNextEnabled}
                    style={[
                        styles.nextButton,
                        (!isNextEnabled) && styles.nextButtonDisabled
                    ]}
                >
                    <Text style={styles.buttonText}>بعدی ←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={goPrev}
                    disabled={currentIndex === 0}
                    style={[
                        styles.prevButton,
                        currentIndex === 0 && styles.prevButtonDisabled
                    ]}
                >
                    <Text style={styles.buttonText}>→ قبلی</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    notFoundText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        fontFamily: 'Kaghaz',
        color: '#f44336',
    },
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        fontSize: 20,
        color: '#070024',
    },
    pageCounter: {
        fontSize: 16,
        fontFamily: 'Kaghaz',
        color: '#666',
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
        fontFamily: 'Kaghaz',
        color: '#333',
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
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
    quizContainer: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 16,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    quizQuestion: {
        fontSize: 20,
        fontFamily: 'Kaghaz',
        marginBottom: 20,
        color: '#070024',
        fontWeight: 'bold',
    },
    quizOption: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    quizOptionText: {
        fontFamily: 'Kaghaz',
        fontSize: 16,
        textAlign: 'right',
        color: '#333',
    },
    quizOptionCorrect: {
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
    quizOptionDisabled: {
        opacity: 0.5,
    },
    correctMessageContainer: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    correctMessage: {
        textAlign: 'center',
        color: '#2e7d32',
        fontFamily: 'Kaghaz',
        fontSize: 14,
    },
    wrongMessageContainer: {
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    wrongMessage: {
        textAlign: 'center',
        color: '#c62828',
        fontFamily: 'Kaghaz',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#070024',
        borderRadius: 10,
    },
    nextButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    prevButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#070024',
        borderRadius: 10,
    },
    prevButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Kaghaz',
        fontSize: 16,
    },
});