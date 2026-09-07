import Auth from '@/components/more/auth';
import MenuItem from '@/components/more/menuItem';
import ProfileSection from '@/components/more/profileSection';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MoreScreen() {
  return (
    <LinearGradient
      colors={['#102b63', '#061636', '#02091c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileSection />

          <View style={styles.menuGroup}>
            <MenuItem
              icon="👤"
              title="ویرایش پروفایل"
              subtitle="تغییر اطلاعات کاربری"
              onPress={() => router.push(`/editProfile`)}
            />
            <MenuItem
              icon="📈"
              title="آمار و عملکرد"
              subtitle="بررسی بازی‌ها و رتبه‌بندی"
              onPress={() => router.push(`/charts`)}
            />
            <MenuItem
              icon="◐"
              title="حالت تاریک"
              subtitle="تم تیره برنامه"
              showToggle
            />
          </View>

          <Auth />

          <View style={styles.menuGroup}>
            <MenuItem
              icon="i"
              title="نسخه اپیکیشن:                    2.0.0"
              subtitle=""
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  menuGroup: {
    flexShrink: 0,
    backgroundColor: 'rgba(7, 29, 62, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(70, 126, 201, 0.2)',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});