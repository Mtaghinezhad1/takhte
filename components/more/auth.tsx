import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const Auth = () => {
    const isShort = screenHeight < 700;

    const handleLogin = () => {
        console.log('Login pressed');
    };

    const handleRegister = () => {
        console.log('Register pressed');
    };

    return (
        <View style={styles.authSection}>
            {/* Login Card */}
            <View style={[styles.authCard, styles.loginCard]}>
                <Text style={styles.authIcon}>⇥</Text>
                <View style={styles.authTextContainer}>
                    <Text style={styles.authTitle}>ورود به حساب</Text>
                    <Text style={styles.authDescription}>قبلاً ثبت‌نام کرده‌اید؟</Text>
                </View>
                <TouchableOpacity
                    style={[styles.authButton, styles.loginButton]}
                    onPress={handleLogin}
                    activeOpacity={0.7}
                >
                    <Text style={styles.authButtonText}>ورود</Text>
                </TouchableOpacity>
            </View>

            {/* Register Card */}
            <View style={[styles.authCard, styles.registerCard]}>
                <Text style={styles.authIcon}>♙+</Text>
                <View style={styles.authTextContainer}>
                    <Text style={styles.authTitle}>ثبت‌نام</Text>
                    <Text style={styles.authDescription}>بازیکن جدید هستید؟</Text>
                </View>
                <TouchableOpacity
                    style={[styles.authButton, styles.registerButton]}
                    onPress={handleRegister}
                    activeOpacity={0.7}
                >
                    <Text style={styles.authButtonText}>ایجاد حساب</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    authSection: {
        flexDirection: 'row',
        gap: 10,
        minHeight: 200,
        marginBottom: 16,
    },
    authCard: {
        flex: 1,
        borderRadius: 18,
        padding: 12,
        justifyContent: 'space-between',
        borderWidth: 1,
        overflow: 'hidden',
    },
    loginCard: {
        borderColor: 'rgba(69, 133, 230, 0.3)',
        backgroundColor: 'rgba(17, 58, 119, 0.9)',
    },
    registerCard: {
        borderColor: 'rgba(61, 206, 142, 0.3)',
        backgroundColor: 'rgba(10, 77, 67, 0.9)',
    },
    authIcon: {
        fontSize: 21,
        color: '#438dff', // will be overridden for register
    },
    // Override for register icon color using separate style
    // Since we can't style child by parent easily, we set in component
    authTextContainer: {
        marginVertical: 4,
    },
    authTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'right',
    },
    authDescription: {
        color: '#7995bb',
        fontSize: 8,
        textAlign: 'right',
    },
    authButton: {
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 9,
        borderWidth: 1,
    },
    loginButton: {
        borderColor: 'rgba(72, 142, 255, 0.5)',
        backgroundColor: 'rgba(39, 112, 235, 0.2)',
    },
    registerButton: {
        borderColor: 'rgba(74, 213, 147, 0.45)',
        backgroundColor: 'rgba(40, 170, 113, 0.15)',
    },
    authButtonText: {
        color: '#b9d5ff',
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Since we need different icon colors, we'll set them inline in component.
});

export default Auth;