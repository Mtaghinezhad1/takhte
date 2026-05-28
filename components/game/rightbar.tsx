import useGameStore from '@/stores/useGameStore';
import { StyleSheet, View } from 'react-native';
import More from './more';

// کامپوننتی که قراره تکرار بشه
const Checker = ({isWhite}) => {
    return (
        <View style={[styles.checkers, isWhite && styles.white]}/>
    );
};

const Rightbar = () => {
  const whiteBornOff = useGameStore(state => state.whiteBornOff);
  const blackBornOff = useGameStore(state => state.blackBornOff);

    return (
        <View style={styles.rightBar}>
            <View style={styles.checkersContainer}>
                {[...Array(blackBornOff)].map((_, index) => (
                    <Checker isWhite={false} key={index}/>
                ))}
            </View>
            <More/>
            <View style={styles.checkersContainer}>
                {[...Array(whiteBornOff)].map((_, index) => (
                    <Checker isWhite={true} key={index}/>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rightBar: {
        width: '6%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    checkersContainer: {
        padding: '1%',
        width: '70%',
        backgroundColor: '#12184a',
        height: '30%',
    },
    checkers: {
        width: '100%',
        height: '5%',
        marginTop: '5%',
        backgroundColor: '#2e2bac',
    },
    white: {
        backgroundColor: 'white',
    }
});

export default Rightbar;