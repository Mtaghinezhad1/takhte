import useUserStore from '@/stores/useUserStore';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager } from "react-native";

// جلوگیری از بسته شدن خودکار SplashScreen
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Kaghaz': require('../assets/fonts/Kaghaz.ttf'),
    'KaghazBold': require('../assets/fonts/KaghazBold.ttf'),
  });
  const initializeFromStorage = useUserStore(state => state.initializeFromStorage);
  const isLoading = useUserStore(state => state.isLoading);

  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    initializeFromStorage();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  // تا زمانی که فونت بارگذاری نشده، چیزی نمایش نده
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isLoading) {
    // می‌توانید یک صفحه لودینگ نشان دهید
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme} style = {{flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="game/[id]"
          options={{ animation: 'slide_from_left' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
