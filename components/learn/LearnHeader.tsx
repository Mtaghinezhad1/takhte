// 7 learn top.js
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
  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.back}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      {/* Progress card */}
      <LinearGradient
        colors={['rgba(3, 43, 87, 0.9)', 'rgba(2, 27, 57, 0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.progressCard}
      >
        <Text style={styles.progressTitle} numberOfLines={1}>
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
    borderColor: '#0879e9',
    backgroundColor: 'rgba(4, 42, 83, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0082ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
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
    borderColor: 'rgba(0, 132, 255, 0.45)',
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    shadowColor: '#006cff',
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