import GameCard from '@/components/home/gameCard';
import ProfileCard from '@/components/home/profileCard';
import { StyleSheet, useWindowDimensions, View } from 'react-native';


const games = [
  //{ id: 1, title: 'تخته نرد ایرانی', bgColor: '#1d5cdd', textColor: '#1d5cdd', mode: 'aiVsAi' },
  { id: 2, title: 'تخته نرد استاندارد', bgColor: '#7c3aed', textColor: '#7c3aed', mode: 'standard' },
  { id: 3, title: 'تفننی', bgColor: '#ea580c', textColor: '#ea580c', mode: 'fun' },
  //{ id: 4, title: 'دو نفره', bgColor: '#dc2626', textColor: '#dc2626', mode: 'twoPlayer' },
  { id: 4, title: 'هوش مصنوعی', bgColor: '#dc2626', textColor: '#dc2626', mode: 'AIvsAI' },
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
          <GameCard
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

});