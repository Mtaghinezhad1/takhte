import { isAvatarUnlocked } from '@/constants/avatars';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;


const AvatarGrid = ({ avatars, activeIndex, setActiveIndex, activeTab }) => {
    const { user, setAvatar } = useUserStore();
    const elo = useUserStore.getState().getCurrentElo();

    const isAvatarLocked = (avatar) => {
        return !isAvatarUnlocked(avatar.key, elo, user.coins);
    };

    // آواتارهای قابل نمایش بر اساس تب فعال، همراه با ایندکس اصلی
    const displayedAvatars = avatars
        .map((avatar, index) => ({ ...avatar, originalIndex: index }))
        .filter((avatar) => {
            if (activeTab === 'premium') {
                return isAvatarLocked(avatar); // فقط قفل‌شده‌ها
            }
            return true; // همه
        });

    const handleImagePress = (index) => {
        const selectedAvatar = avatars[index];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, user.coins);

        if (isUnlocked) {
            setActiveIndex(index);
        } else {
            console.log('آواتار قفل است!');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.avatarGrid}>
                {displayedAvatars.map((avatar) => {
                    const index = avatar.originalIndex;
                    const locked = isAvatarLocked(avatar);
                    const isSelected = activeIndex === index;

                    return (
                        <TouchableOpacity
                            key={avatar.key}
                            style={styles.avatarItem}
                            activeOpacity={0.8}
                            disabled={locked}
                            onPress={() => handleImagePress(index)}
                        >
                            {/* Avatar wrapper (gradient ring) */}
                            {isSelected && !locked ? (
                                <LinearGradient
                                    colors={['#48b0ff', '#1264ff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.avatarWrapper, styles.avatarWrapperSelected]}
                                >
                                    <Image
                                        source={avatar.source}
                                        style={styles.avatarImage}
                                    />
                                    <View style={styles.checkBadge}>
                                        <Text style={styles.checkText}>✓</Text>
                                    </View>
                                </LinearGradient>
                            ) : (
                                <View
                                    style={[
                                        styles.avatarWrapper,
                                        locked && styles.avatarWrapperLocked,
                                    ]}
                                >
                                    <Image
                                        source={avatar.source}
                                        style={[styles.avatarImage, locked && styles.avatarImageLocked]}
                                    />
                                    {locked && (
                                        <>
                                            <View style={styles.lockedOverlay} />
                                            <View style={styles.lockBadge}>
                                                <Text style={styles.lockIcon}>🔒</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            )}

                            {locked && (
                                <Text style={styles.premiumLabel} numberOfLines={1}>
                                    👑 اشتراک ویژه
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
};

const AVATAR_SIZE = isSmallScreen ? 68 : 76;


const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // Simulate grid gap: 18 vertical, 10 horizontal (we'll use margins on items)
    },
    avatarItem: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 18,
        paddingHorizontal: 5,
    },
    avatarWrapper: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        padding: 3,
        backgroundColor: '#10294d',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 5,
        position: 'relative',
    },
    avatarWrapperSelected: {
        shadowColor: '#1680ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 28,
        elevation: 12,
    },
    avatarWrapperLocked: {
        borderWidth: 1,
        borderColor: 'rgba(100, 145, 200, 0.4)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 2,
        borderColor: '#081c38',
    },
    avatarImageLocked: {
        opacity: 0.68,
    },
    lockedOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: 'rgba(0, 13, 31, 0.25)',
    },
    checkBadge: {
        position: 'absolute',
        left: -5,
        bottom: -3,
        width: 27,
        height: 27,
        borderRadius: 13.5,
        backgroundColor: '#247cf5',
        borderWidth: 3,
        borderColor: '#071a36',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
    },
    checkText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    lockBadge: {
        position: 'absolute',
        top: -5,
        left: -5,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#17375f',
        borderWidth: 2,
        borderColor: '#6d91bb',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
    },
    lockIcon: {
        fontSize: 12,
        color: '#ffffff',
    },
    premiumLabel: {
        marginTop: 4,
        color: '#ffbe32',
        fontSize: 8,
        textAlign: 'center',
        width: '100%',
    },
});

export default AvatarGrid;