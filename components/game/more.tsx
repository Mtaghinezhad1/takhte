import useGameStore from '@/stores/useGameStore';
import React, { useRef, useState } from 'react';
import {
  Animated, Modal, Pressable, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';



const More = () => {
  const forfeitHand = useGameStore(state => state.forfeitHand);
  const forfeitMatch = useGameStore(state => state.forfeitMatch);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  // اندازه‌گیری موقعیت دکمه برای نمایش منو در زیر آن
  const measureButtonPosition = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonPosition({
          top: pageY + height + 5, // 5 پیکسل فاصله از دکمه
          left: pageX -150,
          width: width,
        });
      });
    }
  };

  // باز کردن منو با انیمیشن
  const openDropdown = () => {
    measureButtonPosition();
    setIsDropdownVisible(true);
    
    // انیمیشن fade in و slide down
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // بستن منو با انیمیشن
  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDropdownVisible(false);
    });
  };

  // کلیک روی گزینه‌ها
  const handleOptionPress = (option) => {
    closeDropdown();
    
    // تاخیر کوتاه برای بسته شدن منو قبل از اجرای عملیات
    setTimeout(() => {
      switch (option) {
        case 'assignHand':
          console.log('واگذاری این دست اجرا شد');
          forfeitHand();
          // منطق واگذاری این دست را اینجا اضافه کنید
          break;
        case 'assignGame':
          console.log('واگذاری کل بازی اجرا شد');
          forfeitMatch();
          // منطق واگذاری کل بازی را اینجا اضافه کنید
          break;
        default:
          break;
      }
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* دکمه اصلی */}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.mainButton}
        onPress={openDropdown}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>▼</Text>
      </TouchableOpacity>

      {/* منوی آبشاری */}
      {isDropdownVisible && (
        <Modal
          transparent
          visible={isDropdownVisible}
          onRequestClose={closeDropdown}
          animationType="none"
        >
          <Pressable style={styles.overlay} onPress={closeDropdown}>
            <View style={styles.dropdownContainer}>
              <Animated.View
                style={[
                  styles.dropdown,
                  {
                    position: 'absolute',
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                    width: Math.max(buttonPosition.width, 160), // حداقل عرض 160
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {/* گزینه اول */}
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress('assignHand')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>واگذاری این دست</Text>
                </TouchableOpacity>

                {/* خط جداکننده */}
                <View style={styles.separator} />

                {/* گزینه دوم */}
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress('assignGame')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>واگذاری کل بازی</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: '100%',
    backgroundColor: 'rgba(42, 68, 254, 1.00)',
    paddingVertical: 10,
    borderRadius: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kaghaz',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: 'Kaghaz',
    color: '#333',
    textAlign: 'right',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
});

export default More;