import { getAvatarByKey } from '@/constants/avatars';
import { fetchLeaderboard } from '@/services/api/userApi';
import useRTLStore from '@/stores/useRTLStore';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isSmall = width < 370;

// Persian digits helper
const fa = (n) =>
  String(n ?? '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// DiceBear PNG endpoint — از avatarKey به‌عنوان seed استفاده می‌کنیم
const avatarUrl = (seed) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${seed || 'guest'}&size=200`;

const AVATAR_SIZE = isSmall ? 68 : 82;
const FIRST_AVATAR_SIZE = isSmall ? 90 : 108;

// ترتیب نمایش روی سکو: نفر دوم (چپ)، نفر اول (وسط)، نفر سوم (راست)
const PODIUM_ORDER = [1, 0, 2]; // [index in top3]

const RankingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const colors = useThemeStore(state => state.colors);
  const isRTL = useRTLStore(state => state.isRTL);



  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderboard();
        if (!mounted) return;
        setTopPlayers(data.topPlayers || []);
        setMyRank(data.myRank || null);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'خطا در دریافت رتبه‌بندی');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // ─── تقسیم دیتا ─────────────────────────────
  const podiumPlayers = topPlayers.slice(0, 3);
  const listPlayers = topPlayers.slice(3);

  // آیا کاربر جاری جزو ۵۰ نفر برتر است؟
  const isMeInTop = myRank
    ? topPlayers.some((p) => p.userId === myRank.userId)
    : false;

  // ─── رندر بازیکن سکو ────────────────────────
  const renderPodiumPlayer = (player, position) => {
    // position: 0 → first, 1 → second, 2 → third (بر اساس ترتیب نمایش)
    const isFirst = position === 0;
    const isSecond = position === 1;

    const avatarSize = isFirst ? FIRST_AVATAR_SIZE : AVATAR_SIZE;
    const borderColor = isFirst ? '#ffc936' : isSecond ? '#b8d9ff' : '#ff8b35';

    return (
      <View key={player.userId} style={styles.player}>
        <View
          style={[
            styles.avatarWrap,
            { width: avatarSize, height: avatarSize },
          ]}
        >
          <Image
            source={player.avatarKey ? getAvatarByKey(player.avatarKey) : require('@/assets/avatar/default.jpeg')}
            style={[
              styles.avatar,
              { borderColor },
              isFirst && styles.avatarFirst,
            ]}
          />
          <View
            style={[
              styles.rankBadge,
              isFirst && styles.rankBadgeFirst,
            ]}
          >
            <Text
              style={[
                styles.rankBadgeText,
                isFirst && styles.rankBadgeTextFirst,
              ]}
            >
              {fa(player.rank)}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.playerName, isFirst && styles.playerNameFirst, { color: colors.text }]}
          numberOfLines={1}
        >
          {player.username || 'ناشناس'}
        </Text>

        <Text style={styles.elo}>{fa(Math.round(player.elo))}</Text>
      </View>
    );
  };

  // ─── لودینگ ─────────────────────────────────
  if (loading) {
    return (
      <LinearGradient
        colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2b8dff" />
            <Text style={styles.centerText}>در حال دریافت رتبه‌بندی…</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ─── خطا ────────────────────────────────────
  if (error) {
    return (
      <LinearGradient
        colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.glowTop} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.appContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title,{color: colors.text}]}>رتبه بندی</Text>
              <Text style={styles.subtitle}>بهترین بازیکنان نرد لند</Text>
            </View>

            {/* Podium card */}
            {podiumPlayers.length > 0 && (
              <LinearGradient
                colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.podiumCard, { borderColor: colors.border, shadowColor: colors.shadow, }]}
              >
                <View style={styles.podium}>
                  {PODIUM_ORDER.map((idx, position) => {
                    const player = podiumPlayers[idx];
                    if (!player) return <View key={idx} style={styles.player} />;
                    return renderPodiumPlayer(player, position);
                  })}
                </View>
              </LinearGradient>
            )}

            {/* Ranking list (ranks 4–50) */}
            <View style={styles.rankingList}>
              {listPlayers.map((row) => (
                <LinearGradient
                  colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  key={row.userId}
                  style={[styles.rankRow, { borderColor: colors.border, shadowColor: colors.shadow, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <Text style={styles.rankElo}>{fa(Math.round(row.elo))}</Text>
                  <View style={styles.rankInfo}>
                    <Text style={[styles.rankName, { color: colors.text, textAlign: isRTL ? 'left' : 'right' }]} numberOfLines={1}>
                      {row.username || 'ناشناس'}
                    </Text>
                  </View>
                  <Image
                    source={row.avatarKey ? getAvatarByKey(row.avatarKey) : require('@/assets/avatar/default.jpeg')}
                    style={styles.listAvatar}
                  />
                  <View style={styles.rankNumber}>
                    <Text style={styles.rankNumberText}>{fa(row.rank)}</Text>
                  </View>
                </LinearGradient>
              ))}
            </View>

            {/* Current player — فقط اگر در ۵۰ نفر برتر نباشد */}
            {myRank && !isMeInTop && (
              <View style={styles.myRank}>
                <View style={styles.rankNumber}>
                  <Text style={styles.rankNumberText}>{fa(myRank.rank)}</Text>
                </View>

                <Text style={styles.myBadge}>♛</Text>

                <View style={styles.myRankText}>
                  <Text style={styles.myRankTitle}>رتبه شما</Text>
                  <Text style={styles.myRankNumber}># {fa(myRank.rank)}</Text>
                </View>

                <Text style={styles.rankElo}>{fa(Math.round(myRank.elo))}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020b1c',
  },
  scrollContent: {
    flexGrow: 1,
  },
  appContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: isSmall ? 10 : 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerText: {
    marginTop: 16,
    color: '#8fa8d1',
    fontSize: 15,
  },
  errorText: {
    color: '#ff8080',
    fontSize: 15,
    textAlign: 'center',
  },
  glowTop: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    top: -200,
    left: '50%',
    transform: [{ translateX: -190 }],
    backgroundColor: 'rgba(0, 102, 255, 0.25)',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 22,
  },
  title: {
    fontSize:  29 ,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(40, 140, 255, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  subtitle: {
    marginTop: 8,
    color: '#8fa8d1',
    fontSize: 15,
    textAlign: 'center',
  },

  /* Podium */
  podiumCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 45,
    elevation: 10,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  player: {
    flex: 1,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 4,
    backgroundColor: '#102653',
  },
  avatarFirst: {
    shadowColor: '#ffca2b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 10,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -13,
    left: '50%',
    transform: [{ translateX: -17 }],
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b4ca8',
    borderWidth: 2,
    borderColor: '#2b8dff',
  },
  rankBadgeFirst: {
    width: 42,
    height: 42,
    borderRadius: 12,
    transform: [{ translateX: -21 }],
    backgroundColor: '#ffd84c',
    borderColor: '#ffe66d',
  },
  rankBadgeText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rankBadgeTextFirst: {
    color: '#291800',
    fontSize: 20,
  },
  playerName: {
    marginTop: 22,
    fontSize: isSmall ? 11 : 14,
    fontWeight: 'bold',
    color: '#f4f7ff',
    textAlign: 'center',
  },
  playerNameFirst: {
    fontSize: isSmall ? 13 : 16,
  },
  elo: {
    marginTop: 7,
    color: '#77baff',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  /* Ranking list */
  rankingList: {
    gap: 9,
  },
  rankRow: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 17,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 4,
  },
  rankNumber: {
    width: isSmall ? 42 : 48,
    height: isSmall ? 42 : 48,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#063b81',
    borderWidth: 1,
    borderColor: 'rgba(22, 133, 255, 0.25)',
    flexShrink: 0,
  },
  rankNumberText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listAvatar: {
    width: 53,
    height: 53,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#1688ff',
    backgroundColor: '#0a2754',
    flexShrink: 0,
  },
  rankInfo: {
    flex: 1,
    minWidth: 0,
  },
  rankName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankElo: {
    color: '#89a9d5',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  /* Current player */
  myRank: {
    marginTop: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 198, 45, 0.4)',
    backgroundColor: 'rgba(7, 36, 75, 0.85)',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  myBadge: {
    color: '#ffc936',
    fontSize: 24,
    textAlign: 'center',
  },
  myRankText: {
    flex: 1,
  },
  myRankTitle: {
    fontSize: 13,
    color: '#cbd8ef',
    textAlign: 'right',
  },
  myRankNumber: {
    marginTop: 4,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default RankingScreen;