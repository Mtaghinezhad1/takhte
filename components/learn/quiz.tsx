import { learnData } from '@/constants/learnData';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Quiz = ({ categoryId, subcategoryId, pageId, isAnswerCorrect, setIsAnswerCorrect }) => {
    const { colors } = useThemeStore();

    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);
    const page = subcategory?.pages.find(p => p.id === Number(pageId));
    const quizComponent = page.components?.find(c => c.type === 'quiz');

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const handleAnswer = (selectedIndex: number) => {
        if (isAnswerCorrect) return;

        setSelectedAnswer(selectedIndex);
        if (selectedIndex === quizComponent.correctAnswer) {
            setIsAnswerCorrect(true);
        }
    };

    return (
        <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Header */}
            <View style={styles.questionHeader}>
                <Text style={[styles.questionTitle, { color: colors.text }]}>سوال</Text>
            </View>

            {/* Question text */}
            <Text style={[styles.questionText, { color: colors.text }]}>{quizComponent.question}</Text>

            {/* Answer options */}
            <View style={styles.answersContainer}>
                {quizComponent.options.map((option, idx) => {
                    const isThisCorrect = idx === quizComponent.correctAnswer;
                    const isThisSelected = selectedAnswer === idx;

                    // گزینه درست بعد از پاسخ صحیح → هایلایت سبز/آبی
                    const showAsCorrect = isAnswerCorrect && isThisCorrect;
                    // گزینه‌ای که کاربر اشتباه انتخاب کرده → هایلایت قرمز
                    const showAsWrong = !isAnswerCorrect && isThisSelected;

                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => handleAnswer(idx)}
                            disabled={isAnswerCorrect}
                            activeOpacity={0.7}
                        >
                            {showAsCorrect ? (
                                <LinearGradient
                                    colors={[
                                        'rgba(0, 200, 120, 0.28)',
                                        'rgba(0, 110, 70, 0.55)',
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.answer, styles.answerCorrect]}
                                >
                                    <Text style={[styles.answerText, styles.answerTextCorrect]}>
                                        {option}
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View
                                    style={[
                                        styles.answer,
                                        showAsWrong && styles.answerWrong,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.answerText,
                                            { color: colors.text },
                                            showAsWrong && styles.answerTextWrong,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(0, 127, 255, 0.42)',
        paddingVertical: 22,
        paddingHorizontal: 14,
        marginBottom: 18,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 35,
        elevation: 8,
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    questionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#f4f8ff',
        textAlign: 'right',
    },
    questionText: {
        color: '#dbeaff',
        fontSize: 14,
        lineHeight: 28,
        marginBottom: 15,
        textAlign: 'right',
    },
    answersContainer: {
        gap: 0,
    },
    answer: {
        minHeight: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(0, 122, 255, 0.38)',
        backgroundColor: 'rgba(3, 37, 76, 0.65)',
        marginTop: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 17,
        paddingVertical: 12,
    },
    answerCorrect: {
        borderWidth: 2,
        borderColor: '#00c878',
        shadowColor: '#00c878',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
        paddingVertical: 11,
        paddingHorizontal: 16,
    },
    answerWrong: {
        borderWidth: 2,
        borderColor: '#ff4d4f',
        backgroundColor: 'rgba(120, 20, 30, 0.55)',
        shadowColor: '#ff4d4f',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
        paddingVertical: 11,
        paddingHorizontal: 16,
    },
    answerText: {
        color: '#d5e6fa',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'right',
    },
    answerTextCorrect: {
        color: '#eafff5',
        fontWeight: '700',
    },
    answerTextWrong: {
        color: '#ffe3e3',
        fontWeight: '600',
    },
});

export default Quiz;