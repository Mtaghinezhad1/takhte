// AchievementCard.js
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isSmall = width < 370;

// Persian digits helper
const fa = (n) =>
  String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const AchievementCard = ({
  icon,
  title,
  description,
  progress = 0,   // percent (0 - 100) as passed from AchievementsScreen
  current = 0,
  total = 1,
  locked = false,
  completed = false,
}) => {
  const isCompleted = completed || progress >= 100;
  const percent = Math.min(Math.max(progress, 0), 100);
  const { colors } = useThemeStore();


  // ---------- Incomplete / locked state ----------
  if (!isCompleted) {
    return (
      <View style={[styles.card, styles.cardIncomplete, {shadowColor: colors.shadow}]}>
        <View style={[styles.iconWrap, styles.iconWrapIncomplete]}>
          <Text style={[styles.iconText, styles.iconTextIncomplete]}>{icon}</Text>
        </View>

        <Text
          style={[styles.title, styles.titleIncomplete, { color: colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text
          style={[styles.description, styles.descriptionIncomplete]}
          numberOfLines={2}
        >
          {description}
        </Text>

        <View style={styles.progressArea}>
          <View style={[styles.progressTrack, styles.progressTrackIncomplete]}>
            <View
              style={[
                styles.progressFill,
                styles.progressFillIncomplete,
                { width: `${percent}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressValue, styles.progressValueIncomplete, { color: colors.text }]}>
            {fa(current)}/{fa(total)}
          </Text>
        </View>
      </View>
    );
  }

  // ---------- Completed state ----------
  return (
    <LinearGradient
      colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, styles.cardCompleted, {borderColor: colors.border,shadowColor: colors.shadow}]}
    >
      <View style={styles.completedHighlight} pointerEvents="none" />

      <View style={[styles.iconWrap, styles.iconWrapCompleted]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <Text style={[styles.title, styles.titleCompleted, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>

      <Text
        style={[styles.description, styles.descriptionCompleted]}
        numberOfLines={2}
      >
        {description}
      </Text>

      <View style={styles.progressArea}>
        <View style={[styles.progressTrack, styles.progressTrackCompleted]}>
          <LinearGradient
            colors={['#0764e6', '#42a4ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${percent}%` }]}
          />
        </View>
        <Text style={[styles.progressValue, styles.progressValueCompleted, { color: colors.text }]}>
          {fa(current)}/{fa(total)}
        </Text>
      </View>
    </LinearGradient>
  );
};

const ICON_SIZE = isSmall ? 80 : 100;

const styles = StyleSheet.create({
  /* ---------- Card base ---------- */
  card: {
    width: isSmall ? '31.5%' : '31%',
    borderRadius: isSmall ? 18 : 22,
    paddingVertical: isSmall ? 11 : 14,
    paddingHorizontal: isSmall ? 6 : 9,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  /* Incomplete */
  cardIncomplete: {
    backgroundColor: 'rgba(9, 28, 56, 0.92)',
    borderWidth: 1,
    opacity: 0.78,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 4,
  },

  /* Completed */
  cardCompleted: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  completedHighlight: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    top: 0,
    backgroundColor: 'rgba(21, 107, 225, 0.23)',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    opacity: 0.35,
  },

  /* ---------- Icon ---------- */
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexShrink: 0,
    borderWidth: 1,
  },
  iconWrapIncomplete: {
    backgroundColor: 'rgba(6, 22, 45, 0.6)',
    borderColor: 'rgba(83, 107, 138, 0.20)',
    opacity: 0.43,
  },
  iconWrapCompleted: {
    backgroundColor: 'rgba(4, 26, 58, 0.72)',
    borderColor: 'rgba(35, 125, 255, 0.42)',
    shadowColor: '#1875ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 4,
  },
  iconText: {
    fontSize: isSmall ? 40 : 49,
    lineHeight: isSmall ? 46 : 56,
    textAlign: 'center',
  },
  iconTextIncomplete: {
    opacity: 0.7,
  },

  /* ---------- Title ---------- */
  title: {
    textAlign: 'center',
    fontSize: isSmall ? 13 : 15,
    lineHeight: isSmall ? 20 : 23,
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  titleIncomplete: {
    color: '#72829b',
  },
  titleCompleted: {
    color: '#f4f8ff',
  },

  /* ---------- Description ---------- */
  description: {
    textAlign: 'center',
    fontSize: isSmall ? 9 : 10,
    lineHeight: isSmall ? 15 : 17,
    paddingHorizontal: 2,
  },
  descriptionIncomplete: {
    color: '#53647d',
  },
  descriptionCompleted: {
    color: '#9eb4d5',
  },

  /* ---------- Progress ---------- */
  progressArea: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressTrackIncomplete: {
    backgroundColor: '#111f35',
  },
  progressTrackCompleted: {
    backgroundColor: '#092958',
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
  },
  progressFillIncomplete: {
    backgroundColor: '#394b64',
  },
  progressValue: {
    minWidth: 32,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  progressValueIncomplete: {
    color: '#53647d',
  },
  progressValueCompleted: {
    color: '#d9e8ff',
  },
});

export default AchievementCard;