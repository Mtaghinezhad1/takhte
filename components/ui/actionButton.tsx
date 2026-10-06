import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ActionButton({ onPress, children, disabled = false, variant = 'confirm' }) {
    const {colors, isDark} = useThemeStore();

    const isCancel = variant === 'cancel';

    const gradientColors = isCancel
        ? [colors.cancelBtnSecondary, colors.cancelBtnPrimary]
        : [colors.btnSecondary, colors.btnPrimary];

    return (
        <TouchableOpacity
            style={styles.levelWrapper}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.level, styles.activeLevel]}
            >
                <Text style={[styles.levelText, styles.activeText,{color: (!isDark && variant == 'cancel' ? '#3989ff' : 'white')}]}>
                    {children}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    levelWrapper: {
        flex: 1,
        height: 62,
        marginBottom: 12,
    },
    level: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        borderWidth: 1,
    },
    activeLevel: {
        borderColor: '#3989ff',
        shadowColor: '#1a6aff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 22,
        elevation: 8,
    },
    levelText: {
        fontFamily: 'Vazirmatn',
        fontWeight: '700',
        fontSize: 17,
        color: '#8296ba',
        textAlign: 'center',
    },
    activeText: {
        color: '#ffffff',
    },
});