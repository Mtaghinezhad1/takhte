// [id].tsx
import { preGameTourSteps } from '@/constants/tourSteps';
import storageService from '@/services/storageService'; // اضافه کنید
import { CoachmarkAnchor, createTour, useCoachmark } from '@edwardloopez/react-native-coachmark';
import Slider from '@react-native-community/slider';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreGameScreen() {
  const { id, gameMode } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const { start, isActive } = useCoachmark();

  // State
  const [gamePoints, setGamePoints] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [difficultyLevelForWhite, setDifficultyLevelForWhite] = useState(3);
  const [isReady, setIsReady] = useState(false);

  const isTwoPlayer = gameMode === 'twoPlayer';
  const isAIvsAI = gameMode === 'AIvsAI';

  // فیلتر کردن استپ‌ها بر اساس حالت بازی
  const filteredSteps = isTwoPlayer
    ? preGameTourSteps.filter(step => step.id !== 'difficultySlider')
    : preGameTourSteps;

  // تنظیم امتیاز (فرد)
  const enforceOdd = (value) => {
    let clamped = Math.min(15, Math.max(1, Math.round(value)));
    return clamped % 2 === 0 ? Math.min(15, clamped + 1) : clamped;
  };

  const handleGameLengthChange = (value) => {
    setGamePoints(enforceOdd(value));
  };

  const startGame = () => {
    router.push({
      pathname: `/game/${id}`,
      params: {
        gameMode,
        targetScore: gamePoints,
        aiLevel: difficultyLevel,
        aiLevelForWhite: difficultyLevelForWhite,
        firstPlayer: 'player',
      },
    });
  };

  // تابع نمایش تور با مدیریت دستی
  const showTourIfNeeded = async () => {
    try {
      const tourId = 'pregame-tour';
      const hasCompleted = await storageService.hasTourCompleted(tourId);
      
      if (!hasCompleted) {
        // تور را شروع کن
        start(
          createTour(
            tourId,
            filteredSteps,
            { showOnce: true, delay: 800 }
          )
        );
        // بعد از نمایش تور، وضعیت را ذخیره کن
        // توجه: چون تور ممکن است طول بکشد، بعد از شروع تور ذخیره میکنیم
        await storageService.saveTourCompleted(tourId);
      }
    } catch (error) {
      console.error('خطا در نمایش تور:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setIsReady(false);
      await showTourIfNeeded();
      setIsReady(true);
    };
    
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // نمایش لودینگ
  if (!isReady) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1a4b6e" />
        <Text style={styles.loadingText}>در حال آماده‌سازی...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <View>
        {/* عنوان */}
        <Text style={styles.sectionTitle}>طول بازی</Text>

        {/* اسلایدر امتیاز */}
        <CoachmarkAnchor id="slider" shape="rect" padding={12} radius={12}>
          <View style={styles.cardRow}>
            <View style={styles.valueBox}>
              <Text style={styles.valueLabel}>امتیاز</Text>
              <Text style={styles.valueNumber}>{gamePoints}</Text>
            </View>
            <View style={styles.sliderWrapper}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={7}
                step={2}
                value={gamePoints}
                onValueChange={handleGameLengthChange}
                minimumTrackTintColor="#1a4b6e"
                maximumTrackTintColor="#cfdfed"
                thumbTintColor="#1a4b6e"
              />
            </View>
          </View>
        </CoachmarkAnchor>

        {/* تنظیمات سختی - فقط برای حالت‌های تک‌نفره */}
        {!isTwoPlayer && (
          <>
            {/* سختی سفید - فقط برای AIvsAI */}
            {isAIvsAI && (
              <>
                <Text style={styles.sectionTitle}>سختی سفید</Text>
                <View style={styles.cardRow}>
                  <View style={styles.valueBox}>
                    <Text style={styles.valueNumber}>{difficultyLevelForWhite}</Text>
                    <Text style={styles.valueLabel}>(سطح)</Text>
                  </View>
                  <View style={styles.sliderWrapper}>
                    <Slider
                      style={styles.slider}
                      minimumValue={1}
                      maximumValue={10}
                      step={1}
                      value={difficultyLevelForWhite}
                      onValueChange={setDifficultyLevelForWhite}
                      minimumTrackTintColor="#1a4b6e"
                      maximumTrackTintColor="#cfdfed"
                      thumbTintColor="#1a4b6e"
                    />
                  </View>
                </View>
              </>
            )}

            {/* سختی سیاه */}
            <Text style={styles.sectionTitle}>
              {isAIvsAI ? 'سختی سیاه' : 'سختی'}
            </Text>

            <CoachmarkAnchor id="difficultySlider" shape="rect" padding={12} radius={8}>
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
                    onValueChange={setDifficultyLevel}
                    minimumTrackTintColor="#1a4b6e"
                    maximumTrackTintColor="#cfdfed"
                    thumbTintColor="#1a4b6e"
                  />
                </View>
              </View>
            </CoachmarkAnchor>
          </>
        )}
      </View>

      {/* دکمه شروع */}
      <CoachmarkAnchor id="startButton" shape="rect" padding={12} radius={28}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
        >
          <Text style={styles.startButtonText}>شروع بازی</Text>
        </TouchableOpacity>
      </CoachmarkAnchor>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#e9f0fc',
    paddingHorizontal: 24
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f0fc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Kaghaz',
    color: '#1a4b6e',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Kaghaz',
    color: '#1a4b6e',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 28,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 16,
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
    fontFamily: 'Kaghaz',
    color: '#1a4b6e',
    marginHorizontal: 4,
  },
  valueNumber: {
    fontSize: 24,
    fontFamily: 'Kaghaz',
    color: '#1a4b6e',
    marginHorizontal: 4,
    lineHeight: 32,
  },
  sliderWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  startButton: {
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
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#ffffff',
    fontFamily: 'Kaghaz',
    fontSize: 14,
    textAlign: 'center',
  },
});