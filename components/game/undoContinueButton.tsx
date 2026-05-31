import useGameStore from '@/stores/useGameStore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UndoButton = () => {
    const handleUndo = useGameStore(state => state.handleUndo);
    const movesCount = useGameStore(state => state.movesCount);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleUndo}
                disabled={movesCount === 0}
                style={[
                    styles.undoButton,
                    movesCount === 0 && styles.undoButtonDisabled
                ]}
            >
                <Text style={styles.undoButtonText}>
                    بازگشت
                </Text>
            </TouchableOpacity>
        </View>



    );
};

const styles = StyleSheet.create({
    container: {
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    undoButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#2e2bac',
    },
    undoButtonDisabled: {
        backgroundColor: '#2e2bac',
        opacity: 0.3,
    },
    undoButtonText: {
        color: 'white',
        fontFamily: 'Kaghaz',
    },
});

export default UndoButton;