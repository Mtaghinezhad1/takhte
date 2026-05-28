import { quarterPoints } from "@/constants/constants";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Dice from "./dice";
import PointNumber from "./pointNumber";
import QuarterBoard from "./quarterBoard";
import UndoButton from "./undoContinueButton";

const HalfBoard = ({ side }) => {
  const isLeft = side === 'left';
  const topQuarter = isLeft ? quarterPoints.topLeft : quarterPoints.topRight;
  const bottomQuarter = isLeft ? quarterPoints.bottomLeft : quarterPoints.bottomRight;

  return (
    <View style={styles.halfBoard}>
      <Image
        source={require('@/assets/images/halfBoard.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <PointNumber pointIds={topQuarter} />
      <View style={styles.container}>
        <View style={styles.quarterBoardTop}>
          <QuarterBoard
            pointIds={topQuarter}
          />
        </View>
        {isLeft && <UndoButton />}
        {!isLeft && <Dice />}

        <View style={styles.quarterBoardBottom}>
          <QuarterBoard
            pointIds={bottomQuarter}
          />
        </View>
      </View>
      <PointNumber pointIds={bottomQuarter} />
    </View>
  );
};

const styles = StyleSheet.create({
  halfBoard: {
    width: '35%',
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '45%',
  },
  quarterBoardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '45%',
  },
});

export default HalfBoard;