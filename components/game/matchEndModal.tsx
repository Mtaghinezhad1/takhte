import useGameStore from "@/stores/useGameStore";
import useUserStore from "@/stores/useUserStore";
import { router } from 'expo-router';
import React from "react";

import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.6;
const CARD_HEIGHT = (CARD_WIDTH * 9) / 16;

export default function MatchEndModal() {
    const gameScore = useGameStore(state => state.gameScore);
    const gameWinner = useGameStore(state => state.gameWinner);
    const aiProfile = useGameStore(state => state.aiProfile);
    const { username, elo, avatar } = useUserStore();

    const {
        isMatchEndModalVisible,
        matchEndWinner,
        resetMatchEndState,
        finalWhiteElo,
        finalBlackElo,
        oldUserElo,
        oldAIElo
    } = useGameStore();

    // محاسبه تغییرات ELO
    const userEloChange = (finalWhiteElo !== null && oldUserElo !== null) ? finalWhiteElo - oldUserElo : 0;
    const aiEloChange = (finalBlackElo !== null && oldAIElo !== null) ? finalBlackElo - oldAIElo : 0;

    const handleGoHome = () => {
        resetMatchEndState(); // پاک کردن وضعیت مودال
        router.replace('/(tabs)'); // بازگشت به صفحه اصلی (index داخل تب‌ها)
    };


    // رنگ متن تغییرات
    const getChangeColor = (change) => {
        if (change > 0) return 'green';
        if (change < 0) return 'red';
        return 'gray';
    };

    // فرمت نمایش تغییرات
    const formatChange = (change) => {
        if (change === 0) return '(0)';
        return change > 0 ? `(+${change})` : `(${change})`;
    };

    return (
        <Modal
            visible={isMatchEndModalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleGoHome}
        >

            <View style={[styles.card, { width: CARD_WIDTH }]}>
                {/* Winner Badge */}
                <View style={styles.winnerBadge}>
                    <View style={[styles.winnerDot, { backgroundColor: `${gameWinner}` }]} />
                    <Text style={styles.winnerText}>
                        برنده نهایی: {matchEndWinner === 'white' ? 'سفید' : 'سیاه'}
                    </Text>
                </View>

                {/* Players Info */}
                <View style={styles.playersContainer}>
                    {/* Black Player */}
                    <View style={styles.playerSection}>
                        <Image
                            source={aiProfile ? aiProfile.avatar : require('@/assets/avatar/default.jpeg')}
                            style={[styles.playerImage, styles.blackPlayerBorder]}
                        />
                        <Text style={styles.playerName}>{aiProfile ? aiProfile.name : 'ربات'}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.playerName}>{finalBlackElo}</Text>
                            <Text style={[styles.changeText, { color: getChangeColor(aiEloChange), marginLeft: 5 }]}>
                                {formatChange(aiEloChange)}
                            </Text>
                        </View>
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
                            source={avatar ? avatar : require('@/assets/avatar/default.jpeg')}
                            style={[styles.playerImage, styles.whitePlayerBorder]}
                        />
                        <Text style={styles.playerName}>{username}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.playerName}>{finalWhiteElo}</Text>
                            <Text style={[styles.changeText, { color: getChangeColor(userEloChange), marginLeft: 5 }]}>
                                {formatChange(userEloChange)}
                            </Text>
                        </View>
                        <Text style={[styles.playerColor, { color: '#666666' }]}>مهره سفید</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                    <Text style={styles.buttonText}>بازگشت به صفحه اصلی</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}



const styles = StyleSheet.create({
    card: {
        position: "absolute",
        top: '50%', // می‌توانید با توجه به محل دکمه تنظیمش کنید
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
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
    changeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#1a4b6e',
        padding: 20,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    }
});
