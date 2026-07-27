import ItemRow from '@/components/more/itemRow';
import { ThemeToggle } from '@/components/ThemeToggle';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAvatarByKey } from '@/constants/avatars';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MoreScreen() {
  const { username, coins, avatarKey } = useUserStore();
  const elo = useUserStore.getState().getCurrentElo();
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>

          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Image style={styles.avatarImg} source={avatarKey ? getAvatarByKey(avatarKey) : require('@/assets/avatar/default.jpeg')} />
            </View>
            <TouchableOpacity style={styles.edit} onPress={() => router.push(`/selectAvatar`)}>
              <View style={styles.arrow}>
                <IconSymbol size={getIconSize()} name="edit" color='white' />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={[styles.profileName, { color: colors.text }]}>{username}</Text>
          {/* <Text style={styles.profileBio}>ID: 737848826</Text> */}

          <View style={[styles.btnContainer, { gap: width * 0.015 }]}>

            {/* <View style={[styles.btn, { padding: getPadding() }]}>
              <View style={styles.textBtn}>
                <Text style={[styles.btnText, { fontSize: getFontSize() }]}>سکه: {coins}</Text>
              </View>
              <View style={styles.icon}>
                <IconSymbol size={getIconSize()} name="attach-money" color='black' />
              </View>
            </View> */}
            <TouchableOpacity style={[styles.btn, { padding: getPadding(), backgroundColor: colors.card }]} onPress={() => router.push(`/charts`)}>
              <View style={styles.textBtn}>
                <Text style={[styles.btnText, { fontSize: getFontSize(), color: colors.text }]}>توانایی: {elo}</Text>
              </View>
              <View style={styles.icon}>
                <IconSymbol size={getIconSize()} name="speed" color={colors.text} />
              </View>
            </TouchableOpacity>

          </View>
        </View>


        <View style={styles.itemContainer}>
          <ItemRow icon='person' text="ویرایش پروفایل" onPress={() => router.push(`/editProfile`)} />
          <ItemRow icon='timeline' text="آمار" onPress={() => router.push(`/charts`)} />
          {/* <ItemRow text="آشنایی با قوانین تخته نرد"  /> */}
        </View>

        <View style={styles.itemContainer}>
          <ItemRow icon='darkMode' text="حالت تاریک" ><ThemeToggle /></ItemRow>
        </View>

        <View style={styles.itemContainer}>
          {/* <ItemRow text="درباره ما"  /> */}
          <ItemRow icon='info-outline' onPress={() => console.log('ss')} text="نسخه اپلیکیشن              1.3.0" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 3,
  },
  arrow: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6495ed',
    elevation: 4,
  },
  textBtn: {
    textAlign: 'right',
  },
  btnText: {
    fontWeight: '900',
  },
  itemContainer: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    gap: 2,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },

  profileSection: {
    padding: 32,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: '35%',
    aspectRatio: 1,
    backgroundColor: 'grey',
    borderRadius: '50%',
    borderWidth: 0,
    marginVertical: 10,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontWeight: '900',
    fontSize: 20,
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: 'Kaghaz',
    color: '#777777',
    marginBottom: 4,
  },
  edit: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  }

});