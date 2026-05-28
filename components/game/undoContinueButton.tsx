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
        backgroundColor: '#ffcc00',
    },
    undoButtonDisabled: {
        backgroundColor: '#555555',
        opacity: 0.5,
    },
    undoButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default UndoButton;