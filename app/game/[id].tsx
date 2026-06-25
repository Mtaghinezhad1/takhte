import * as Localization from 'expo-localization';
import * as NavigationBar from 'expo-navigation-bar'; // اضافه شده
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, BackHandler, I18nManager, StyleSheet, useWindowDimensions, View } from "react-native";



import HalfBoard from "@/components/game/halfBoard";
import InformModal from '@/components/game/informModal';
import Leftbar from "@/components/game/Leftbar";
import GameStatusBar from "@/components/game/leftStatusBar";
import MatchEndModal from "@/components/game/matchEndModal";
import ResultModal from '@/components/game/resultModal';
import Rightbar from "@/components/game/rightbar";
import StaticsBar from "@/components/game/staticsBar";
import storageService from '@/services/storageService';
import useGameStore from '@/stores/useGameStore';



export default function Index() {
  const { gameMode, targetScore, aiLevel, aiLevelForWhite } = useLocalSearchParams();
  const store = useGameStore();
  const { height: screenHeight } = useWindowDimensions(); // واکنش‌گرا

  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const isSavedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  // تشخیص درست RTL
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

  const saveGame = () => {
    if (isSavedRef.current) return;
    isSavedRef.current = true;
    store.saveCurrentGameState();
  };

  useEffect(() => {
    let isMounted = true;

    async function loadOrInitialize() {
      // اول چک کن بازی ذخیره شده وجود دارد یا نه
      const savedGame = await storageService.loadGameState(gameMode);

      if (savedGame && isMounted) {
        // بازی ذخیره شده وجود دارد - لود کن
        store.loadSavedGame(savedGame);
      } else if (gameMode && isMounted) {
        // بازی جدید شروع کن
        if (gameMode === 'AIvsAI') {
          store.initializeGame(gameMode, targetScore, aiLevel || '3', aiLevelForWhite || '3');
        } else {
          store.initializeGame(gameMode, targetScore, aiLevel || '3');
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    loadOrInitialize();

    // قفل صفحه به حالت افقی
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    // مخفی کردن نوار ناوبری اندروید (نوار سفید ژستی)
    async function hideNavigationBar() {
      await NavigationBar.setVisibilityAsync('hidden');
      // (اختیاری) رفتار: با اولین سوایپ از لبه، نوار موقت ظاهر شود
      await NavigationBar.setBehaviorAsync('overlay-swipe');
    }
    hideNavigationBar();

    return () => {
      isMounted = false;
      ScreenOrientation.unlockAsync();
      // برگرداندن نوار ناوبری به حالت عادی هنگام خارج شدن از صفحه
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  // مدیریت AppState (خروج از کل اپ یا سواپ کردن)
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
  }, []);

  // مدیریت دکمه برگشت (BackHandler)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      saveGame();
      router.replace('/');
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  // مدیریت فوکوس صفحه
  useFocusEffect(
    useCallback(() => {
      // ریست فلگ وقتی صفحه دوباره فوکوس می‌شود
      isSavedRef.current = false;

      return () => {
        // ذخیره هنگام ترک صفحه
        saveGame();
      };
    }, [])
  );

  // ذخیره‌سازی هنگام unmount
  useEffect(() => {
    checkRTL();
    return () => {
      saveGame();
    };
  }, []);

  // ریختن تاس در شروع هر نوبت
  useEffect(() => {
    if (!isLoading) {
      store.rollDice();
    }
  }, [store.currentTurn, isLoading]);

  // اجرای حرکت هوش مصنوعی
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        store.executeAIMove();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [store.allDice, isLoading]);

  // نمایش لودینگ هنگام بررسی بازی ذخیره شده
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.board, { height: screenHeight, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <GameStatusBar />
          <Leftbar />
          <HalfBoard side="left" />
          <StaticsBar />
          <HalfBoard side="right" />
          <Rightbar />
          <ResultModal />
          <InformModal />
          <MatchEndModal />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070024',
  },
  board: {
    aspectRatio: 16 / 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#070024',
    position: 'relative',
  },
});