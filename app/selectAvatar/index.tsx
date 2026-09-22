import AvatarGrid from '@/components/selectAvatar/avatarGrid';
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
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SelectAvatar = () => {
    const { user, saveAvatarToServer } = useUserStore();
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



    const handleConfirm = async () => {
        const selectedAvatar = avatars[activeIndex];
        const isUnlocked = isAvatarUnlocked(selectedAvatar.key, elo, user.coins);

        if (!isUnlocked) return;

        try {
            await saveAvatarToServer(selectedAvatar.key);
            router.back();
        } catch (error) {
            console.error('خطا در ذخیره آواتار روی سرور:', error);
            // اینجا می‌تونی یه Alert یا Toast نشون بدی
        }
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
                <AvatarGrid avatars={avatars} activeIndex={activeIndex} setActiveIndex={setActiveIndex} activeTab={activeTab} />

                <View style={styles.btnContainer}>
                    <ConfirmButton onPress={handleConfirm}>تایید</ConfirmButton>
                    <CancelButton onPress={() => router.back()}>انصراف</CancelButton>
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
};



const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#020c1d',
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