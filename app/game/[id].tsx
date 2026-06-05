import * as NavigationBar from 'expo-navigation-bar'; // اضافه شده
import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import HalfBoard from "@/components/game/halfBoard";
import InformModal from '@/components/game/informModal';
import Leftbar from "@/components/game/Leftbar";
import GameStatusBar from "@/components/game/leftStatusBar";
import MatchEndModal from "@/components/game/matchEndModal";
import ResultModal from '@/components/game/resultModal';
import Rightbar from "@/components/game/rightbar";
import StaticsBar from "@/components/game/staticsBar";
import useGameStore from '@/stores/useGameStore';

export default function Index() {
  const { gameMode, targetScore, aiLevel, aiLevelForWhite } = useLocalSearchParams();
  const store = useGameStore();
  const { height: screenHeight } = useWindowDimensions(); // واکنش‌گرا

  useEffect(() => {
    if (gameMode) {
      if (gameMode === 'AIvsAI') {
        store.initializeGame(gameMode, targetScore, aiLevel || '3', aiLevelForWhite || '3');
      } else {
        store.initializeGame(gameMode, targetScore, aiLevel || '3');
      }
    }

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
      ScreenOrientation.unlockAsync();
      // برگرداندن نوار ناوبری به حالت عادی هنگام خارج شدن از صفحه
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);


  // ریختن تاس در شروع هر نوبت
  useEffect(() => {
    store.rollDice();
  }, [store.currentTurn]);

  // اجرای حرکت هوش مصنوعی
  useEffect(() => {
    const timer = setTimeout(() => {
      store.executeAIMove();
    }, 10);

    return () => clearTimeout(timer);
  }, [store.allDice]);

  return (
    <View style={styles.container}>
      <View style={[styles.board, { height: screenHeight }]}>
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