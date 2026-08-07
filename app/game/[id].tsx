import * as Localization from 'expo-localization';
import * as NavigationBar from 'expo-navigation-bar'; // اضافه شده
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
import storageService from '@/services/storageService';
import useGameStore from '@/stores/useGameStore';



export default function Index() {
  const { gameMode, targetScore, aiLevel, aiLevelForWhite } = useLocalSearchParams();
  const store = useGameStore();
  const { height: screenHeight } = useWindowDimensions(); // واکنش‌گرا

  const [isReady, setIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('در حال آماده‌سازی...');

  const appState = useRef(AppState.currentState);
  const isSavedRef = useRef(false);
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

  // ============================================
  // 3. مقداردهی اولیه (مهمترین بخش)
  // ============================================
  useEffect(() => {
    let mounted = true;

    async function initializeGame() {
      try {
        // مرحله 1: نمایش لودینگ
        setLoadingMessage('در حال تنظیم صفحه...');

        // مرحله 2: قفل صفحه به حالت افقی
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );

        // مرحله 3: مخفی کردن نوار ناوبری اندروید
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');

        // مرحله 4: بررسی RTL
        checkRTL();

        // مرحله 5: بارگذاری داده‌های بازی
        setLoadingMessage('در حال بارگذاری بازی...');

        const savedGame = await storageService.loadGameState(gameMode);

        if (savedGame && mounted) {
          // بازی ذخیره شده وجود دارد
          store.loadSavedGame(savedGame);
        } else if (gameMode && mounted) {
          // بازی جدید
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

        // مرحله 6: آماده‌سازی کامل
        if (mounted) {
          setLoadingMessage('آماده!');
          setIsReady(true);
        }

      } catch (error) {
        console.error('Initialization error:', error);
        // حتی با خطا هم بازی را نمایش بده
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
  }, []); // فقط یکبار اجرا شود

  // ============================================
  // 4. مدیریت AppState (خروج از اپ)
  // ============================================
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

  // ============================================
  // 5. مدیریت دکمه برگشت
  // ============================================
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

  // ============================================
  // 6. مدیریت فوکوس صفحه
  // ============================================
  useFocusEffect(
    useCallback(() => {
      isSavedRef.current = false;

      return () => {
        saveGame();
      };
    }, [saveGame])
  );

  // ذخیره‌سازی هنگام unmount
  useEffect(() => {
    checkRTL();
    return () => {
      saveGame();
    };
  }, []);

  // ============================================
  // 8. ریختن تاس در شروع هر نوبت
  // ============================================
  useEffect(() => {
    if (isReady && !store.showNoMoveModal) {
      store.rollDice();
    }
  }, [store.currentTurn, isReady]);

  // ============================================
  // 9. اجرای حرکت هوش مصنوعی
  // ============================================
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        store.executeAIMove();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [store.allDice, isReady]);

  // ============================================
  // 10. نمایش لودینگ اگر آماده نیست
  // ============================================
  if (!isReady) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  };

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
          <NoMoveModal />
          <MatchEndModal />
        </View>
      </View>
    </>
  );
}

// ============================================
// 12. استایل‌ها
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070024',
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
  },
});