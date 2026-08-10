// [id].tsx
import TourCoachmark from '@/components/TourCoachmark';
import { preGameTourSteps } from '@/constants/tourSteps';
import { useTour } from '@/hooks/useTour';
import { CoachmarkAnchor } from '@edwardloopez/react-native-coachmark';
import Slider from '@react-native-community/slider';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreGameScreen() {
  const { id, gameMode } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [gamePoints, setGamePoints] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [difficultyLevelForWhite, setDifficultyLevelForWhite] = useState(3);
  const [firstPlayer, setFirstPlayer] = useState('player');
  const [isMeasuring, setIsMeasuring] = useState(true);

  const isTwoPlayer = gameMode === 'twoPlayer';
  
  // refs برای موقعیت‌یابی
  const titleRef = useRef(null);
  const sliderRef = useRef(null);
  const difficultySliderRef = useRef(null);
  const startButtonRef = useRef(null);
  
  // فیلتر کردن استپ‌ها
  const filteredSteps = isTwoPlayer 
    ? preGameTourSteps.filter(step => step.target !== 'difficultySlider')
    : preGameTourSteps;

  // استفاده از hook تور
  const tour = useTour('pregame', filteredSteps, {
    autoStart: true,
    delay: 600,
    onComplete: () => console.log('PreGame tour completed'),
  });

  // اندازه‌گیری موقعیت‌ها
  const measurePositions = () => {
    setIsMeasuring(true);
    
    const measures = [];
    
    if (titleRef.current) {
      measures.push(new Promise((resolve) => {
        titleRef.current.measure((x, y, width, height, pageX, pageY) => {
          tour.setTargetPosition('title', {
            x: pageX + width / 2,
            y: pageY + height / 2,
          });
          resolve();
        });
      }));
    }
    
    if (sliderRef.current) {
      measures.push(new Promise((resolve) => {
        sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          tour.setTargetPosition('slider', {
            x: pageX + width / 2,
            y: pageY + height / 2,
          });
          resolve();
        });
      }));
    }
    
    if (difficultySliderRef.current && !isTwoPlayer) {
      measures.push(new Promise((resolve) => {
        difficultySliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          tour.setTargetPosition('difficultySlider', {
            x: pageX + width / 2,
            y: pageY + height / 2,
          });
          resolve();
        });
      }));
    }
    
    if (startButtonRef.current) {
      measures.push(new Promise((resolve) => {
        startButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
          tour.setTargetPosition('startButton', {
            x: pageX + width / 2,
            y: pageY + height / 2,
          });
          resolve();
        });
      }));
    }
    
    Promise.all(measures).then(() => {
      setIsMeasuring(false);
    });
  };

  useEffect(() => {
    const timer = setTimeout(measurePositions, 500);
    return () => clearTimeout(timer);
  }, []);

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

  const startGame = () => {
    router.push({
      pathname: `/game/${id}`,
      params: {
        gameMode: gameMode,
        targetScore: gamePoints,
        aiLevel: difficultyLevel,
        aiLevelForWhite: difficultyLevelForWhite,
        firstPlayer: firstPlayer,
      },
    });
  };

  if (isMeasuring && !tour.isVisible) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1a4b6e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* استفاده از CoachmarkAnchor برای title */}
        <CoachmarkAnchor id="title" shape="rect" padding={12} radius={8}>
          <Text 
            ref={titleRef} 
            style={styles.sectionTitle}
            onLayout={measurePositions}
          >
            طول بازی
          </Text>
        </CoachmarkAnchor>
        
        {/* استفاده از CoachmarkAnchor برای slider */}
        <CoachmarkAnchor id="slider" shape="rect" padding={12} radius={12}>
          <View 
            ref={sliderRef} 
            style={styles.cardRow}
            onLayout={measurePositions}
          >
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
        </CoachmarkAnchor>

        {!isTwoPlayer && (
          <>
            {gameMode === 'AIvsAI' && (
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

            {/* استفاده از CoachmarkAnchor برای difficultySlider */}
            <CoachmarkAnchor id="difficultySlider" shape="rect" padding={12} radius={8}>
              <Text 
                ref={difficultySliderRef} 
                style={styles.sectionTitle}
                onLayout={measurePositions}
              >
                {gameMode === 'AIvsAI' ? 'سختی سیاه' : 'سختی'}
              </Text>
            </CoachmarkAnchor>
            
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
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* استفاده از CoachmarkAnchor برای startButton */}
      <CoachmarkAnchor id="startButton" shape="rect" padding={12} radius={28}>
        <TouchableOpacity 
          ref={startButtonRef}
          style={[styles.startButton, { bottom: 24 + insets.bottom }]} 
          onPress={startGame}
          onLayout={measurePositions}
        >
          <Text style={styles.startButtonText}>شروع بازی</Text>
        </TouchableOpacity>
      </CoachmarkAnchor>

      {/* رندر تور با ارسال تمام استپ‌ها */}
      <TourCoachmark
        visible={tour.isVisible && tour.isReady}
        title={tour.currentStepData?.title}
        content={tour.currentStepData?.content}
        targetPosition={tour.targetPosition}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        onNext={tour.nextStep}
        onPrevious={tour.previousStep}
        onComplete={tour.completeTour}
        onSkip={tour.skipTour}
        isFirstStep={tour.isFirstStep}
        isLastStep={tour.isLastStep}
        tooltipBackgroundColor={tour.currentStepData?.tooltipBackgroundColor}
        enableSkip={tour.canSkip}
        steps={filteredSteps.map(step => ({
          ...step,
          target: step.target,
          description: step.content,
        }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9f0fc',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomPadding: {
    height: 20,
  },
  startButton: {
    position: 'absolute',
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
    textAlign: 'center',
  },
});