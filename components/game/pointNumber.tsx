import * as Localization from 'expo-localization';
import React, { useEffect, useState } from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";


const PointNumber = ({ pointIds }) => {
    const [isRTL, setIsRTL] = useState(false);

    const checkRTL = () => {
      try {
        // روش اول: از Localization
        const locales = Localization.getLocales();
        const isRTLSystem = locales[0]?.textDirection === 'rtl';
  
        // روش دوم: از I18nManager (برای پشتیبانی از نسخه‌های قدیمی)
        const isRTLManager = I18nManager.isRTL;
  
        // ترکیب هر دو روش
        const finalRTL = isRTLSystem || isRTLManager;
  
        setIsRTL(finalRTL);
  
      } catch (error) {
        console.error('Error checking RTL:', error);
        // Fallback به I18nManager
        setIsRTL(I18nManager.isRTL);
      }
    };
  
  
    useEffect(() => {
      checkRTL();
  
    }, []);


    return (
        <View style={[styles.container, {flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {
                pointIds.map((pointId) => (
                    <View key={pointId} style={styles.textContainer}><Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Kaghaz' }}>{pointId}</Text></View>
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '5%',
        display: 'flex',
        backgroundColor: 'rgba(7, 0, 36, 1.00)',
    },
    textContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PointNumber;