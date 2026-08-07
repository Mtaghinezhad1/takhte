// Dice.tsx
import useGameStore from '@/stores/useGameStore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// کامپوننت تاس با شکل اصلی (نقطه‌ها)
const DiceFace = ({ value, isActive = false, isUsed = false, isWhiteTurn = true }) => {
  // موقعیت نقاط بر اساس عدد تاس
  const getDotPositions = (num) => {
    const positions = {
      1: [[0.5, 0.5]],
      2: [[0.2, 0.2], [0.8, 0.8]],
      3: [[0.2, 0.2], [0.5, 0.5], [0.8, 0.8]],
      4: [[0.2, 0.2], [0.2, 0.8], [0.8, 0.2], [0.8, 0.8]],
      5: [[0.2, 0.2], [0.2, 0.8], [0.5, 0.5], [0.8, 0.2], [0.8, 0.8]],
      6: [[0.2, 0.2], [0.2, 0.5], [0.2, 0.8], [0.8, 0.2], [0.8, 0.5], [0.8, 0.8]],
    };
    return positions[num] || [];
  };

  // تعیین رنگ‌ها بر اساس نوبت
  const backgroundColor = isWhiteTurn ? 'white' : '#2e2bac';
  const dotColor = isWhiteTurn ? '#2e2bac' : 'white';
  const borderColor = isWhiteTurn ? 'white' : '#2e2bac';

  return (
    <View
      style={[
        styles.dice,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
        },
        isActive && styles.active,
        isUsed && styles.usedDice
      ]}
    >
      {getDotPositions(value).map((pos, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              left: `${pos[0] * 100}%`,
              top: `${pos[1] * 100}%`,
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
              backgroundColor: dotColor,
            }
          ]}
        />
      ))}
    </View>
  );
};

const Dice = () => {
  const dice = useGameStore(state => state.dice);
  const allDice = useGameStore(state => state.allDice);
  const activeDice = useGameStore(state => state.activeDice);
  const switchActiveDice = useGameStore(state => state.switchActiveDice);
  const showContinue = useGameStore(state => state.showContinue);
  const handleContinue = useGameStore(state => state.handleContinue);
  const currentTurn = useGameStore(state => state.currentTurn); // فرض میکنیم این state وجود داره

  const [isRolling, setIsRolling] = useState(false);
  const [randomDiceValues, setRandomDiceValues] = useState([]);

  // محاسبه تعداد کل هر عدد در allDice
  const totalCounts = {};
  allDice.forEach(die => {
    totalCounts[die] = (totalCounts[die] || 0) + 1;
  });

  // محاسبه تعداد باقی‌مانده هر عدد در dice (تاس‌های استفاده نشده)
  const remainingCounts = {};
  dice.forEach(die => {
    remainingCounts[die] = (remainingCounts[die] || 0) + 1;
  });

  // تعداد استفاده شده = کل - باقی‌مانده
  const usedCounts = {};
  for (let num in totalCounts) {
    usedCounts[num] = (totalCounts[num] || 0) - (remainingCounts[num] || 0);
  }

  // برای تشخیص تاس‌های استفاده شده در حالت دابل (اعداد تکراری)
  const seen = {};

  const generateRandomDice = () => {
    return Array(2).fill().map(() => Math.floor(Math.random() * 6) + 1);
  };

  useEffect(() => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      setRandomDiceValues(generateRandomDice());
      counter++;

      if (counter == 5) {
        setIsRolling(false);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [allDice]);

  const displayDice = isRolling ? randomDiceValues : allDice;

  // تشخیص نوبت سفید یا سیاه (فرض میکنیم currentTurn برابر 'white' یا 'black' است)
  const isWhiteTurn = currentTurn === 'white';

  return (
    <View style={styles.container}>
      {
        !showContinue &&
        <TouchableOpacity
          style={styles.diceContainer}
          onPress={switchActiveDice}
          activeOpacity={0.7}
        >
          {
            displayDice.map((dieNumber, index) => {
              // شمارش تعداد تکرار هر عدد تا ایندکس جاری
              const currentSeen = (seen[dieNumber] || 0) + 1;
              seen[dieNumber] = currentSeen;
              // اگر تعداد مشاهده شده تا الان <= تعداد استفاده شده باشد، یعنی این تاس مصرف شده
              const isUsed = currentSeen <= usedCounts[dieNumber];

              return (
                <DiceFace
                  key={index}
                  value={dieNumber}
                  isActive={activeDice == dieNumber}
                  isUsed={isUsed}
                  isWhiteTurn={isWhiteTurn}
                />
              );
            })
          }
        </TouchableOpacity>
      }
      {
        showContinue &&
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!showContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>
            ادامه
          </Text>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  diceContainer: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: '80%',
    marginHorizontal: '5%',
    aspectRatio: 1,
    borderRadius: '10%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    transform: [{ scale: 0.9 }],
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: '18%',
    height: '18%',
    borderRadius: '50%',
  },
  active: {
    transform: [{ scale: 1 }],
  },
  usedDice: {
    opacity: 0.5,
  },
  continueButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2e2bac',
  },
  continueButtonText: {
    color: 'white',
    fontFamily: 'Kaghaz',
  },
});

export default Dice;