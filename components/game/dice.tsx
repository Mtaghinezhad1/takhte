import useGameStore from '@/stores/useGameStore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Dice = () => {
  const dice = useGameStore(state => state.dice);
  const allDice = useGameStore(state => state.allDice);
  const activeDice = useGameStore(state => state.activeDice);
  const switchActiveDice = useGameStore(state => state.switchActiveDice);
  const showContinue = useGameStore(state => state.showContinue);
  const handleContinue = useGameStore(state => state.handleContinue);

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
    return Array(2).fill().map(() => Math.floor(Math.random() * 6) + 1); //generate 2 random dice 
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
                <View
                  key={index}
                  style={[
                    styles.dice,
                    (activeDice == dieNumber) && styles.active,
                    isUsed && styles.usedDice
                  ]}
                >
                  <Text style={styles.diceText}>{dieNumber}</Text>
                </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dice: {
    height: '80%',
    marginHorizontal: '5%',
    aspectRatio: 1,
    borderRadius: '10%',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    transform: [{ scale: 0.9 }],
  },
  diceText: {
    fontSize: 13,
    fontFamily: 'Kaghaz',
    color: '#333',
  },
  active: {
    transform: [{ scale: 0.9 }],
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