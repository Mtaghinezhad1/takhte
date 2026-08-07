import useLearningStore from '@/stores/useLearningStore';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.28;

const AchievementCard = ({
  icon,
  title,
  description,
  progress,
  current,
  total,
  locked = false,
  completed = false,
  onPress,
}) => {
  const progressPercentage = Math.min(Math.max(progress, 0), 100);
  const { colors } = useThemeStore();


  const getCardStyles = () => {
    if (locked) return styles.lockedCard;
    if (completed) return styles.completedCard;
    return styles.defaultCard;
  };

  const getIconStyles = () => {
    if (locked) return styles.lockedIcon;
    if (completed) return styles.completedIcon;
    return styles.defaultIcon;
  };

  const getProgressFillColors = () => {
    if (locked) return ['#b0b8c8', '#c8d0e0'];
    if (completed) return ['#22c55e', '#4ade80'];
    return ['#4a6cf7', '#6a8cff'];
  };

  const getProgressTextColor = () => {
    if (locked) return '#8888a0';
    if (completed) return '#22c55e';
    return '#4a6cf7';
  };

  const getTitleColor = () => {
    if (locked) return '#6a6a8a';
    return colors.text;
  };

  const getDescColor = () => {
    if (locked) return '#8a8aaa';
    return colors.text;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, getCardStyles(), { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, getIconStyles()]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <Text style={[styles.title, { color: getTitleColor() }]}>{title}</Text>
      <Text style={[styles.description, { color: getDescColor() }]}>{description}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={getProgressFillColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: getProgressTextColor() }]}>
          {current}/{total}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const AchievementsScreen = () => {
  const { statistics } = useUserStore();
  const { completedLessons } = useLearningStore();
  const [achievements, setAchievements] = useState([]);
  const { colors } = useThemeStore();


  useEffect(() => {
    // دریافت آمار از store
    const {
      totalGamesPlayed = 0,
      totalWins = 0,
      winStreak = 0,
      maxWinStreak = 0
    } = statistics;

    // محاسبه تعداد کل درس‌های گذرانده شده
    const totalCompletedLessons = Object.keys(completedLessons || {}).length;

    // تعریف دستاوردها بر اساس آمار واقعی
    const achievementsData = [
      // دستاوردهای تعداد کل بازی‌ها
      {
        id: 1,
        icon: '🎯',
        title: 'تازه‌کار واقعی',
        description: '۱۰ بازی انجام بده',
        current: Math.min(totalGamesPlayed, 10),
        total: 10,
        locked: totalGamesPlayed < 10,
        completed: totalGamesPlayed >= 10,
      },
      {
        id: 2,
        icon: '⚡',
        title: 'بازیکن حرفه‌ای',
        description: '۵۰ بازی انجام بده',
        current: Math.min(totalGamesPlayed, 50),
        total: 50,
        locked: totalGamesPlayed < 50,
        completed: totalGamesPlayed >= 50,
      },
      {
        id: 3,
        icon: '👑',
        title: 'افسانه بازی',
        description: '۱۰۰ بازی انجام بده',
        current: Math.min(totalGamesPlayed, 100),
        total: 100,
        locked: totalGamesPlayed < 100,
        completed: totalGamesPlayed >= 100,
      },

      // دستاوردهای تعداد بردها
      {
        id: 4,
        icon: '🥇',
        title: 'اولین پیروزی',
        description: 'اولین بازی رو ببر',
        current: Math.min(totalWins, 1),
        total: 1,
        locked: totalWins < 1,
        completed: totalWins >= 1,
      },
      {
        id: 5,
        icon: '🏆',
        title: 'چلنجر',
        description: '۲۵ بازی رو ببر',
        current: Math.min(totalWins, 25),
        total: 25,
        locked: totalWins < 25,
        completed: totalWins >= 25,
      },
      {
        id: 6,
        icon: '⭐',
        title: 'سلطان برد',
        description: '۵۰ بازی رو ببر',
        current: Math.min(totalWins, 50),
        total: 50,
        locked: totalWins < 50,
        completed: totalWins >= 50,
      },

      // دستاوردهای برد پشت سر هم
      {
        id: 7,
        icon: '🔥',
        title: 'شروع داغ',
        description: '۳ برد پشت سر هم',
        current: Math.min(winStreak, 3),
        total: 3,
        locked: winStreak < 3,
        completed: winStreak >= 3,
      },
      {
        id: 8,
        icon: '💪',
        title: 'غیرقابل توقف',
        description: '۷ برد پشت سر هم',
        current: Math.min(winStreak, 7),
        total: 7,
        locked: winStreak < 7,
        completed: winStreak >= 7,
      },
      {
        id: 9,
        icon: '🚀',
        title: 'افسانه شکست‌ناپذیر',
        description: '۱۰ برد پشت سر هم',
        current: Math.min(winStreak, 10),
        total: 10,
        locked: winStreak < 10,
        completed: winStreak >= 10,
      },

      // دستاوردهای جدید: تعداد درس‌های گذرانده شده
      {
        id: 10,
        icon: '📚',
        title: 'شروع یادگیری',
        description: '۵ درس را کامل کن',
        current: Math.min(totalCompletedLessons, 5),
        total: 5,
        locked: totalCompletedLessons < 5,
        completed: totalCompletedLessons >= 5,
      },
      {
        id: 11,
        icon: '🧠',
        title: 'دانش‌آموز حرفه‌ای',
        description: '۲۵ درس را کامل کن',
        current: Math.min(totalCompletedLessons, 25),
        total: 25,
        locked: totalCompletedLessons < 25,
        completed: totalCompletedLessons >= 25,
      },
      {
        id: 12,
        icon: '🎓',
        title: 'استاد بازی',
        description: '۵۰ درس را کامل کن',
        current: Math.min(totalCompletedLessons, 50),
        total: 50,
        locked: totalCompletedLessons < 50,
        completed: totalCompletedLessons >= 50,
      },
    ];

    setAchievements(achievementsData);
  }, [statistics, completedLessons]);

  // تقسیم به ردیف‌های ۳ تایی
  const rows = [];
  for (let i = 0; i < achievements.length; i += 3) {
    rows.push(achievements.slice(i, i + 3));
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle,{color: colors.text}]}>🏅 دستاوردها</Text>
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
      
      {/* فضای خالی در انتها برای اسکرول بهتر */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  card: {
    flex: 1,
    aspectRatio: 5 / 9,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
  },
  defaultCard: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  lockedCard: {
    backgroundColor: '#F8F8F8',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  completedCard: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  iconContainer: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultIcon: {
    backgroundColor: '#f8f9fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  lockedIcon: {
    backgroundColor: '#f8f9fc',
    opacity: 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  completedIcon: {
    backgroundColor: '#f8f9fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 16,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e8ecf4',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AchievementsScreen;