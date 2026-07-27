import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, View } from "react-native";


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
  const { initialize: initializeTheme, isDark, colors, isLoading: themeLoading } = useThemeStore();

  // مقداردهی اولیه تم
  useEffect(() => {
    initializeTheme();
  }, []);


  useEffect(() => {
    initializeFromStorage();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading && !themeLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading, themeLoading]);

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    StatusBar.setBackgroundColor(colors.background);
  }, [isDark, colors.background]);

  // تا زمانی که فونت بارگذاری نشده، چیزی نمایش نده
  if (!fontsLoaded && !fontError) return null;
  if (isLoading || themeLoading) return null;

  const navigationTheme = isDark ? DarkTheme : DefaultTheme;


  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="game/[id]"
            options={{ animation: 'slide_from_left' }}
          />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </NavigationThemeProvider>
  );
}
