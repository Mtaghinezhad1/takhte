import { getAllAvatars, isAvatarUnlocked } from '@/constants/avatars';
import useUserStore from '@/stores/useUserStore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';

const SelectAvatar = () => {
    const { username, elo, coins, avatarKey, setAvatar } = useUserStore();
    
    // دریافت لیست تمام آواتارها با key و source
    const avatars = getAllAvatars();
    
    // پیدا کردن ایندکس اولیه بر اساس avatarKey فعلی کاربر
    const getInitialIndex = () => {
        const index = avatars.findIndex(avatar => avatar.key === avatarKey);
        return index !== -1 ? index : 0;
    };
    
    const [activeIndex, setActiveIndex] = useState(getInitialIndex());

    // اگر avatarKey در store تغییر کرد، ایندکس فعال را به‌روز کنیم
    useEffect(() => {
        const newIndex = avatars.findIndex(avatar => avatar.key === avatarKey);
        if (newIndex !== -1 && newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [avatarKey]);

    const handleImagePress = (index) => {
        const selectedAvatar = avatars[index];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, coins);
        
        if (isUnlocked) {
            setActiveIndex(index);
        } else {
            // می‌توانید یک پیام خطا به کاربر نشان دهید
            console.log('آواتار قفل است!');
        }
    };

    const handleConfirm = async () => {
        const selectedAvatar = avatars[activeIndex];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, coins);
        
        if (isUnlocked) {
            await setAvatar(selectedAvatar.key);
            router.back();
        }
    };

    // بررسی قفل بودن آواتار برای نمایش
    const isAvatarLocked = (avatar) => {
        return !isAvatarUnlocked(avatar.key, elo, coins);
    };

    return (
        <View style={styles.body}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarImg} source={avatars[activeIndex].source} />
                    </View>
                    {/* نمایش اطلاعات نیازمندی آواتار فعال اگر قفل باشد */}
                    {avatars[activeIndex].requirements && !isAvatarUnlocked(avatars[activeIndex].key, elo, coins) && (
                        <View style={styles.lockOverlay}>
                            <Text style={styles.lockText}>
                                {avatars[activeIndex].requirements.minElo && `نیاز به ریتینگ ${avatars[activeIndex].requirements.minElo}`}
                                {avatars[activeIndex].requirements.minCoins && `\nنیاز به ${avatars[activeIndex].requirements.minCoins} سکه`}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.imgSection}>
                    {avatars.map((avatar, index) => {
                        const locked = isAvatarLocked(avatar);
                        return (
                            <TouchableOpacity
                                key={avatar.key}
                                style={[
                                    styles.imgContainer,
                                    activeIndex === index && styles.active,
                                    locked && styles.locked,
                                ]}
                                onPress={() => handleImagePress(index)}
                                activeOpacity={0.8}
                                disabled={locked}
                            >
                                <Image source={avatar.source} style={[styles.image, locked && styles.lockedImage]} />
                                {locked && (
                                    <View style={styles.lockBadge}>
                                        <Text style={styles.lockBadgeText}>🔒</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.btn, styles.cancel]}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelText}>انصراف</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.btn, 
                            styles.confirm,
                            isAvatarLocked(avatars[activeIndex]) && styles.confirmDisabled
                        ]}
                        onPress={handleConfirm}
                        activeOpacity={0.7}
                        disabled={isAvatarLocked(avatars[activeIndex])}
                    >
                        <Text style={styles.confirmText}>تایید</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
    },
    imgSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imgContainer: {
        borderRadius: 999,
        overflow: 'hidden',
        width: '30%',
        aspectRatio: 1,
        borderWidth: 0,
        marginBottom: 16,
        position: 'relative',
    },
    active: {
        borderWidth: 8,
        borderColor: 'orange',
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
    lockBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
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
    btnContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    btn: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancel: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'orange',
        marginRight: 8,
    },
    cancelText: {
        color: 'orange',
        fontSize: 20,
        fontFamily: 'Kaghaz',
    },
    confirm: {
        backgroundColor: 'orange',
        borderWidth: 3,
        borderColor: 'orange',
        marginLeft: 8,
    },
    confirmDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    confirmText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Kaghaz',
    },
    profileSection: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
});

export default SelectAvatar;