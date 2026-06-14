import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const GameCard = ({ game, cardWidth, cardHeight, imageWidth, imageHeight }) => {
    const handleStartGame = () => {
        router.push({
          pathname: `/pre-game/${game.id}`,
          params: {
            gameMode: game.mode,
          },
        });
      };
    
      return (
        <LinearGradient
          colors={[game.bgColor || '#4c669f', '#3b5998', '#192f6a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            {
              width: cardWidth,
              height: cardHeight,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextSection}>
              <Text style={[styles.textCard, { marginTop: cardHeight * 0.1 }]}>
                {game.title}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleStartGame}
                style={styles.playBtn}
              >
                <Text style={[styles.playBtnText, { color: game.textColor }]}>
                  شروع
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../assets/images/1.jpg')}
              style={[
                styles.cardImg,
                { width: imageWidth, height: imageHeight },
              ]}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>
      );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: '1.5%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100%',
  },
  textCard: {
    color: '#ffffff',
    fontFamily: 'Kaghaz',
    fontSize: 18,
    textAlign: 'right',
    marginLeft: '4%',
  },
  playBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginLeft: '4%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playBtnText: {
    fontSize: 16,
    fontFamily: 'Kaghaz',
  },
  cardImg: {
    borderRadius: 12,
    // سایه برای iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // سایه برای Android
    elevation: 40,
    transform: [{ rotate: '20deg' }],
  },
});

export default GameCard;