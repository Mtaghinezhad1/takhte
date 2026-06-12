import ItemRow from '@/components/more/itemRow';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function MoreScreen() {
  const { username, elo, coins, avatar } = useUserStore();
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

  const MoneyIcon = () => (
    <Icon name="attach-money" size={getIconSize()} color="#1f1f1f" />
  );

  const SpeedIcon = () => (
    <Icon name="speed" size={getIconSize()} color="#1f1f1f" />
  );

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
          <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={avatar ? avatar : require('@/assets/avatar/default.jpeg')} />
          </View>
          <Text style={styles.profileName}>{username}</Text>
          {/* <Text style={styles.profileBio}>ID: 737848826</Text> */}

          <View style={[styles.btnContainer, { gap: width * 0.015 }]}>

            <View style={[styles.btn, styles.leftBtn, { padding: getPadding() }]}>
              <View style={styles.textBtn}>
                <Text style={[styles.btnText, { fontSize: getFontSize() }]}>سکه: {coins}</Text>
              </View>
              <View style={styles.icon}>
                <MoneyIcon />
              </View>
            </View>

            <View style={[styles.btn, styles.rightBtn, { padding: getPadding() }]}>
              <View style={styles.textBtn}>
                <Text style={[styles.btnText, { fontSize: getFontSize() }]}>توانایی: {elo}</Text>
              </View>
              <View style={styles.icon}>
                <SpeedIcon />
              </View>
            </View>
          </View>
        </View>



        <View style={styles.itemContainer}>
          {/* <ItemRow icon='person' text="نام کاربری" /> */}
          {/* <ItemRow text="آشنایی با قوانین تخته نرد" />
          <ItemRow text="آشنایی با قوانین تخته نرد"  /> */}
        </View>

        <View style={styles.itemContainer}>
          {/* <ItemRow text="درباره ما"  /> */}
          <ItemRow icon='info-outline' text="نسخه اپلیکیشن              1.0.0"  />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    backgroundColor: '#dee4e0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  leftBtn: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  rightBtn: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  textBtn: {
    textAlign: 'right',
  },
  btnText: {
    color: '#1f1f1f',
    fontFamily: 'Kaghaz',
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
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: 'Kaghaz',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: 'Kaghaz',
    color: '#777777',
    marginBottom: 4,
  },


});