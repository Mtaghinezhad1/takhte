// [id].tsx
import { createTour, useCoachmark } from '@edwardloopez/react-native-coachmark';
import * as Localization from 'expo-localization';
import * as NavigationBar from 'expo-navigation-bar';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, BackHandler, I18nManager, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import GameStatusBar from "@/components/game/gameStatusBar";
import HalfBoard from "@/components/game/halfBoard";
import InformModal from '@/components/game/informModal';
import Leftbar from "@/components/game/Leftbar";
import MatchEndModal from "@/components/game/matchEndModal";
import NoMoveModal from '@/components/game/noMoveModal';
import ResultModal from '@/components/game/resultModal';
import Rightbar from "@/components/game/rightbar";
import StaticsBar from "@/components/game/staticsBar";
import { gameTourSteps } from '@/constants/tourSteps';
import storageService from '@/services/storageService';
import useGameStore from '@/stores/useGameStore';

export default function Index() {
  const { gameMode, targetScore, aiLevel, aiLevelForWhite } = useLocalSearchParams();
  const store = useGameStore();
  const { start, isActive } = useCoachmark();

  const { height: screenHeight } = useWindowDimensions();

  const [isReady, setIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('در حال آماده‌سازی...');
  const [isMeasuring, setIsMeasuring] = useState(true);

  const appState = useRef(AppState.currentState);
  const isSavedRef = useRef(false);
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

  const saveGame = () => {
    if (isSavedRef.current) return;
    isSavedRef.current = true;
    store.saveCurrentGameState();
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
              aiLevel || '5',
              aiLevelForWhite || '5'
            );
          } else {
            store.initializeGame(gameMode, targetScore, aiLevel || '5');
          }
        }

        if (mounted) {
          setLoadingMessage('آماده!');
          setIsReady(true);
          // بعد از آماده شدن صفحه، موقعیت‌ها را اندازه‌گیری کن
        }

        //----------------game tour---------------------
        const tourId = 'game-tour';
        const hasCompleted = await storageService.hasTourCompleted(tourId);

        if (!hasCompleted) {
          start(
            createTour(
              tourId,
              gameTourSteps,
              { showOnce: true, delay: 800 }
            )
          );
          await storageService.saveTourCompleted(tourId);
        }

      } catch (error) {
        console.error('Initialization error:', error);
        if (mounted) {
          setLoadingMessage('خطا در بارگذاری، اما بازی ادامه دارد...');
          setIsReady(true);
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

  // ========== رندر اصلی ==========
  return (
    <View style={[styles.container, { height: screenHeight }]}>
      <GameStatusBar />

      <View style={[styles.board, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

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
    backgroundColor: '#102b63',
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
    height: '95%',
    aspectRatio: 13 / 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070024',
    position: 'relative',
    borderRadius: 10,
  },
});