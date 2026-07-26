import useThemeStore from '@/stores/useThemeStore';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle, useSharedValue, withSpring
} from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

export function ThemeToggle() {
  const { isDark, toggleTheme, getColors } = useThemeStore();
  const colors = getColors();
  const translateX = useSharedValue(isDark ? 20 : 0);

  useEffect(() => {
    translateX.value = withSpring(isDark ? 20 : 0);
  }, [isDark]);

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[styles.container, { 
        backgroundColor: isDark ? '#3a3a3a' : '#e0e0e0',
        borderColor: colors.border,
      }]}
      activeOpacity={0.8}
    >
      <View style={[styles.thumb, { backgroundColor: colors.primary }]}>
        <Animated.View style={[styles.thumbInner, toggleStyle]}>
          <IconSymbol 
            size={16} 
            name={isDark ? 'moon.fill' : 'sun.max.fill'} 
            color="#ffffff" 
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});