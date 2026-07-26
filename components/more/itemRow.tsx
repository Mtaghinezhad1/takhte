import useThemeStore from '@/stores/useThemeStore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const ItemRow = ({ text, icon, onPress, children = null }) => {
  const { colors } = useThemeStore();
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

  return (
    <TouchableOpacity  style={[styles.item, { padding: getPadding(), backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
      <View style={styles.arrow}>
        {children}
        {
          !children &&
          <Text style={[styles.arrowText, { fontSize: getFontSize(), color: colors.text }]}>{'<'}</Text>
        }
      </View>
      <View style={styles.textItem}>
        <Text style={[styles.itemText, { fontSize: getFontSize(), color: colors.text }]}>{text}</Text>
      </View>
      <View style={styles.icon}>
        <IconSymbol size={getIconSize()} name={icon} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 5,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    marginRight: 10,
    fontWeight: '300',
  },
  arrowText: {
    fontFamily: 'Kaghaz',
  },
  textItem: {
    flex: 1,
    textAlign: 'right',
  },
  itemText: {
    textAlign: 'right',
    fontWeight: '900',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default ItemRow;