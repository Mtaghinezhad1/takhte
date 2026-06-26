import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets(); 

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
        tabBarActiveTintColor: '#1d5cdd',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: height * 0.1 + (insets.bottom*0.5 || 0), // ← تغییر
          paddingTop: 4,
          paddingBottom: insets.bottom || 0, // ← اضافه کن
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
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