import { IconSymbol } from '@/components/ui/icon-symbol';
import useThemeStore from '@/stores/useThemeStore';
import { Tabs } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { getColors, isDark, colors } = useThemeStore();

  useEffect(() => {
    // قفل صفحه به حالت عمودی برای تمام صفحات اصلی
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          height: height * 0.1 + (insets.bottom * 0.5 || 0),
          paddingTop: 4,
          paddingBottom: insets.bottom || 0,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: width * 0.028,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'خانه',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'دستاوردها',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="stars.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'آموزش',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="school.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'بیشتر',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="menu.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}