import useGameStore from '@/stores/useGameStore';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const ForfeitGame = () => {
  const forfeitHand = useGameStore(state => state.forfeitHand);
  const forfeitMatch = useGameStore(state => state.forfeitMatch);
  const { width } = useWindowDimensions(); // واکنش‌گرا به تغییر اندازه صفحه

  // محاسبه اندازه فونت واکنش‌گرا
  const getFontSize = () => {
    if (width < 400) return 14;
    if (width < 600) return 16;
    return 18;
  };

  const handleForfeitHand = () => {
    forfeitHand();
};

  const handleForfeitMatch = () => {
    forfeitMatch();
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={handleForfeitHand}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText,{fontSize: getFontSize()}]}>واگذاری این دست</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btn}
          onPress={handleForfeitMatch}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText,{fontSize: getFontSize()}]}>واگذاری کل بازی</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#6495ed',
    alignItems: 'center',
    justifyContent: 'center',
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    color: '#ffffff', // White text for better contrast
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ForfeitGame;