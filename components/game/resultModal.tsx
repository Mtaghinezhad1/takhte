import useGameStore from "@/stores/useGameStore";
import useUserStore from "@/stores/useUserStore";
import React, { useEffect } from "react";

import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';



const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = (CARD_WIDTH * 9) / 16;

export default function ResultModal() {
    const isModalVisible = useGameStore(state => state.isModalVisible);
    const closeResultModal = useGameStore(state => state.closeResultModal);
    const gameScore = useGameStore(state => state.gameScore);
    const gameWinner = useGameStore(state => state.gameWinner);
    const aiProfile = useGameStore(state => state.aiProfile);
    const { username, elo, avatar } = useUserStore();


    useEffect(() => {
        if (isModalVisible) {
            const timer = setTimeout(() => {
                closeResultModal();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isModalVisible]);




    return (
        <Modal
            visible={isModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeResultModal}
        >
            {/* پشت منو را کلیک کنیم بسته شود */}
            <Pressable style={styles.backdrop} onPress={closeResultModal} />

            <View style={styles.menuWrap}>
                <View style={styles.card}>
                    {/* Winner Badge */}
                    <View style={styles.winnerBadge}>
                        <View style={[styles.winnerDot, { backgroundColor: `${gameWinner}` }]} />
                        <Text style={styles.winnerText}>
                            {(gameWinner && gameWinner === 'white') ? 'برنده: بازیکن سفید' : 'برنده: بازیکن سیاه'}
                        </Text>
                    </View>

                    {/* Players Info */}
                    <View style={styles.playersContainer}>
                        {/* Black Player */}
                        <View style={styles.playerSection}>
                            <Image
                                source={aiProfile ? aiProfile.avatar : 'sdf'}
                                style={[styles.playerImage, styles.blackPlayerBorder]}
                            />
                            <Text style={styles.playerName}>{aiProfile ? aiProfile.name : 'sdf'}</Text>
                            <Text style={[styles.playerColor, { color: '#000000' }]}>مهره سیاه</Text>
                        </View>

                        {/* VS Section */}
                        <View style={styles.vsSection}>
                            <Text style={styles.vsText}>VS</Text>
                            <View style={styles.scoreContainer}>
                                <View style={[styles.scoreBox, { backgroundColor: '#000000' }]}>
                                    <Text style={styles.scoreText}>{gameScore[1]}</Text>
                                </View>
                                <Text style={styles.scoreSeparator}>:</Text>
                                <View style={[styles.scoreBox, { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#000000' }]}>
                                    <Text style={[styles.scoreText, { color: '#000000' }]}>{gameScore[0]}</Text>
                                </View>
                            </View>
                        </View>

                        {/* White Player */}
                        <View style={styles.playerSection}>
                            <Image
                                source={avatar ? avatar : 'sdf'}
                                style={[styles.playerImage, styles.whitePlayerBorder]}
                            />
                            <Text style={styles.playerName}>{username}</Text>
                            <Text style={[styles.playerColor, { color: '#666666' }]}>مهره سفید</Text>
                        </View>
                    </View>
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
    menuWrap: {
        position: "absolute",
        top: '50%', // می‌توانید با توجه به محل دکمه تنظیمش کنید
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '60%',
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
    winnerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignSelf: 'center',
        marginBottom: 15,
    },
    winnerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    winnerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    playersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    playerSection: {
        alignItems: 'center',
        flex: 1,
    },
    playerImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
    },
    blackPlayerBorder: {
        borderWidth: 3,
        borderColor: '#000000',
    },
    whitePlayerBorder: {
        borderWidth: 3,
        borderColor: '#CCCCCC',
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    playerColor: {
        fontSize: 12,
        fontWeight: '500',
    },
    vsSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    vsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginBottom: 15,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scoreSeparator: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 10,
    },
});
