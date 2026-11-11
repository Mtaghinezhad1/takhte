import { sampleTrainingData } from '@/constants/trainData';
import { trainer } from '@/services/ai/trainer';
import React, { useState } from 'react';
import { Alert, Clipboard, Text, TouchableOpacity, View } from 'react-native';

type TrainingMode = 'all' | 'OPENING' | 'MIDDLEGAME' | 'ENDGAME';

const MODE_LABELS: Record<TrainingMode, string> = {
    all: '🚀 آموزش همه فازها',
    OPENING: '🌅 فاز شروع (Opening)',
    MIDDLEGAME: '⚔️ فاز میانی (Middlegame)',
    ENDGAME: '🏁 فاز پایانی (Endgame)',
};

const MODE_COLORS: Record<TrainingMode, string> = {
    all: '#007AFF',
    OPENING: '#FF9500',
    MIDDLEGAME: '#AF52DE',
    ENDGAME: '#34C759',
};

const TrainerPanel = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const [weights, setWeights] = useState<Record<string, unknown> | null>(null);
    const [activeMode, setActiveMode] = useState<TrainingMode | null>(null);

    const startTraining = async (mode: TrainingMode) => {
        if (isTraining) return;

        setIsTraining(true);
        setActiveMode(mode);
        setTrainingComplete(false);

        try {
            console.log('========================================');
            console.log(`🧠 شروع آموزش [${mode}]...`);
            console.log('========================================');
            console.log(`📊 تعداد نمونه‌های آموزشی: ${sampleTrainingData.length}`);

            trainer.loadTrainingDataFromJSON(sampleTrainingData);

            const trainedWeights =
                mode === 'all'
                    ? trainer.train(300, 5)
                    : trainer.trainForPhase(mode, 300, 5);

            if (trainedWeights) {
                setWeights(trainedWeights);
                setTrainingComplete(true);
                trainer.printSummary();
            } else {
                Alert.alert(
                    'اطلاعات',
                    `داده‌ای برای فاز ${mode} یافت نشد`
                );
            }
        } catch (error) {
            console.error('❌ خطا در آموزش:', error);
            Alert.alert('خطا', 'مشکلی در فرآیند آموزش رخ داد');
        } finally {
            setIsTraining(false);
            setActiveMode(null);
        }
    };

    const copyWeights = () => {
        if (!weights) {
            Alert.alert('اطلاعات', 'ابتدا آموزش را کامل کنید');
            return;
        }
        Clipboard.setString(JSON.stringify(weights, null, 2));
        Alert.alert('✅ کپی شد!', 'وزن‌ها در کلیپ‌بورد کپی شدند');
    };

    const modes: TrainingMode[] = ['all', 'OPENING', 'MIDDLEGAME', 'ENDGAME'];

    return (
        <View>
            {modes.map((mode) => {
                const isActive = isTraining && activeMode === mode;
                const disabled = isTraining;

                return (
                    <TouchableOpacity
                        key={mode}
                        onPress={() => startTraining(mode)}
                        disabled={disabled}
                        style={{
                            padding: 10,
                            backgroundColor: disabled
                                ? '#999'
                                : MODE_COLORS[mode],
                            borderRadius: 5,
                            opacity: disabled ? 0.7 : 1,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            {isActive
                                ? '⏳ در حال آموزش...'
                                : MODE_LABELS[mode]}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            {trainingComplete && weights && (
                <TouchableOpacity
                    onPress={copyWeights}
                    style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: '#555',
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        📋 کپی وزن‌ها
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default TrainerPanel;