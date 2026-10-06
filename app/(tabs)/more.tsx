import Auth from '@/components/more/auth';
import MenuItem from '@/components/more/menuItem';
import ProfileSection from '@/components/more/profileSection';
import useThemeStore from '@/stores/useThemeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function MoreScreen() {
  const { colors } = useThemeStore();

  return (
    <LinearGradient
      colors={[colors.backgroundPrimary, colors.backgroundSecondary, colors.backgroundTertiary]}
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

          <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.menuGroup, { borderColor: colors.border, shadowColor: colors.shadow }]}
          >
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
          </LinearGradient>

          <Auth />

          <LinearGradient
            colors={[colors.profileBgPrimary, colors.profileBgSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.menuGroup, { borderColor: colors.border, shadowColor: colors.shadow }]}
          >
            <MenuItem
              icon="i"
              title="نسخه اپیکیشن:                    2.0.0"
              subtitle=""
            />
          </LinearGradient>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>

  );
}

const styles = StyleSheet.create({
  menuGroup: {
    flexShrink: 0,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});