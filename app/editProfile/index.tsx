import useUserStore from '@/stores/useUserStore';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert, ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';

const EditProfile = () => {
  // گرفتن state و متدها از store
  const {
    username,
    age,
    gender,
    city,
    province,
    phoneNumber,
    email,
    isLoading,
    setUsername,
    setAge,
    setGender,
  } = useUserStore();

  // State محلی برای ویرایش موقت
  const [localUsername, setLocalUsername] = useState(username);
  const [localAge, setLocalAge] = useState(age?.toString() || '');
  const [localGender, setLocalGender] = useState(gender || '');
  const [isSaving, setIsSaving] = useState(false);

  // به‌روزرسانی state محلی وقتی store تغییر می‌کنه
  useEffect(() => {

    setLocalUsername(username);
    setLocalAge(age?.toString() || '');
    setLocalGender(gender || '');
  }, [username, age, gender]);

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>نام کاربری</Text>
        <TextInput
          style={styles.input}
          placeholder="نام خود را وارد کنید"
          placeholderTextColor="#999"
          value={localUsername}
          onChangeText={setLocalUsername}
        />
      </View>

      {/* Age Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>سن</Text>
        <TextInput
          style={styles.input}
          placeholder="سن خود را وارد کنید"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={localAge}
          onChangeText={setLocalAge}
        />
      </View>

      {/* Gender Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.title}>جنسیت</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={localGender}
            onValueChange={(itemValue) => setLocalGender(itemValue)}
            style={styles.picker}
            dropdownIconColor="#666"
          >
            <Picker.Item label="انتخاب کنید" value="" />
            <Picker.Item label="مرد" value="male" />
            <Picker.Item label="زن" value="female" />
          </Picker>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.cancel]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>انصراف</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            styles.confirm,
          ]}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmText}>ذخیره</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  title: {
    width: '100%',
    textAlign: 'right',
    fontWeight: '800',
    fontSize: 20,
    paddingHorizontal: 5,
    color: '#000',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#f9f9f9',
    padding: 12,
    textAlign: 'right',
    fontSize: 17,
    color: '#333',
  },
  pickerWrapper: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  btnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },

  btnContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6495ed',
    marginRight: 8,
  },
  cancelText: {
    color: '#6495ed',
    fontSize: 20,
    fontFamily: 'Kaghaz',
  },
  confirm: {
    backgroundColor: '#6495ed',
    borderWidth: 3,
    borderColor: '#6495ed',
    marginLeft: 8,
  },
});

export default EditProfile;