import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const ProfileCard = () => {
    const { username, elo, coins, avatar } = useUserStore();

    return (
        <View style={styles.body}>
            <View style={styles.container}>
                {/* Text section on the left (aligned to the right inside) */}
                <View style={styles.textSection}>
                    <Text style={styles.name}>{username}</Text>
                    <View style={styles.amounts}>
                        <Text style={styles.amountText}>سکه: {coins}</Text>
                        <Text style={[styles.amountMargin, styles.amountText]}>توانایی: {elo}</Text>
                    </View>
                </View>
                {/* Avatar on the far right */}
                <View style={styles.avatar}>
                    <Image
                        style={styles.image}
                        source={avatar ? avatar : require('@/assets/avatar/default.jpeg')}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#dee4e0',
        borderRadius: 1 * rem, // 16px
        width: '90%',
        flexDirection: 'row',     // horizontal layout
        justifyContent: 'flex-end', // push children to the right
        marginTop: 3 * rem,       // 80px
        marginBottom: 1 * rem,       // 80px
        padding: 0.5 * rem,         // 16px
    },
    textSection: {
        flex: 1,                  // takes remaining space
        alignItems: 'flex-end',   // right‑align the text
        justifyContent: 'space-between', // separates name and amounts
    },
    name: {
        fontFamily: 'Kaghaz',
        fontSize: 1.3 * rem,      // ~26px
    },
    amounts: {
        flexDirection: 'row',
        marginTop: 0,             // adjust if needed
    },
    amountText: {
        fontFamily: 'Kaghaz',
    },
    amountMargin: {
        marginLeft: 2 * rem,      // 32px
    },
    avatar: {
        marginLeft: 1 * rem,      // 16px
        width: '20%',             // relative to container
        aspectRatio: 1,           // keeps it square
        overflow: 'hidden',
        borderRadius: 1 * rem,    // 16px
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default ProfileCard;