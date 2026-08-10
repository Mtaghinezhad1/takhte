// [id].tsx
import * as Localization from 'expo-localization';
import * as NavigationBar from 'expo-navigation-bar';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, BackHandler, I18nManager, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import HalfBoard from "@/components/game/halfBoard";
import InformModal from '@/components/game/informModal';
import Leftbar from "@/components/game/Leftbar";
import GameStatusBar from "@/components/game/leftStatusBar";
import MatchEndModal from "@/components/game/matchEndModal";
import NoMoveModal from '@/components/game/noMoveModal';
import ResultModal from '@/components/game/resultModal';
import Rightbar from "@/components/game/rightbar";
import StaticsBar from "@/components/game/staticsBar";
import TourCoachmark from '@/components/TourCoachmark';
import { gameTourSteps } from '@/constants/tourSteps';
import { useTour } from '@/hooks/useTour';
import storageService from '@/services/storageService';
import useGameStore from '@/stores/useGameStore';

export default function Index() {
  const { gameMode, targetScore, aiLevel, aiLevelForWhite } = useLocalSearchParams();
  const store = useGameStore();
  const { height: screenHeight } = useWindowDimensions();

  const [isReady, setIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('در حال آماده‌سازی...');
  const [isMeasuring, setIsMeasuring] = useState(true);

  const appState = useRef(AppState.currentState);
  const isSavedRef = useRef(false);
  const [isRTL, setIsRTL] = useState(false);

  // ========== تور ==========
  const tour = useTour('game', gameTourSteps, {
    autoStart: true,
    delay: 1500, // تاخیر بیشتر چون صفحه بازی سنگین‌تره
    onComplete: () => console.log('Game tour completed'),
  });

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

  const saveGame = () => {
    if (isSavedRef.current) return;
    isSavedRef.current = true;
    store.saveCurrentGameState();
  };

  // ========== اندازه‌گیری موقعیت‌ها ==========
  const measurePositions = () => {
    setIsMeasuring(true);
    // موقعیت‌ها توسط CoachmarkAnchor خودکار اندازه‌گیری می‌شوند
    // فقط کافی است بعد از آماده شدن صفحه، اندازه‌گیری را غیرفعال کنیم
    setTimeout(() => {
      setIsMeasuring(false);
    }, 500);
  };

  // ========== مقداردهی اولیه ==========
  useEffect(() => {
    let mounted = true;

    async function initializeGame() {
      try {
        setLoadingMessage('در حال تنظیم صفحه...');
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        checkRTL();

        setLoadingMessage('در حال بارگذاری بازی...');
        const savedGame = await storageService.loadGameState(gameMode);

        if (savedGame && mounted) {
          store.loadSavedGame(savedGame);
        } else if (gameMode && mounted) {
          if (gameMode === 'AIvsAI') {
            store.initializeGame(
              gameMode,
              targetScore,
              aiLevel || '3',
              aiLevelForWhite || '3'
            );
          } else {
            store.initializeGame(gameMode, targetScore, aiLevel || '3');
          }
        }

        if (mounted) {
          setLoadingMessage('آماده!');
          setIsReady(true);
          // بعد از آماده شدن صفحه، موقعیت‌ها را اندازه‌گیری کن
          setTimeout(measurePositions, 800);
        }

      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setLoadingMessage('خطا در بارگذاری، اما بازی ادامه دارد...');
          setIsReady(true);
          setTimeout(measurePositions, 800);
        }
      }
    }

    initializeGame();

    return () => {
      mounted = false;
      ScreenOrientation.unlockAsync();
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  // ========== مدیریت AppState ==========
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
        saveGame();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [saveGame]);

  // ========== مدیریت دکمه برگشت ==========
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      saveGame();
      router.replace('/');
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [saveGame]);

  // ========== مدیریت فوکوس صفحه ==========
  useFocusEffect(
    useCallback(() => {
      isSavedRef.current = false;
      return () => {
        saveGame();
      };
    }, [saveGame])
  );

  // ========== ذخیره‌سازی هنگام unmount ==========
  useEffect(() => {
    checkRTL();
    return () => {
      saveGame();
    };
  }, []);

  // ========== ریختن تاس در شروع هر نوبت ==========
  useEffect(() => {
    if (isReady && !store.showNoMoveModal) {
      store.rollDice();
    }
  }, [store.currentTurn, isReady]);

  // ========== اجرای حرکت هوش مصنوعی ==========
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        store.executeAIMove();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [store.allDice, isReady]);

  // ========== نمایش لودینگ ==========
  if (!isReady) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  if (isMeasuring && !tour.isVisible) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>در حال آماده‌سازی تور...</Text>
      </View>
    );
  }

  // ========== رندر اصلی ==========
  return (
    <>
      <View style={styles.container}>
        <GameStatusBar />

        <View style={[styles.board, { height: screenHeight, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

          <Leftbar />

          <HalfBoard side="left" />
          <StaticsBar />
          <HalfBoard side="right" />

          <Rightbar />

          {/* مودال‌ها */}
          <ResultModal />
          <InformModal />
          <NoMoveModal />
          <MatchEndModal />
        </View>
      </View>

      {/* تور Coachmark */}
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
        steps={gameTourSteps.map(step => ({
          ...step,
          target: step.target,
          description: step.content,
        }))}
      />
    </>
  );
}

// ========== استایل‌ها ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6746ec',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070024',
    gap: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  board: {
    flex: 1,
    aspectRatio: 16 / 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070024',
    position: 'relative',
    borderRadius: 16,
  },
});