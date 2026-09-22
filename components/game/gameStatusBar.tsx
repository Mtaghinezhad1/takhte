import { getAvatarByKey } from '@/constants/avatars';
import useGameStore from '@/stores/useGameStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


const GameStatusBar = () => {
  const aiProfile = useGameStore(state => state.aiProfile);
  const { user } = useUserStore();

  const elo = useUserStore.getState().getCurrentElo();
  const currentTurn = useGameStore(state => state.currentTurn);
  const targetScore = useGameStore(state => state.targetScore);

  return (
    <LinearGradient
      colors={['rgba(25, 55, 91, 0.72)', 'rgba(7, 24, 45, 0.88)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.playersPanel}
    >
      <View style={styles.player}>
        <View style={styles.avatarWrapper}>
          <Image
            source={aiProfile ? getAvatarByKey(aiProfile.avatarKey) : require('@/assets/avatar/default.jpeg')}
            style={[
              styles.avatar,
              currentTurn == 'black' && styles.avatarActive,
            ]}
          />
          {currentTurn == 'black' && <View style={styles.activeDot} />}
        </View>

        {/* Name */}
        <Text style={styles.playerName}>{aiProfile ? aiProfile.name : 'کاربر مهمان'}</Text>

        {/* Ability info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerInfoLabel}>توانایی</Text>
          <Text style={styles.playerInfoValue}>{aiProfile ? aiProfile.baseRating : '1400'}</Text>
        </View>

      </View>


      <View style={styles.matchScore}>
        <Text style={styles.matchScoreLabel}>طول بازی:       <Text style={styles.matchScoreValue}>{targetScore}</Text></Text>
      </View>



      <View style={styles.player}>
        <View style={styles.avatarWrapper}>
          <Image
            source={user.avatarKey ? getAvatarByKey(user.avatarKey) : require('@/assets/avatar/default.jpeg')}
            style={[
              styles.avatar,
              currentTurn == 'white' && styles.avatarActive,
            ]}
          />
          {currentTurn == 'white' && <View style={styles.activeDot} />}
        </View>

        {/* Name */}
        <Text style={styles.playerName}>{user.username}</Text>

        {/* Ability info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerInfoLabel}>توانایی</Text>
          <Text style={styles.playerInfoValue}>{elo}</Text>
        </View>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  playersPanel: {
    width: '14%',
    height: '95%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent:'space-between',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
  player: {
    alignItems: 'center',
    width: '100%',
  },
  avatarWrapper: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: '50%',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: '#267fff',
  },
  avatarActive: {
    shadowColor: '#005bdc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 10,
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '30%',
    height: '30%',
    borderRadius: 10,
    backgroundColor: '#27d56f',
    borderWidth: 3,
    borderColor: '#10233e',
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  playerInfo: {
    marginTop: 18,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  playerInfoLabel: {
    color: '#aebed5',
    fontSize: 10,
    textAlign: 'right',
  },
  playerInfoValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  matchScore: {
    paddingVertical: 5,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 130, 255, 0.4)',
    backgroundColor: 'rgba(34, 102, 192, 0.18)',
    width: '100%',
    alignItems: 'center',
  },
  matchScoreLabel: {
    fontSize: 9,
    color: '#4b9aff',
    marginBottom: 8,
    textAlign: 'center',
  },
  matchScoreValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default GameStatusBar;