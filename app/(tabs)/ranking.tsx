import { fetchLeaderboard } from '@/services/api/userApi';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
            source={{ uri: avatarUrl(player.avatarKey) }}
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
          style={[styles.playerName, isFirst && styles.playerNameFirst]}
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#031128', '#020b1c']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2b8dff" />
          <Text style={styles.centerText}>در حال دریافت رتبه‌بندی…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── خطا ────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#031128', '#020b1c']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#031128', '#020b1c']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowTop} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>رتبه بندی</Text>
            <Text style={styles.subtitle}>بهترین بازیکنان نرد لند</Text>
          </View>

          {/* Podium card */}
          {podiumPlayers.length > 0 && (
            <LinearGradient
              colors={['rgba(20,117,255,0.15)', 'rgba(7,28,61,0.82)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.podiumCard}
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
              <View key={row.userId} style={styles.rankRow}>
                <View style={styles.rankNumber}>
                  <Text style={styles.rankNumberText}>{fa(row.rank)}</Text>
                </View>

                <Image
                  source={{ uri: avatarUrl(row.avatarKey) }}
                  style={styles.listAvatar}
                />

                <View style={styles.rankInfo}>
                  <Text style={styles.rankName} numberOfLines={1}>
                    {row.username || 'ناشناس'}
                  </Text>
                </View>

                <Text style={styles.rankElo}>{fa(Math.round(row.elo))}</Text>
              </View>
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
    fontSize: isSmall ? 29 : 34,
    fontWeight: '900',
    color: '#f4f7ff',
    letterSpacing: -1,
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
    borderColor: 'rgba(26, 130, 255, 0.42)',
    paddingTop: 28,
    paddingBottom: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
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
    backgroundColor: 'rgba(4, 26, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(13, 112, 231, 0.42)',
    borderRadius: 17,
    shadowColor: '#000',
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
    color: '#f4f7ff',
    textAlign: 'right',
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