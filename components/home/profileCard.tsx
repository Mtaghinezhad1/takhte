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
                        <Text>سکه: {coins}</Text>
                        <Text style={styles.amountMargin}>توانایی: {elo}</Text>
                    </View>
                </View>
                {/* Avatar on the far right */}
                <View style={styles.avatar}>
                    <Image
                        style={styles.image}
                        source={avatar ? avatar : 'sdf'}
                    // Replace with your local image: require('./1 (13).jpeg')
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
        backgroundColor: '#fff', // optional, matches original body
    },
    container: {
        backgroundColor: '#dee4e0',
        borderRadius: 1 * rem, // 16px
        width: '90%',
        flexDirection: 'row',     // horizontal layout
        justifyContent: 'flex-end', // push children to the right
        marginTop: 1 * rem,       // 80px
        marginBottom: 1 * rem,       // 80px
        padding: 1 * rem,         // 16px
    },
    textSection: {
        flex: 1,                  // takes remaining space
        alignItems: 'flex-end',   // right‑align the text
        justifyContent: 'space-between', // separates name and amounts
    },
    name: {
        fontWeight: '800',
        fontSize: 1.6 * rem,      // ~26px
    },
    amounts: {
        flexDirection: 'row',
        marginTop: 0,             // adjust if needed
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