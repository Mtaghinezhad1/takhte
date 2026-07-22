import useGameStore from "@/stores/useGameStore";
import React from "react";

import { Modal, StyleSheet, Text, View } from 'react-native';


export default function NoMoveModal() {
    const showNoMoveModal = useGameStore(state => state.showNoMoveModal);

    return (
        <Modal
            visible={showNoMoveModal}
            transparent
            animationType="fade"
        >
            {/* پشت منو را کلیک کنیم بسته شود */}
            <View style={styles.backdrop} >
                <View style={styles.card}>
                    <Text style={styles.text}>حرکتی وجود ندارد</Text>
                </View>
            </View>
        </Modal>
    );
}



const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Kaghaz',
        textAlign: 'center',
    },
    card: {
        width: '20%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
        // سایه برای iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        // سایه برای Android
        elevation: 10,
    },
});
