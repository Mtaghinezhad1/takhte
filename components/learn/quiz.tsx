import { learnData } from '@/constants/learnData';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const Quiz = ({ categoryId, subcategoryId, pageId, isAnswerCorrect, setIsAnswerCorrect }) => {
    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);
    const page = subcategory?.pages.find(p => p.id === Number(pageId));
    const quizComponent = page.components?.find(c => c.type === 'quiz');

    const [selectedAnswer, setSelectedAnswer] = useState(null);


    const handleAnswer = (selectedIndex) => {
        if (isAnswerCorrect) return;

        setSelectedAnswer(selectedIndex);
        if (selectedIndex === quizComponent.correctAnswer) {
            setIsAnswerCorrect(true);
        }
    };




    return (
        <LinearGradient
            colors={['rgba(4, 42, 82, 0.86)', 'rgba(2, 25, 52, 0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Header */}
            <View style={styles.questionHeader}>
                <Text style={styles.questionTitle}>سوال</Text>
            </View>

            {/* Question text */}
            <Text style={styles.questionText}>{quizComponent.question}</Text>

            {/* Answer options */}
            <View style={styles.answersContainer}>
                {quizComponent.options.map((option, idx) => {
                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => handleAnswer(idx)}
                            disabled={isAnswerCorrect}
                            activeOpacity={0.7}
                        >

                            {isAnswerCorrect ? (
                                <LinearGradient
                                    colors={[
                                        'rgba(0, 116, 255, 0.22)',
                                        'rgba(0, 55, 115, 0.55)',
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.answer, styles.answerSelected]}
                                >
                                    <Text style={styles.answerText}>{option}</Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.answer}>
                                    <Text style={styles.answerText}>{option}</Text>
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

    quizContainer: {
        padding: 20,
        borderRadius: 16,
        marginVertical: 20,
        borderWidth: 1,
    },
    quizQuestion: {
        fontSize: 20,
        fontFamily: 'Kaghaz',
        marginBottom: 20,
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
        fontWeight: '800',
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
        lineHeight: 28, // ~2
        marginBottom: 15,
        textAlign: 'right',
    },
    answersContainer: {
        gap: 0, // spacing handled by marginTop on each answer
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
    answerSelected: {
        borderWidth: 2,
        borderColor: '#0095ff',
        shadowColor: '#0084ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 6,
        paddingVertical: 11, // compensate for thicker border
        paddingHorizontal: 16,
    },
    answerText: {
        color: '#d5e6fa',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'right',
    },
});

export default Quiz;