import Slider from '@react-native-community/slider';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreGameScreen() {
    const { id, title, gameMode } = useLocalSearchParams();

    const [gamePoints, setGamePoints] = useState(5);   
    const [difficultyLevel, setDifficultyLevel] = useState(3);

    // شروع‌کننده (فقط برای حالت AI معنی دارد)
    const [firstPlayer, setFirstPlayer] = useState('player');

    const isTwoPlayer = gameMode === 'twoPlayer';

    // کمک می‌کند مقدار اسلایدر را به عدد فرد (1 تا 15) محدود کند
    const enforceOdd = (value) => {
        let clamped = Math.min(15, Math.max(1, Math.round(value)));
        if (clamped % 2 === 0) {
            clamped = clamped + 1;
            if (clamped > 15) clamped = 15;
        }
        return clamped;
    };

    const handleGameLengthChange = (value) => {
        setGamePoints(enforceOdd(value));
    };

    const handleDifficultyChange = (value) => {
        setDifficultyLevel(value);
    };

    const startGame = () => {
        // به صفحه بازی برو و تمام تنظیمات را به عنوان پارامتر ارسال کن
        router.push({
            pathname: `/game/${id}`,
            params: {
                title: title,
                gameMode: gameMode,
                targetScore: gamePoints,      // امتیاز لازم برای بردن
                aiLevel: difficultyLevel,  // سطح سختی (عدد 1 تا 15)
                firstPlayer: firstPlayer,
            },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* بخش طول بازی (امتیاز مورد نیاز) */}
                <Text style={styles.sectionTitle}>طول بازی</Text>
                <View style={styles.cardRow}>
                    <View style={styles.valueBox}>
                        <Text style={styles.valueLabel}>امتیاز</Text>
                        <Text style={styles.valueNumber}>{gamePoints}</Text>
                    </View>
                    <View style={styles.sliderWrapper}>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={15}
                            step={2}
                            value={gamePoints}
                            onValueChange={handleGameLengthChange}
                            minimumTrackTintColor="#1a4b6e"
                            maximumTrackTintColor="#cfdfed"
                            thumbTintColor="#1a4b6e"
                        />
                    </View>
                </View>

                {/* بخش سختی (فقط در حالت هوش مصنوعی یا تک نفره نمایش داده شود) */}
                {!isTwoPlayer && (
                    <>
                        <Text style={styles.sectionTitle}>سختی</Text>
                        <View style={styles.cardRow}>
                            <View style={styles.valueBox}>
                                <Text style={styles.valueNumber}>{difficultyLevel}</Text>
                                <Text style={styles.valueLabel}>(سطح)</Text>
                            </View>
                            <View style={styles.sliderWrapper}>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={10}
                                    step={1}
                                    value={difficultyLevel}
                                    onValueChange={handleDifficultyChange}
                                    minimumTrackTintColor="#1a4b6e"
                                    maximumTrackTintColor="#cfdfed"
                                    thumbTintColor="#1a4b6e"
                                />
                            </View>
                        </View>
                    </>
                )}

                {/* انتخاب شروع‌کننده (فقط برای حالت AI) */}
                {!isTwoPlayer && (
                    <>
                        <Text style={styles.sectionTitle}>شروع‌کننده</Text>
                        <View style={styles.startRow}>
                            <TouchableOpacity
                                style={[
                                    styles.playerOption,
                                    firstPlayer === 'player' && styles.activeOption,
                                ]}
                                onPress={() => setFirstPlayer('player')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        firstPlayer === 'player' && styles.activeOptionText,
                                    ]}
                                >
                                    من
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.playerOption,
                                    firstPlayer === 'ai' && styles.activeOption,
                                ]}
                                onPress={() => setFirstPlayer('ai')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        firstPlayer === 'ai' && styles.activeOptionText,
                                    ]}
                                >
                                    هوش مصنوعی
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* فاصله برای جلوگیری از همپوشانی با دکمه ثابت */}
                <View style={styles.bottomPadding} />
            </ScrollView>

            {/* دکمه ثابت پایین */}
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>شروع بازی</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e9f0fc',
    },
    scrollContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: 'Kaghaz',
        fontWeight: '800',
        color: '#1a4b6e',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    valueBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 40,
        minWidth: 100,
    },
    valueLabel: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Kaghaz',
        color: '#1a4b6e',
        marginHorizontal: 4,
    },
    valueNumber: {
        fontSize: 24,
        fontWeight: '800',
        fontFamily: 'Kaghaz',
        color: '#1a4b6e',
        marginHorizontal: 4,
        lineHeight: 32,
    },
    sliderWrapper: {
        flex: 0.7,
        marginLeft: 12,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    startRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    playerOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 8,
        borderRadius: 40,
        backgroundColor: '#e2e8f0',
    },
    activeOption: {
        backgroundColor: '#1a4b6e',
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Kaghaz',
        fontWeight: '600',
        color: '#1a4b6e',
    },
    activeOptionText: {
        color: '#ffffff',
    },
    bottomPadding: {
        height: 20,
    },
    startButton: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        backgroundColor: '#1a4b6e',
        borderRadius: 28,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    startButtonText: {
        color: '#ffffff',
        fontFamily: 'Kaghaz',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});