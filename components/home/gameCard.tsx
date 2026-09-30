import storageService from '@/services/storageService';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from 'react-native';

const GameCard = ({ game }) => {
  const isStandard = game.variant === 'standard';
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const { colors } = useThemeStore();



  const handleStartGame = async () => {
    setIsLoading(true);
    try {

      // بررسی وجود بازی ذخیره شده برای این gameMode
      const hasActiveGame = await storageService.hasActiveGame(game.mode);

      if (hasActiveGame) {
        // اگر بازی ذخیره شده وجود دارد، مستقیماً به صفحه بازی برو
        router.push({
          pathname: `/game/${game.id}`,
          params: {
            gameMode: game.mode,
            isResumed: 'true', // پارامتر برای نشان دادن ادامه بازی
          },
        });
      } else {
        // اگر بازی ذخیره شده وجود ندارد، به صفحه پیش‌بازی برو
        router.push({
          pathname: `/pre-game/${game.id}`,
          params: {
            gameMode: game.mode,
          },
        });
      }
    } catch (error) {
      console.error('خطا در بررسی بازی ذخیره شده:', error);
      // در صورت خطا، به صفحه پیش‌بازی برو
      router.push({
        pathname: `/pre-game/${game.id}`,
        params: {
          gameMode: game.mode,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic styles based on variant
  const cardBorderColor = isStandard ? '#2782ff' : '#42a75c';
  const gradientColors = isStandard
    ? ['rgba(35, 117, 255, 0.45)', 'transparent']
    : ['rgba(50, 173, 101, 0.32)', 'transparent'];
  const tagBorderColor = isStandard
    ? 'rgba(125, 156, 205, 0.16)'
    : 'rgba(81, 201, 95, 0.2)';
  const tagBgColor = isStandard
    ? 'rgba(255,255,255,0.025)'
    : 'rgba(70, 201, 94, 0.1)';
  const tagTextColor = isStandard ? '#899bc0' : '#88e66e';
  const buttonBorderColor = isStandard
    ? 'rgba(78, 145, 255, 0.5)'
    : '#4cbf5c';
  const buttonBgColor = isStandard ? '#1249a2' : '#176c3a';
  const buttonShadowColor = isStandard ? '#1158d1' : '#2e9c48';

  return (
    <View style={[styles.card, { borderColor: cardBorderColor, width: width * 0.9 }]}>
      {/* Accent gradient overlay */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{game.title}</Text>
        <Text style={styles.subtitle}>{game.subtitle}</Text>

        {/* Features tags */}
        <View style={styles.featuresRow}>
          {game.features.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                {
                  borderColor: tagBorderColor,
                  backgroundColor: tagBgColor,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: tagTextColor }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Play button */}
        <TouchableOpacity
          style={[
            styles.playButton,
            {
              borderColor: buttonBorderColor,
              backgroundColor: buttonBgColor,
              shadowColor: buttonShadowColor,
            },
          ]}
          activeOpacity={0.8}
          onPress={handleStartGame}
          disabled={isLoading}        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isLoading ? '...' : 'شروع'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 205,
    backgroundColor: '#102e67', // fallback, will be overridden by gradient
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.3,
    shadowRadius: 35,
    elevation: 20,
    marginVertical: 8, // spacing when mapped
  },
  content: {
    padding: 20,
    position: 'relative',
    zIndex: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f4f7ff',
    marginTop: 10,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 11,
    color: '#9caecf',
    marginTop: 4,
    lineHeight: 18,
    textAlign: 'right',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 13,
    gap: 6, // works on iOS 14+, Android? Use margin instead for compatibility
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 8,
  },
  playButton: {
    marginTop: 15,
    height: 38,
    minWidth: 125,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 20,
    marginRight: 5,
  },
});

export default GameCard;