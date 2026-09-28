import CancelButton from '@/components/ui/cancelButton';
import ConfirmButton from '@/components/ui/confirmButton';
import useThemeStore from '@/stores/useThemeStore';
import useUserStore from '@/stores/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;

const EditProfile = () => {
  // گرفتن state و متدها از store
  const {
    user,
    isLoading,
    setUsername,
    setAge,
    setGender,
  } = useUserStore();
  const { colors } = useThemeStore();



  // State محلی برای ویرایش موقت
  const [localUsername, setLocalUsername] = useState(user.username);
  const [localAge, setLocalAge] = useState(user.age?.toString() || '');
  const [localGender, setLocalGender] = useState(user.gender || '');
  const [isSaving, setIsSaving] = useState(false);

  const genderOptions = [
    { id: 'female', label: 'زن', symbol: '♀', symbolStyle: styles.femaleSymbol },
    { id: 'male', label: 'مرد', symbol: '♂', symbolStyle: styles.maleSymbol },
    { id: 'neutral', label: '', symbol: '−', symbolStyle: styles.neutralSymbol },
  ];

  // به‌روزرسانی state محلی وقتی store تغییر می‌کنه
  useEffect(() => {
    setLocalUsername(user.username);
    setLocalAge(user.age?.toString() || '');
    setLocalGender(user.gender || 'neutral');
  }, [user.username, user.age, user.gender]);

  // تابع ذخیره مشخصات
  const handleSave = async () => {
    try {
      // اعتبارسنجی‌های ساده
      if (!localUsername.trim()) {
        Alert.alert('خطا', 'لطفاً نام کاربری را وارد کنید');
        setIsSaving(false);
        return;
      }

      setIsSaving(true);
      // ذخیره تمام فیلدها
      await Promise.all([
        setUsername(localUsername),
        setAge(localAge ? parseInt(localAge) : null),
        setGender(localGender),
      ]);
      router.back();
    } catch (error) {
      console.error('خطا در ذخیره مشخصات:', error);
      Alert.alert('خطا', 'مشکل در ذخیره مشخصات');
    } finally {
      setIsSaving(false);
    }
  };

  // نمایش لودینگ هنگام بارگذاری اولیه
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={styles.loadingText}>در حال بارگذاری...</Text>
      </View>
    );
  }

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ویرایش اطلاعات</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Username */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.labelIcon}>♙</Text>
                <Text style={styles.labelText}>نام کاربری</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={localUsername}
                  onChangeText={setLocalUsername}
                  placeholder="نام کاربری"
                  placeholderTextColor="#5e7598"
                  textAlign="right"
                />
              </View>
              <Text style={styles.helperText}>
                این نام در بازی و جدول‌ها نمایش داده می‌شود.
              </Text>
            </View>

            {/* Age */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.labelIcon}>▣</Text>
                <Text style={styles.labelText}>سن</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={localAge}
                  onChangeText={setLocalAge}
                  placeholder="سن"
                  placeholderTextColor="#5e7598"
                  keyboardType="numeric"
                  textAlign="right"
                />
                <Text style={styles.inputSuffix}>سال</Text>
              </View>
              <Text style={styles.helperText}>
                سن شما به صورت عمومی نمایش داده نمی‌شود.
              </Text>
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.labelIcon}>♙</Text>
                <Text style={styles.labelText}>جنسیت</Text>
              </View>
              <View style={styles.genderOptions}>
                {genderOptions.map((option) => {
                  const isActive = localGender === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.genderOption,
                        isActive && styles.genderOptionActive,
                      ]}
                      onPress={() => setLocalGender(option.id)}
                      activeOpacity={0.7}
                    >
                      {isActive && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                      <View style={styles.genderContent}>
                        <Text style={[styles.genderSymbol, option.symbolStyle]}>
                          {option.symbol}
                        </Text>
                        <Text style={[styles.genderLabel, isActive && styles.genderLabelActive]}>
                          {option.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.btnContainer}>
            <ConfirmButton onPress={handleSave}>ذخیره تغییرات</ConfirmButton>
            <CancelButton onPress={() => router.back()}>انصراف</CancelButton>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#020b1c',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    marginBottom: 26,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#f5f8ff',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  formCard: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(7, 31, 63, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(35, 112, 220, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 8,
    marginBottom: 20,
  },
  field: {
    marginBottom: 27,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 10,
  },
  labelIcon: {
    color: '#2d8cff',
    fontSize: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f8ff',
    textAlign: 'right',
  },
  inputWrapper: {
    height: 59,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 117, 235, 0.38)',
    backgroundColor: 'rgba(2, 16, 35, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    fontFamily: 'Vazirmatn', // if available
  },
  inputSuffix: {
    position: 'absolute',
    left: 18,
    color: '#a7bad8',
    fontSize: 13,
  },
  helperText: {
    marginTop: 7,
    color: '#7186a9',
    fontSize: 10,
    lineHeight: 18,
    textAlign: 'right',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    minHeight: 108,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(35, 112, 220, 0.25)',
    backgroundColor: 'rgba(3, 20, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  genderOptionActive: {
    borderColor: '#1682ff',
    backgroundColor: 'rgba(18, 92, 190, 0.32)',
    shadowColor: '#006cff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  genderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  genderSymbol: {
    fontSize: 34,
  },
  femaleSymbol: {
    color: '#ef6ca8',
  },
  maleSymbol: {
    color: '#2888ff',
  },
  neutralSymbol: {
    color: '#a377e8',
  },
  genderLabel: {
    color: '#b4c4dc',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
  },
  genderLabelActive: {
    color: '#ffffff',
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#1682ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0077ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 6,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 63,
    borderRadius: 18,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonGradient: {
    shadowColor: '#005bdc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(40, 130, 255, 0.28)',
    backgroundColor: 'rgba(17, 54, 98, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Responsive adjustments for small screens
  ...(isSmallScreen && {
    formCard: {
      padding: 20,
    },
    genderOption: {
      minHeight: 98,
    },
    genderSymbol: {
      fontSize: 29,
    },
    genderLabel: {
      fontSize: 10,
    },
  }),
});

export default EditProfile;