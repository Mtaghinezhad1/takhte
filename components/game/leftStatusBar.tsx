import { getAvatarByKey } from '@/constants/avatars';
import useGameStore from '@/stores/useGameStore';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const GameStatusBar = () => {
  const aiProfile = useGameStore(state => state.aiProfile);
  const { username, elo, avatarKey } = useUserStore();
  const currentTurn = useGameStore(state => state.currentTurn);
  const targetScore = useGameStore(state => state.targetScore);
  return (
    <View style={styles.leftStatusBar}>
      <View style={styles.topContainer}>
        <Text style={styles.playerName}>{aiProfile ? aiProfile.name : 'کاربر مهمان'}</Text>
        {currentTurn == 'black' ? (
          <View style={styles.showTurn}>
            <View style={styles.avatar}>
              <Image style={styles.avatarImg} source={aiProfile ? aiProfile.avatar : require('@/assets/avatar/default.jpeg')} />
            </View>
          </View>
        ) : (
          <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={aiProfile ? aiProfile.avatar : require('@/assets/avatar/default.jpeg')} />
          </View>
        )}
        <Text style={styles.rating}>{aiProfile ? aiProfile.baseRating : '1400'}</Text>
      </View>

      <View style={styles.midContainer}>
        <Text style={styles.midText}>
          طول بازی<Text style={styles.span}>{targetScore}</Text>
        </Text>
        {/* <Text style={styles.midText}>
          stake<Text style={styles.span}>300</Text>
        </Text> */}
        <View style={styles.hintBtn}>
          <Text style={styles.hintBtnText}>راهنمایی</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.rating}>{elo}</Text>
        {currentTurn == 'white' ? (
          <View style={styles.showTurn}>
            <View style={styles.avatar}>
              <Image style={styles.avatarImg} source={avatarKey ? getAvatarByKey(avatarKey) : require('@/assets/avatar/default.jpeg')} />
            </View>
          </View>
        ) : (
          <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={avatarKey ? getAvatarByKey(avatarKey) : require('@/assets/avatar/default.jpeg')} />
          </View>
        )}
        <Text style={styles.playerName}>{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftStatusBar: {
    height: '100%',
    width: '14%',
    backgroundColor: '#070024',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  topContainer: {
    width: '80%',
    alignItems: 'center',
    paddingVertical: '10%',
  },
  midContainer: {
    width: '80%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: '10%',
    alignItems: 'center',
  },
  bottomContainer: {
    width: '80%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Kaghaz',
  },
  rating: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Kaghaz',
  },
  showTurn: {
    width: '100%',
    aspectRatio: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: 'orange',
    marginVertical: 10,
  },
  avatar: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: 'grey',
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: '#3e7ce3',
    marginVertical: 10,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  midText: {
    color: 'grey',
    fontFamily: 'Kaghaz',
    fontSize: 13,
    lineHeight: 19.5, // 13 * 1.5
  },
  span: {
    paddingHorizontal: 5,
    color: 'white',
    fontSize: 13,
    fontFamily: 'Kaghaz',
  },
  hintBtn: {
    marginTop: 10,
    backgroundColor: '#3e7ced',
    borderRadius: 5,
    padding: '5%',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  hintBtnText: {
    color: 'white',
    fontFamily: 'Kaghaz',
    fontSize: 13,
  },
});

export default GameStatusBar;