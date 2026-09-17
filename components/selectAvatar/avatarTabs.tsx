import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const AvatarTabs = ({ activeTab, setActiveTab }) => {
    return (
        <View style={styles.tabs}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                onPress={() => setActiveTab('all')}
                activeOpacity={0.8}
            >
                <Text
                    style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}
                >
                    همه آواتارها 👤
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'premium' && styles.tabActive]}
                onPress={() => setActiveTab('premium')}
                activeOpacity={0.8}
            >
                <Text
                    style={[styles.tabText, activeTab === 'premium' && styles.tabTextActive]}
                >
                    ویژه 👑
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        backgroundColor: 'rgba(9, 29, 58, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(65, 130, 220, 0.2)',
        borderRadius: 18,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 13,
        paddingHorizontal: 8,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabActive: {
        backgroundColor: '#216cf4',
        shadowColor: '#1969ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 6,
    },
    tabText: {
        color: '#8195b7',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabTextActive: {
        color: '#ffffff',
    },
});

export default AvatarTabs;