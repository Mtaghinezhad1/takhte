import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // تا زمانی که فونت بارگذاری نشده، چیزی نمایش نده
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
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
