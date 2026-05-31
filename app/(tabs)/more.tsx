import { IconSymbol } from '@/components/ui/icon-symbol';
import useUserStore from '@/stores/useUserStore';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

// Helper component for stats items
const StatItem = ({ icon, label, value, iconColors }: any) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// Helper component for menu items
const MenuItem = ({ icon, title, subtitle, onPress, isLogout = false, rightText = null }: any) => (
  <TouchableOpacity
    style={[styles.menuItem, isLogout && styles.logoutMenuItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {rightText ? (
      <Text style={styles.rightText}>{rightText}</Text>
    ) : (
      <Text style={[styles.arrow, isLogout && styles.logoutArrow]}>‹</Text>
    )}
    <View style={styles.infoContainer}>
      <Text style={[styles.title, isLogout && styles.logoutTitle]}>{title}</Text>
      <Text style={[styles.subtitle, isLogout && styles.logoutSubtitle]}>{subtitle}</Text>
    </View>
    <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
      <Text style={[styles.icon, isLogout && styles.logoutIcon]}>{icon}</Text>
    </View>
  </TouchableOpacity>
);

export default function MoreScreen() {
  const { username, elo, coins, avatar } = useUserStore();
  const { width } = useWindowDimensions(); // واکنش‌گرا به تغییر اندازه صفحه

  // Demo state for dynamic values
  const [phoneNumber] = useState('09xxxxxxxxx');
  const [language, setLanguage] = useState('فارسی');
  const [darkMode, setDarkMode] = useState('خاموش');
  const [theme, setTheme] = useState('پیش‌فرض');

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
          <Text style={styles.profileBio}>ID: 737848826</Text>

          <View style={styles.statsContainer}>
            <StatItem
              icon="⚡"
              label="توانایی"
              value={elo}
              iconColors={['#4CAF50', '#8BC34A']}
            />
            <StatItem
              icon="🪙"
              label="سکه"
              value={coins}
              iconColors={['#FF9800', '#FFC107']}
            />
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          {/* <MenuItem
            icon="⚙️"
            title="تنظیمات حساب"
            subtitle="مدیریت اطلاعات شخصی و امنیت"
            onPress={() => { }}
          /> */}
          <MenuItem
            icon={<IconSymbol size={28} name="account_circle.fill" color={'black'} />}
            title="نام کاربری"
            subtitle={username}
            onPress={() => { }}
            rightText="‹"
          />
          {/* <MenuItem
            icon="📱"
            title="شماره موبایل"
            subtitle={phoneNumber}
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="🔑"
            title="رمز کاربری"
            subtitle="تغییر رمز عبور"
            onPress={() => { }}
            rightText="‹"
          /> */}
          {/* <MenuItem
            icon="✏️"
            title="ویرایش پروفایل"
            subtitle="بروزرسانی عکس و اطلاعات"
            onPress={() => { }}
            rightText="‹"
          /> */}
          {/* <MenuItem
            icon="🌐"
            title="تنظیمات زبان"
            subtitle={language}
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="🌙"
            title="حالت تاریک"
            subtitle={darkMode}
            onPress={() => { }}
            rightText="‹"
          /> */}
          {/* <MenuItem
            icon="🎨"
            title="تم برنامه"
            subtitle={theme}
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="🔔"
            title="اعلان‌ها"
            subtitle="تنظیم اعلان‌ها و هشدارها"
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="🔒"
            title="حریم خصوصی"
            subtitle="مدیریت مجوزها و حریم خصوصی"
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="🔍"
            title="پیدا کردن دوستان"
            subtitle="جستجوی کاربران"
            onPress={() => { }}
            rightText="‹"
          /> */}
          {/* <MenuItem
            icon="📨"
            title="دعوت از دوستان"
            subtitle="ارسال لینک دعوت"
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="💬"
            title="ارتباط با ما"
            subtitle="راه‌های تماس و پشتیبانی"
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="📝"
            title="انتقادات و پیشنهادات"
            subtitle="نظرات خود را با ما در میان بگذارید"
            onPress={() => { }}
            rightText="‹"
          />
          <MenuItem
            icon="📞"
            title="پشتیبانی"
            subtitle="ارتباط با تیم پشتیبانی"
            onPress={() => { }}
            rightText="‹"
          /> */}
          <MenuItem
            icon={<IconSymbol size={28} name="info.fill" color={'black'} />}
            title="درباره ما"
            subtitle="نسخه اپلیکیشن ۱.۰.۰"
            onPress={() => { }}
            rightText="‹"
          />

          {/* <View style={styles.divider} />

          <MenuItem
            icon="🚪"
            title="خروج از حساب"
            subtitle="از حساب کاربری خود خارج شوید"
            onPress={() => { }}
            isLogout={true}
            rightText="‹"
          /> */}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>نسخه ۱.۰.۰</Text>
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
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 20,
  },
  profileSection: {
    padding: 32,
    paddingBottom: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: '35%',
    aspectRatio: 1,
    backgroundColor: 'grey',
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: '#3e7ce3',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 100,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 20,
    fontFamily: 'Kaghaz',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Kaghaz',
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Kaghaz',
    color: '#1a1a1a',
  },
  menuContainer: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  logoutIconContainer: {
    backgroundColor: '#ffe8e8',
  },
  icon: {
    fontSize: 22,
    color: '#555555',
  },
  logoutIcon: {
    color: '#e74c3c',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Kaghaz',
    color: '#1a1a1a',
  },
  logoutTitle: {
    color: '#e74c3c',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Kaghaz',
    color: '#999999',
    marginTop: 2,
  },
  logoutSubtitle: {
    color: '#e74c3c',
  },
  arrow: {
    fontSize: 24,
    color: '#cccccc',
    marginRight: 10,
    fontWeight: '300',
  },
  logoutArrow: {
    color: '#e74c3c',
  },
  rightText: {
    fontSize: 15,
    fontFamily: 'Kaghaz',
    color: '#1a1a1a',
    marginRight: 10,
  },
  divider: {
    height: 10,
    backgroundColor: 'transparent',
  },
  footer: {
    fontFamily: 'Kaghaz',
    textAlign: 'center',
    padding: 20,
    fontSize: 12,
    color: '#bbbbbb',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
});