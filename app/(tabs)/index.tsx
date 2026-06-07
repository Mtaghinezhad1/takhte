import { router } from 'expo-router';
import {
  Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View
} from 'react-native';
import ProfileCard from '../../components/home/profileCard';

const games = [
  //{ id: 1, title: 'تخته نرد ایرانی', bgColor: '#1d5cdd', textColor: '#1d5cdd', mode: 'aiVsAi' },
  { id: 2, title: 'تخته نرد استاندارد', bgColor: '#7c3aed', textColor: '#7c3aed', mode: 'standard' },
  { id: 3, title: 'تفننی', bgColor: '#ea580c', textColor: '#ea580c', mode: 'fun' },
  //{ id: 4, title: 'دو نفره', bgColor: '#dc2626', textColor: '#dc2626', mode: 'twoPlayer' },
  // { id: 4, title: 'هوش مصنوعی', bgColor: '#dc2626', textColor: '#dc2626', mode: 'AIvsAI' },
];

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const cardWidth = width * 0.9;
  const cardHeight = height * 0.18;
  const imageWidth = cardWidth * 0.4;
  const imageHeight = imageWidth * 0.8;

  return (
    <View style={styles.container}>
      <ProfileCard />

      <View style={styles.cardsContainer}>

        {games.map((game) => (
          <Card
            key={game.id}
            game={game}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Card Component ─────────────────────────────────────────────
const Card = ({ game, cardWidth, cardHeight, imageWidth, imageHeight }) => {
  const handleStartGame = () => {
    router.push({
      pathname: `/pre-game/${game.id}`,
      params: {
        gameMode: game.mode,
      },
    });
  };

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: game.bgColor,
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
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '2.5%',
  },
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
    transform: [{ rotate: '30deg' }],
  },
});