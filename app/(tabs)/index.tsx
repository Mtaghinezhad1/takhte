// index.tsx
import GameCard from '@/components/home/gameCard';
import ProfileCard from '@/components/home/profileCard';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const games = [
  //{ id: 1, title: 'تخته نرد ایرانی', subtitle:'رقابت با قوانین اساندارد جهانی',features: [], mode: 'aiVsAi', variant: 'standard' },
  { id: 2, title: 'تخته نرد استاندارد', subtitle: 'رقابت با قوانین اساندارد جهانی', features: ['با تاثیر بر توانایی'], mode: 'standard', variant: 'standard' },
  { id: 3, title: 'تفننی', subtitle: 'رقابت با چیدمان های تصادفی', features: ['بدون تاثیر بر توانایی'], mode: 'fun', variant: 'fun' },
  //{ id: 4, title: 'دو نفره', subtitle:'رقابت با قوانین اساندارد جهانی', features: [], mode: 'twoPlayer',variant: 'standard' },
  // { id: 4, title: 'هوش مصنوعی', subtitle:'رقابت با قوانین اساندارد جهانی', features: [],  mode: 'AIvsAI',variant: 'standard' },
];

export default function HomeScreen() {
  const { colors } = useThemeStore();

  return (
   <LinearGradient
      colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.profileContainer}>
          <ProfileCard />
        </View>

        <View style={styles.cardsContainer}>
          {games.map((game) => (
            <View key={game.id}>
              <GameCard
                game={game}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>

    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  profileContainer: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  cardsContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '2.5%',
    gap: 12,
  },
});