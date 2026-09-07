import useThemeStore from '@/stores/useThemeStore';
import {
    Dimensions,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const MenuItem = ({ icon, title, subtitle, onPress = null, showToggle = false }) => {
    const { isDark, toggleTheme, getColors } = useThemeStore();
    const isShort = screenHeight < 700;


    return (
        <TouchableOpacity
            style={[styles.menuItem, isShort && styles.menuItemShort]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={showToggle} // disable press for toggle item, handled by switch
        >
            {showToggle ? (
                <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#3a5a7a', true: '#4b94ff' }}
                    thumbColor={isDark ? '#ffffff' : '#f4f4f4'}
                    ios_backgroundColor="#3a5a7a"
                    style={styles.switch}
                />
            ) : (
                <Text style={styles.arrow}>‹</Text>
            )}
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{icon}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    menuItemShort: {
        height: 43,
    },
    menuIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(34, 103, 205, 0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIconText: {
        fontSize: 17,
        color: '#4b94ff',
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'right',
    },
    menuSubtitle: {
        fontSize: 8,
        color: '#718db5',
        marginTop: 3,
        textAlign: 'right',
    },
    arrow: {
        color: '#7695be',
        fontSize: 18,
        textAlign: 'center',
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
});

export default MenuItem;