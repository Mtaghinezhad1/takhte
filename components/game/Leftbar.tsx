import useGameStore from '@/stores/useGameStore';
import { StyleSheet, Text, View } from 'react-native';
import Timer from './timer';

const Leftbar = () => {
    const gameScore = useGameStore(state => state.gameScore);
    return (
        <View style={styles.leftBar}>
            <View style={styles.score}>
                <Text style={styles.scoreText}>{gameScore[1]}</Text>
            </View>
            <Timer/>
            <View style={styles.score}>
                <Text style={styles.scoreText}>{gameScore[0]}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    leftBar: {
        width: '6%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      score: {
        width: '80%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scoreText: {
        fontSize: 16,
        fontFamily: 'Kaghaz',
        color: '#070024',
      }
});

export default Leftbar;