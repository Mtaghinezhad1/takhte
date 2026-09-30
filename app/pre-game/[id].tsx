// [id].tsx
import storageService from '@/services/storageService';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MATCH_LENGTHS = [1, 3, 5, 7];
const DIFFICULTIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const PreGameScreen = () => {
  const { id, gameMode } = useLocalSearchParams();
  const [isReady, setIsReady] = useState(true);
  const [matchLength, setMatchLength] = useState(3);
  const [difficulty, setDifficulty] = useState(5);
  const { colors } = useThemeStore();


  const isAIvsAI = gameMode === 'AIvsAI';

  const loadSavedSettings = async () => {
    try {

      const saved = await storageService.loadGameSettings();
      if (!saved) return;
      console.log(saved);
      console.log(typeof saved.matchLength);


      if (typeof saved.matchLength === 'number') {

        setMatchLength(saved.matchLength);
      }
      if (typeof saved.difficulty === 'number') {
        setDifficulty(saved.difficulty);
      }
    } catch (error) {
      console.error('خطا در بارگذاری تنظیمات:', error);
    }
  };

  const saveCurrentSettings = async () => {
    try {
      await storageService.saveGameSettings({
        matchLength,
        difficulty,
      });
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error);
    }
  };

  const startGame = async () => {
    await saveCurrentSettings();

    router.push({
      pathname: `/game/${id}`,
      params: {
        gameMode,
        targetScore: matchLength,
        aiLevel: difficulty,
        aiLevelForWhite: difficulty,
        firstPlayer: 'player',
      },
    });
  };

  useEffect(() => {
    const initialize = async () => {
      setIsReady(false);
      await loadSavedSettings();
      setIsReady(true);
    };

    initialize();
  }, []);

  // نمایش لودینگ
  if (!isReady) {
    return (
      <View style={[styles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1a4b6e" />
        <Text style={styles.loadingText}>در حال آماده‌سازی...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Decorative glow approximations */}
        <View style={styles.glowTop} />
        <View style={styles.glowRight} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.appContainer}>
            {/* Header */}
            <View style={styles.header}>

              <TouchableOpacity
                style={styles.back}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View>
                <Text style={[styles.headerTitleText, { color: colors.text }]}>تنظیمات بازی</Text>
                <Text style={styles.headerSubtitle}>
                  لطفاً تنظیمات بازی را مشخص کنید
                </Text>
              </View>
            </View>

            {/* Match length card */}
            <LinearGradient
              colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.settingsCard}
            >
              <View style={styles.sectionTitle}>
                <Text style={[styles.sectionTitleText, { color: colors.text }]}>طول بازی</Text>
                <Text style={styles.sectionIcon}>🎯</Text>
              </View>

              <Text style={styles.sectionDescription}>
                بازی تا رسیدن به امتیاز انتخابی ادامه پیدا می‌کند.
              </Text>

              <View style={styles.numbersRow}>
                {MATCH_LENGTHS.map((num) => {
                  const isActive = matchLength === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={styles.numberWrapper}
                      onPress={() => setMatchLength(num)}
                      activeOpacity={0.8}
                    >
                      {isActive ? (
                        <LinearGradient
                          colors={['#148cff', '#0757d6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.number, styles.numberActive]}
                        >
                          <Text style={[styles.numberText, styles.numberTextActive]}>
                            {num}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={[styles.number,{backgroundColor: colors.inactiveTab}]}>
                          <Text style={styles.numberText}>{num}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>


            {/* Difficulty card */}
            <LinearGradient
              colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.settingsCard}
            >
              <View style={styles.sectionTitle}>
                <Text style={[styles.sectionTitleText, { color: colors.text }]}>سختی بازی</Text>
                <Text style={styles.sectionIcon}>🧠</Text>
              </View>

              <Text style={styles.sectionDescription}>
                هرچه عدد بالاتر باشد، هوش مصنوعی قوی‌تر و حرفه‌ای‌تر بازی می‌کند.
              </Text>

              <View style={styles.numbersGrid}>
                {DIFFICULTIES.map((num) => {
                  const isActive = difficulty === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={styles.difficultyItem}
                      onPress={() => setDifficulty(num)}
                      activeOpacity={0.8}
                    >
                      {isActive ? (
                        <LinearGradient
                          colors={['#148cff', '#0757d6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.number, styles.numberActive]}
                        >
                          <Text style={[styles.numberText, styles.numberTextActive]}>
                            {num}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={[styles.number,{backgroundColor: colors.inactiveTab}]}>
                          <Text style={styles.numberText}>{num}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>


            {/* Start button */}
            <TouchableOpacity
              style={styles.startBtnWrapper}
              onPress={startGame}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#188dff', '#0757db']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>شروع بازی</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f0fc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Kaghaz',
    color: '#1a4b6e',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#020f25',
  },
  scrollContent: {
    flexGrow: 1,
  },
  appContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 18,
    paddingBottom: 40,
  },
  glowTop: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    top: -180,
    left: '50%',
    transform: [{ translateX: -175 }],
    backgroundColor: 'rgba(0, 100, 255, 0.22)',
  },
  glowRight: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '40%',
    right: -200,
    backgroundColor: 'rgba(0, 90, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 22,
    minHeight: 60,
  },
  backBtn: {
    position: 'absolute',
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 61, 113, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(20, 120, 255, 0.45)',
    shadowColor: '#006eff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  back: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0879e9',
    shadowColor: '#0082ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  backIcon: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 30,
    marginTop: -4,
  },
  headerTitleText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#f5f8ff',
    letterSpacing: -1,
    textAlign: 'center',
    textShadowColor: 'rgba(50, 140, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  headerSubtitle: {
    marginTop: 7,
    color: '#91a8ca',
    fontSize: 14,
    textAlign: 'center',
  },
  settingsCard: {
    marginTop: 18,
    paddingVertical: 23,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: 'rgba(7, 34, 69, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(28, 120, 255, 0.42)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  sectionTitleText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#f5f8ff',
    textAlign: 'right',
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionDescription: {
    color: '#91a8ca',
    fontSize: 13,
    lineHeight: 23,
    marginBottom: 17,
    textAlign: 'right',
  },
  numbersRow: {
    flexDirection: 'row',
    gap: 7,
  },
  numberWrapper: {
    flex: 1,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  difficultyItem: {
    width: '18%',
    flexGrow: 1,
  },
  number: {
    height: 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 48, 91, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(20, 120, 255, 0.42)',
  },
  numberActive: {
    borderColor: '#56b2ff',
    shadowColor: '#0082ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 8,
  },
  numberText: {
    color: '#dbe9ff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  numberTextActive: {
    color: '#ffffff',
  },
  startBtnWrapper: {
    marginTop: 20,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#0064ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 10,
  },
  startBtn: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  startBtnIcon: {
    color: '#ffffff',
    fontSize: 18,
    marginRight: 9,
  },
});

export default PreGameScreen;