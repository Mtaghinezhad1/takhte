import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const ItemRow = ({ text }) => {
    const { width } = useWindowDimensions(); // واکنش‌گرا به تغییر اندازه صفحه

    // محاسبه اندازه فونت واکنش‌گرا
    const getFontSize = () => {
        if (width < 400) return 18;
        if (width < 600) return 22;
        return 27;
    };

    // محاسبه اندازه آیکون واکنش‌گرا
    const getIconSize = () => {
        if (width < 400) return 24;
        if (width < 600) return 28;
        return 32;
    };

    // محاسبه padding واکنش‌گرا
    const getPadding = () => {
        if (width < 400) return 12;
        return 16;
    };

    const InfoIcon = () => (
        <Icon name="info-outline" size={getIconSize()} color="#1f1f1f" />
    );
    const { username, elo, coins, avatar } = useUserStore();

    return (
        <TouchableOpacity style={[styles.item, { padding: getPadding() }]}>
            <View style={styles.arrow}>
                <Text style={[styles.arrowText, { fontSize: getFontSize() }]}>{'<'}</Text>
            </View>
            <View style={styles.textItem}>
                <Text style={[styles.itemText, { fontSize: getFontSize() }]}>{text}</Text>
            </View>
            <View style={styles.icon}>
                <InfoIcon />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#dee4e0',
        borderRadius: 5,
      },
      arrow: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
        color: '#cccccc',
        marginRight: 10,
        fontWeight: '300',
      },
      arrowText: {
        color: '#1f1f1f',
        fontWeight: '500',
      },
      textItem: {
        flex: 1,
        textAlign: 'right',
      },
      itemText: {
        color: '#1f1f1f',
        textAlign: 'right',
        fontWeight: '500',
      },
      icon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
      },
});

export default ItemRow;