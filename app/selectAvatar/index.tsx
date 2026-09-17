import AvatarTabs from '@/components/selectAvatar/avatarTabs';
import ProfileSection from '@/components/selectAvatar/profileSection';
import CancelButton from '@/components/ui/cancelButton';
import ConfirmButton from '@/components/ui/confirmButton';
import { getAllAvatars, isAvatarUnlocked } from '@/constants/avatars';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

const SelectAvatar = () => {
    const { user, setAvatar } = useUserStore();
    const elo = useUserStore.getState().getCurrentElo();
    const { colors } = useThemeStore();


    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'premium'


    // دریافت لیست تمام آواتارها با key و source
    const avatars = getAllAvatars();

    // پیدا کردن ایندکس اولیه بر اساس avatarKey فعلی کاربر
    const getInitialIndex = () => {
        const index = avatars.findIndex(avatar => avatar.key === user.avatarKey);
        return index !== -1 ? index : 0;
    };

    const [activeIndex, setActiveIndex] = useState(getInitialIndex());

    // اگر avatarKey در store تغییر کرد، ایندکس فعال را به‌روز کنیم
    useEffect(() => {
        const newIndex = avatars.findIndex(avatar => avatar.key === user.avatarKey);
        if (newIndex !== -1 && newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [user.avatarKey]);

    const handleImagePress = (index) => {
        const selectedAvatar = avatars[index];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, user.coins);

        if (isUnlocked) {
            setActiveIndex(index);
        } else {
            console.log('آواتار قفل است!');
        }
    };

    const handleConfirm = async () => {
        const selectedAvatar = avatars[activeIndex];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, user.coins);

        if (isUnlocked) {
            await setAvatar(selectedAvatar.key);
            router.back();
        }
    };

    const isAvatarLocked = (avatar) => {
        return !isAvatarUnlocked(avatar.key, elo, user.coins);
    };

    return (
        <LinearGradient
            colors={['#102b63', '#061636', '#02091c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                {/* Decorative glows (approximated; RN has no blur, so we use soft circles) */}
                <View style={[styles.glow, styles.glowOne]} />
                <View style={[styles.glow, styles.glowTwo]} />

                <ProfileSection source={avatars[activeIndex].source} />
                <AvatarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Grid */}
                    <View style={styles.avatarGrid}>
                        {avatars.map((avatar, index) => {
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
                                            {/* Checkmark badge */}
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
                                                    {/* Dark overlay */}
                                                    <View style={styles.lockedOverlay} />
                                                    {/* Lock badge */}
                                                    <View style={styles.lockBadge}>
                                                        <Text style={styles.lockIcon}>🔒</Text>
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    )}

                                    <Text
                                        style={[styles.avatarName, isSelected && styles.avatarNameSelected]}
                                        numberOfLines={1}
                                    >
                                        {avatar.name}
                                    </Text>

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

                {/* Buttons */}
                <View style={styles.btnContainer}>
                    <ConfirmButton onPress={handleConfirm}>تایید</ConfirmButton>
                    <CancelButton onPress={() => router.back()}>انصراف</CancelButton>

                </View>

            </SafeAreaView>
        </LinearGradient>
    );
};

const AVATAR_SIZE = isSmallScreen ? 68 : 76;


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#020c1d',
    },
    scrollContent: {
        flexGrow: 1,
    },
    appContainer: {
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingTop: 18,
        paddingBottom: 40,
    },
    glow: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#1769ff',
        opacity: 0.14,
    },
    glowOne: {
        top: -120,
        right: -100,
    },
    glowTwo: {
        bottom: 100,
        left: -150,
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
    avatarName: {
        marginTop: 8,
        fontSize: isSmallScreen ? 10 : 12,
        fontWeight: 'bold',
        color: '#d6e2f5',
        textAlign: 'center',
        width: '100%',
    },
    avatarNameSelected: {
        color: '#3d9cff',
    },
    premiumLabel: {
        marginTop: 4,
        color: '#ffbe32',
        fontSize: isSmallScreen ? 8 : 9,
        textAlign: 'center',
        width: '100%',
    },











    body: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        padding: 16,
        width: '90%',
        borderRadius: 16,
    },
    imgSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imgContainer: {
        borderRadius: 999,
        width: '30%',
        aspectRatio: 1,
        borderWidth: 0,
        marginBottom: 16,
        position: 'relative',
    },
    imgPart: {
        borderRadius: '50%',
        overflow: 'hidden'
    },
    active: {
        borderWidth: 8,
        borderColor: '#6495ed',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 4,
    },
    locked: {
        opacity: 0.6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    lockedImage: {
        opacity: 0.5,
    },
    lockBadgeText: {
        fontSize: 12,
    },
    lockOverlay: {
        position: 'absolute',
        bottom: -30,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 8,
        padding: 4,
        width: '100%',
    },
    lockText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    },
    profileSection: {
        padding: 32,
        alignItems: 'center',
    },
    avatar: {
        width: '35%',
        aspectRatio: 1,
        backgroundColor: 'grey',
        borderRadius: '50%',
        borderWidth: 0,
        marginVertical: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarSection: {
        alignItems: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});

export default SelectAvatar;