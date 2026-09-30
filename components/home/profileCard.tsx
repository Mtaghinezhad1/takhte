import { getAvatarByKey } from '@/constants/avatars';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const ProfileCard = () => {
    const { user } = useUserStore();
    const elo = useUserStore.getState().getCurrentElo();
    const { colors } = useThemeStore();


    return (
        <TouchableOpacity style={styles.body} onPress={() => router.push(`/charts`)}>
            <LinearGradient
                colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >

                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                    <Image
                        source={user.avatarKey ? getAvatarByKey(user.avatarKey) : require('@/assets/avatar/default.jpeg')}
                        style={styles.avatar}
                    />
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name, {color: colors.text}]}>{user.username}</Text>
                    </View>
                    {/* optional subtitle could be added here */}
                </View>

                {/* ELO */}
                <View style={styles.eloContainer}>
                    <Text style={styles.eloLabel}>توانایی</Text>
                    <View style={styles.eloValue}>
                        <Text style={[styles.eloNumber,{color: colors.text}]}>{elo}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    body: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(91,139,213,0.25)',
        // Shadow (iOS & Android)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 20,
        backgroundColor: 'transparent', // gradient handles background
        minHeight: 135,
    },
    avatarWrapper: {
        marginRight: 14,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#328cff',
        // Glow effect using shadow
        shadowColor: '#2075ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 10,
    },
    info: {
        flex: 1,
        flexShrink: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7, // works on iOS 13+ / Android; fallback margin
    },
    name: {
        fontSize: 20,
        fontWeight: '800',
        color: '#f4f7ff',
        fontFamily: 'Vazirmatn', // Make sure font is linked in your project
    },
    eloContainer: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
        paddingLeft: 15,
        minWidth: 78,
    },
    eloLabel: {
        color: '#7d8eaf',
        fontSize: 12,
        fontWeight: '600',
    },
    eloValue: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    shield: {
        color: '#73aaff',
        fontSize: 18,
        marginRight: 4,
    },
    eloNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f4f7ff',
    },
});

export default ProfileCard;