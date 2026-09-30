import { getAvatarByKey } from '@/constants/avatars';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const ProfileSection = () => {
    const { user, statistics } = useUserStore();
    const elo = useUserStore.getState().getCurrentElo();
    const { colors } = useThemeStore();



    // Responsive styles based on screen height
    const isShort = screenHeight < 700;

    return (
        <View style={styles.appContainer}>
            {/* Header */}
            <View style={[styles.header, isShort && styles.headerShort]}>
                <Text style={[styles.headerTitle,{color: colors.text}]}>
                    نرد <Text style={styles.headerHighlight}>لند</Text>
                </Text>
            </View>

            {/* Main content */}
            <View style={styles.main}>
                {/* Profile Card */}
                <LinearGradient
                    colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.profileCard, isShort && styles.profileCardShort]}
                >
                    <View style={styles.profileTop}>
                        {/* ELO box */}
                        <View style={styles.eloBox}>
                            <Text style={styles.eloLabel}>توانایی</Text>
                            <Text style={[styles.eloNumber, isShort && styles.eloNumberShort, {color: colors.text}]}>{elo}</Text>
                        </View>

                        {/* Profile info */}
                        <View style={styles.profileInfo}>
                            <Text style={[styles.profileName, isShort && styles.profileNameShort, {color: colors.text}]}>{user.username}</Text>
                            <Text style={[styles.profileStatus, isShort && styles.profileStatusShort]}>
                                برای شروع بازی وارد حساب شوید
                            </Text>
                        </View>

                        {/* Avatar */}

                        <TouchableOpacity style={styles.avatarWrapper} onPress={() => router.push(`/selectAvatar`)}>
                            <Image
                                source={user.avatarKey ? getAvatarByKey(user.avatarKey) : require('@/assets/avatar/default.jpeg')}
                                style={[styles.avatar, isShort && styles.avatarShort]}
                            />
                        </TouchableOpacity>


                    </View>

                    {/* Stats */}
                    <View style={styles.stats}>
                        <View style={styles.stat}>
                            <Text style={[styles.statNumber, isShort && styles.statNumberShort, {color: colors.text}]}>{statistics.wins / statistics.totalGames || 0}%</Text>
                            <Text style={[styles.statLabel, isShort && styles.statLabelShort]}>
                                نرخ برد
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={[styles.statNumber, isShort && styles.statNumberShort, {color: colors.text}]}>{statistics.winStreak}</Text>
                            <Text style={[styles.statLabel, isShort && styles.statLabelShort]}>
                                برد متوالی
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={[styles.statNumber, isShort && styles.statNumberShort, {color: colors.text}]}>{statistics.totalGames}</Text>
                            <Text style={[styles.statLabel, isShort && styles.statLabelShort]}>تعداد باز</Text>
                        </View>
                    </View>
                </LinearGradient>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 16,
    },
    header: {
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    headerShort: {
        height: 48,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'right',
    },
    headerHighlight: {
        color: '#3184ff',
    },
    main: {
        flex: 1,
        paddingVertical: 4,
        gap: 10,
    },
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
        elevation: 8,
    },
    profileCardShort: {
        padding: 10,
    },
    profileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
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