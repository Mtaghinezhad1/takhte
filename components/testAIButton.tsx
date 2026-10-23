// ==================== components/TestAIButton.tsx ====================
import { testAIEngine } from '@/services/trainAI/testAIEnine';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SAMPLE_INPUT = {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [2, 3],
        turn: 'black',
        bestMoves: [{ from: 1, to: 4, die: 3 }, { from: 12, to: 14, die: 2 }],
};

export default function TestAIButton() {
    const handlePress = () => {
        testAIEngine(SAMPLE_INPUT, '5');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>🧪 Test AI Engine</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2E86DE',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});