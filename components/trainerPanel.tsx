import { sampleTrainingData } from '@/constants/trainData';
import { trainer } from '@/services/ai/trainer';
import React, { useState } from 'react';
import { Alert, Clipboard, Text, TouchableOpacity, View } from 'react-native';

const TrainingButton = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [trainingComplete, setTrainingComplete] = useState(false);
    const [weights, setWeights] = useState(null);

    const startTraining = async () => {
        if (isTraining) return;

        setIsTraining(true);
        setTrainingComplete(false);

        try {
            console.log('========================================');
            console.log('🧠 شروع فرآیند آموزش...');
            console.log('========================================');
            console.log(`📊 تعداد نمونه‌های آموزشی: ${sampleTrainingData.length}`);

            // بارگذاری داده‌های آموزشی
            trainer.loadTrainingDataFromJSON(sampleTrainingData);

            // شروع آموزش
            console.log('🔄 در حال آموزش... (این کار چند لحظه طول می‌کشد)');
            console.log('----------------------------------------');

            // ✅ بدون استراتژی و فاز - خودش تشخیص می‌دهد
            const trainedWeights = trainer.train(100, 5);

            setWeights(trainedWeights);
            setTrainingComplete(true);

            console.log('========================================');
            console.log('✅ آموزش با موفقیت کامل شد!');
            console.log('========================================');

            trainer.printSummary();

        } catch (error) {
            console.error('❌ خطا در آموزش:', error);
            Alert.alert('خطا', 'مشکلی در فرآیند آموزش رخ داد');
        } finally {
            setIsTraining(false);
        }
    };

    const copyWeights = () => {
        if (!weights) {
            Alert.alert('اطلاعات', 'ابتدا آموزش را کامل کنید');
            return;
        }

        const weightsString = JSON.stringify(weights, null, 2);
        Clipboard.setString(weightsString);

        Alert.alert('✅ کپی شد!', 'وزن‌ها در کلیپ‌بورد کپی شدند');
        console.log('📋 وزن‌ها کپی شدند!');
    };

    return (
        <View>
            <TouchableOpacity
                onPress={isTraining ? null : startTraining}
                disabled={isTraining}
                style={{
                    padding: 10,
                    backgroundColor: isTraining ? '#999' : '#007AFF',
                    borderRadius: 5,
                    opacity: isTraining ? 0.7 : 1
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {isTraining ? '⏳ در حال آموزش...' : '🚀 شروع آموزش'}
                </Text>
            </TouchableOpacity>

            {trainingComplete && weights && (
                <TouchableOpacity
                    onPress={copyWeights}
                    style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: '#34C759',
                        borderRadius: 5
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

export default TrainingButton;