import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const ProfileSection = ({ source }) => {
    const { user, statistics } = useUserStore();
    const elo = useUserStore.getState().getCurrentElo();
    const { colors } = useThemeStore();



    // Responsive styles based on screen height
    const isShort = screenHeight < 700;

    return (
        <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.profileCard, isShort && styles.profileCardShort]}
        >
            {/* ELO box */}
            <View style={styles.eloBox}>
                <Text style={styles.eloLabel}>توانایی</Text>
                <Text style={[styles.eloNumber, isShort && styles.eloNumberShort, { color: colors.text }]}>{elo}</Text>
            </View>

            {/* Profile info */}
            <View style={styles.profileInfo}>
                <Text style={[styles.profileName, isShort && styles.profileNameShort, { color: colors.text }]}>{user.username}</Text>
            </View>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Image
                    source={source}
                    style={[styles.avatar, isShort && styles.avatarShort]}
                />
            </View>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    profileCard: {
        padding: 14,
        borderRadius: 22,
        backgroundColor: 'rgba(19, 55, 105, 0.92)',
        borderWidth: 1,
        borderColor: 'rgba(71, 137, 230, 0.32)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        marginVertical: 16,
        elevation: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
    },
    profileCardShort: {
        padding: 10,
    },
    avatarWrapper: {
        position: 'relative',
        flexShrink: 0,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#2780ff',
    },
    avatarShort: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#ffffff',
        marginBottom: 5,
        textAlign: 'right',
    },
    profileNameShort: {
        fontSize: 16,
    },
    profileStatus: {
        color: '#83a6d5',
        fontSize: 11,
        textAlign: 'right',
    },
    profileStatusShort: {
        fontSize: 10,
    },
    eloBox: {
        alignItems: 'center',
        paddingRight: 10,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.12)',
    },
    eloLabel: {
        color: '#4992ff',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    eloNumber: {
        fontSize: 22,
        fontWeight: '900',
        color: '#ffffff',
        marginTop: 2,
        textAlign: 'center',
    },
    eloNumberShort: {
        fontSize: 18,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.07)',
    },
    statNumber: {
        fontSize: 14,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
    },
    statNumberShort: {
        fontSize: 12,
    },
    statLabel: {
        fontSize: 9,
        color: '#7895bd',
        marginTop: 3,
        textAlign: 'center',
    },
    statLabelShort: {
        fontSize: 8,
    },
});

export default ProfileSection;