import { quarterPoints } from "@/constants/constants";
import useGameStore from "@/stores/useGameStore";
import * as Localization from 'expo-localization';

import React, { useEffect, useState } from "react";
import { I18nManager, Image, StyleSheet, View } from "react-native";
import Dice from "./dice";
import ForfeitGame from "./forfeitGame";
import PointNumber from "./pointNumber";
import QuarterBoard from "./quarterBoard";
import UndoButton from "./undoContinueButton";

const HalfBoard = ({ side }) => {
  const isLeft = side === 'left';
  const showForfeit = useGameStore(state => state.showForfeit);
  const topQuarter = isLeft ? quarterPoints.topLeft : quarterPoints.topRight;
  const bottomQuarter = isLeft ? quarterPoints.bottomLeft : quarterPoints.bottomRight;
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


  useEffect(() => {
    checkRTL();

  }, []);

  return (
    <View style={styles.halfBoard}>
      <Image
        source={require('@/assets/images/halfBoard.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <PointNumber pointIds={topQuarter} />
      {showForfeit && side != 'left' && <ForfeitGame />}
      {!showForfeit && side != 'left' &&
        <View style={styles.container}>
          <View style={[styles.quarterBoardTop, {flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <QuarterBoard
              pointIds={topQuarter}
            />
          </View>
          {isLeft && <UndoButton />}
          {!isLeft && <Dice />}

          <View style={[styles.quarterBoardBottom,{flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <QuarterBoard
              pointIds={bottomQuarter}
            />
          </View>
        </View>
      }
      {
        side == 'left' &&
        <View style={styles.container}>
          <View style={[styles.quarterBoardTop, {flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <QuarterBoard
              pointIds={topQuarter}
            />
          </View>
          {isLeft && <UndoButton />}
          {!isLeft && <Dice />}

          <View style={[styles.quarterBoardBottom,{flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <QuarterBoard
              pointIds={bottomQuarter}
            />
          </View>
        </View>
      }

      <PointNumber pointIds={bottomQuarter} />
    </View>
  );
};

const styles = StyleSheet.create({
  halfBoard: {
    width: '33%',
    height: '100%',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    height: '90%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  quarterBoardTop: {
    alignItems: 'flex-start',
    height: '45%',
  },
  quarterBoardBottom: {
    alignItems: 'flex-end',
    height: '45%',
  },
});

export default HalfBoard;