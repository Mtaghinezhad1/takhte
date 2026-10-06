// 7 learn top.js
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Persian digits helper
const fa = (n) =>
  String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const LearnHeader = ({
  title = 'آشنایی با حرکت مهره‌ها',
  currentLesson = 3,
  totalLessons = 10,
  onBack,
}) => {
  const { colors } = useThemeStore();
  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity
        style={[styles.back,{borderColor: colors.border,  shadowColor: colors.shadow}]}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Progress card */}
      <LinearGradient
        colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressCard,{borderColor: colors.border, shadowColor: colors.shadow}]}
      >
        <Text style={[styles.progressTitle, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.lessonNumber} numberOfLines={1}>
          درس {fa(currentLesson)} از {fa(totalLessons)}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 22,
    gap: 10,
  },
  back: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
    overflow: 'hidden'
  },
  backIcon: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 32,
    marginTop: -4,
    textAlign: 'center',
  },
  progressCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  progressTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f4f8ff',
    textAlign: 'right',
  },
  lessonNumber: {
    color: '#9abce9',
    fontSize: 12,
    textAlign: 'left',
  },
});

export default LearnHeader;