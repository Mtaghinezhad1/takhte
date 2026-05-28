import useGameStore from "@/stores/useGameStore";
import React, { useEffect } from "react";

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';


export default function InformModal() {
    const showForcedMoveModal = useGameStore(state => state.showForcedMoveModal);
    const closeInformModal = useGameStore(state => state.closeInformModal);


    useEffect(() => {
        if (showForcedMoveModal) {
            const timer = setTimeout(() => {
                closeInformModal();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [showForcedMoveModal]);



    return (
        <Modal
            visible={showForcedMoveModal}
            transparent
            animationType="fade"
            onRequestClose={closeInformModal}
        >
            {/* پشت منو را کلیک کنیم بسته شود */}
            <Pressable style={styles.backdrop} onPress={closeInformModal} />

            <View style={styles.menuWrap}>
                <View style={styles.card}>
                    <Text style={styles.text}>تاس اجبار</Text>
                </View>
            </View>
        </Modal>
    );
}



const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0)",
    },
    text: {
        fontFamily: 'Kaghaz',
    },
    menuWrap: {
        position: "absolute",
        top: '50%', // می‌توانید با توجه به محل دکمه تنظیمش کنید
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
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
