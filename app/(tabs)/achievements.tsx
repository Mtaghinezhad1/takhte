import AchievementCard from '@/components/achievement/AchievementCard';
import useLearningStore from '@/stores/useLearningStore';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';

const AchievementsScreen = () => {
  const { statistics } = useUserStore();
  const { completedLessons } = useLearningStore();
  const [achievements, setAchievements] = useState([]);
  const { colors } = useThemeStore();

  useEffect(() => {
    const {
      totalGamesPlayed = 0,
      totalWins = 0,
      winStreak = 0,
      maxWinStreak = 0
    } = statistics;

    const totalCompletedLessons = Object.keys(completedLessons || {}).length;

    const achievementsData = [
      // دستاوردهای تعداد کل بازی‌ها
      { id: 1, icon: '🎯', title: 'تازه‌کار واقعی', description: '۱۰ بازی انجام بده', current: Math.min(totalGamesPlayed, 10), total: 10, locked: totalGamesPlayed < 10, completed: totalGamesPlayed >= 10 },
      { id: 2, icon: '⚡', title: 'بازیکن حرفه‌ای', description: '۵۰ بازی انجام بده', current: Math.min(totalGamesPlayed, 50), total: 50, locked: totalGamesPlayed < 50, completed: totalGamesPlayed >= 50 },
      { id: 3, icon: '👑', title: 'افسانه بازی', description: '۱۰۰ بازی انجام بده', current: Math.min(totalGamesPlayed, 100), total: 100, locked: totalGamesPlayed < 100, completed: totalGamesPlayed >= 100 },

      // دستاوردهای تعداد بردها
      { id: 4, icon: '🥇', title: 'اولین پیروزی', description: 'اولین بازی رو ببر', current: Math.min(totalWins, 1), total: 1, locked: totalWins < 1, completed: totalWins >= 1 },
      { id: 5, icon: '🏆', title: 'چلنجر', description: '۲۵ بازی رو ببر', current: Math.min(totalWins, 25), total: 25, locked: totalWins < 25, completed: totalWins >= 25 },
      { id: 6, icon: '⭐', title: 'سلطان برد', description: '۵۰ بازی رو ببر', current: Math.min(totalWins, 50), total: 50, locked: totalWins < 50, completed: totalWins >= 50 },

      // دستاوردهای برد پشت سر هم
      { id: 7, icon: '🔥', title: 'شروع داغ', description: '۳ برد پشت سر هم', current: Math.min(winStreak, 3), total: 3, locked: winStreak < 3, completed: winStreak >= 3 },
      { id: 8, icon: '💪', title: 'غیرقابل توقف', description: '۷ برد پشت سر هم', current: Math.min(winStreak, 7), total: 7, locked: winStreak < 7, completed: winStreak >= 7 },
      { id: 9, icon: '🚀', title: 'افسانه شکست‌ناپذیر', description: '۱۰ برد پشت سر هم', current: Math.min(winStreak, 10), total: 10, locked: winStreak < 10, completed: winStreak >= 10 },

      // دستاوردهای تعداد درس‌های گذرانده شده
      { id: 10, icon: '📚', title: 'شروع یادگیری', description: '۵ درس را کامل کن', current: Math.min(totalCompletedLessons, 5), total: 5, locked: totalCompletedLessons < 5, completed: totalCompletedLessons >= 5 },
      { id: 11, icon: '🧠', title: 'دانش‌آموز حرفه‌ای', description: '۲۵ درس را کامل کن', current: Math.min(totalCompletedLessons, 25), total: 25, locked: totalCompletedLessons < 25, completed: totalCompletedLessons >= 25 },
      { id: 12, icon: '🎓', title: 'استاد بازی', description: '۵۰ درس را کامل کن', current: Math.min(totalCompletedLessons, 50), total: 50, locked: totalCompletedLessons < 50, completed: totalCompletedLessons >= 50 },
    ];

    setAchievements(achievementsData);
  }, [statistics, completedLessons]);

  const rows = [];
  for (let i = 0; i < achievements.length; i += 3) {
    rows.push(achievements.slice(i, i + 3));
  }

  return (
    <LinearGradient
      colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>🏅 دستاوردها</Text>
          <Text style={styles.headerSubtitle}>
            {achievements.filter(a => a.completed).length} از {achievements.length} تکمیل شده
          </Text>
        </View>

        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            {row.map((item) => (
              <AchievementCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                progress={(item.current / item.total) * 100}
                current={item.current}
                total={item.total}
                locked={item.locked}
                completed={item.completed}
              />
            ))}
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6a6a8a',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AchievementsScreen;