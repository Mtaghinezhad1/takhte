import useGameStore from '@/stores/useGameStore';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

// کامپوننتی که قراره تکرار بشه
const Checker = ({ isWhite }) => {
    return (
        <View style={[styles.checkers, isWhite && styles.white]} />
    );
};

const Rightbar = () => {
    const whiteBornOff = useGameStore(state => state.whiteBornOff);
    const blackBornOff = useGameStore(state => state.blackBornOff);
    const handleShowForfeit = useGameStore(state => state.handleShowForfeit);
    const showForfeit = useGameStore(state => state.showForfeit);

    return (
        <View style={styles.rightBar}>
            <View style={styles.checkersContainer}>
                {[...Array(blackBornOff)].map((_, index) => (
                    <Checker isWhite={false} key={index} />
                ))}
            </View>
            <TouchableOpacity
                style={styles.mainButton}
                onPress={handleShowForfeit}
                activeOpacity={0.8}
            >
                {showForfeit && <IconSymbol size={24} name="close" color='white' />}
                {!showForfeit && <IconSymbol size={24} name="menu.fill" color='white' />}
                
            </TouchableOpacity>
            <View style={styles.checkersContainer}>
                {[...Array(whiteBornOff)].map((_, index) => (
                    <Checker isWhite={true} key={index} />
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
    mainButton: {
        width: '70%',
        backgroundColor: '#3e7ced',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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