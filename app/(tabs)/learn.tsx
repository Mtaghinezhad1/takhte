import { learnData } from '@/constants/learnData';
import { learnService } from '@/services/learnService';
import useLearningStore from '@/stores/useLearningStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView, StyleSheet, Text,
    TouchableOpacity, useWindowDimensions, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LearnScreen = () => {
    const completedLessons = useLearningStore(state => state.completedLessons);
    const initializeFromStorage = useLearningStore(state => state.initialize);

    const [activeTab, setActiveTab] = useState('beginner');
    const { width, height } = useWindowDimensions();

    const buttons = [
        { key: 'beginner', label: 'مبتدی' },
        { key: 'intermediate', label: 'متوسط' },
        { key: 'advanced', label: 'پیشرفته' },
    ];

    useEffect(() => {
        initializeFromStorage();
    }, []);

    // محاسبه درصد پیشرفت
    const getLocalProgress = (categoryKey, subcategoryKey) => {
        const allLessons = learnService.getLessonsCount(categoryKey, subcategoryKey);
        const completed = Object.keys(completedLessons)
            .filter(key => key.startsWith(`${categoryKey}-${subcategoryKey}`))
            .length;

        return allLessons > 0 ? (completed / allLessons) * 100 : 0;
    };

    // محاسبه فونت واکنش‌گرا
    const getFontSize = () => {
        if (width < 400) return 18;
        if (width < 600) return 22;
        return 27;
    };

    // محاسبه padding واکنش‌گرا
    const getPadding = () => {
        if (width < 400) return 12;
        if (width < 600) return 16;
        return 16;
    };




    return (
        <LinearGradient
            colors={['#102b63', '#061636', '#02091c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
                <View style={styles.levelsContainer}>
                    {buttons.map((level) => {
                        const isActive = activeTab === level.key;
                        return (
                            <TouchableOpacity
                                key={level.key}
                                style={styles.levelWrapper}
                                onPress={() => setActiveTab(level.key)}
                                activeOpacity={0.7}
                            >
                                {isActive ? (
                                    <LinearGradient
                                        colors={['#226eff', '#1244a7']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[styles.level, styles.activeLevel]}
                                    >
                                        <Text style={[styles.levelText, styles.activeText]}>
                                            {level.label}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.level, styles.inactiveLevel]}>
                                        <Text style={styles.levelText}>{level.label}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Subcategories Container */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.itemContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {learnData
                        .find(cat => cat.key === activeTab)
                        ?.subcategories.map((subcat) => {
                            const progress = getLocalProgress(activeTab, subcat.key);
                            return (
                                <TouchableOpacity
                                    key={subcat.key}
                                    style={styles.item}
                                    onPress={() => {
                                        if (progress === 0) {
                                            router.push(`/learn/${activeTab}/${subcat.key}/1`);
                                        } else {
                                            router.push(`/learn/${activeTab}/${subcat.key}`);
                                        }
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#6495ed' || '#4c669f', '#3b5998', '#192f6a']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.gradient}
                                    >
                                        {/* Progress Bar */}
                                        <View style={styles.loader}>
                                            <View
                                                style={[
                                                    styles.progress,
                                                    { height: `${progress}%` },
                                                ]}
                                            />
                                        </View>
                                        
                                        <View style={styles.textSection}>
                                            <Text style={[styles.text, { fontSize: getFontSize() }]}>
                                                {subcat.title}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    itemContainer: {
        width: '100%',
        marginTop: 32,
        paddingBottom: 20,
    },
    item: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 16,
        marginTop: 10,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingRight: 32,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    loader: {
        width: 8,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    progress: {
        backgroundColor: '#9EB323',
        width: '100%',
    },
    textSection: {
        flex: 1,
    },
    text: {
        textAlign: 'right',
        fontSize: 24,
        color: 'white',
        fontWeight: '900',
    },

    levelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    levelWrapper: {
        width: '31%', // approx 1/3 minus gap
        aspectRatio: undefined,
        height: 62,
        marginBottom: 12, // for spacing if wrap
    },
    level: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        borderWidth: 1,
    },
    inactiveLevel: {
        backgroundColor: 'rgba(7, 28, 62, 0.65)',
        borderColor: 'rgba(62, 119, 213, 0.15)',
    },
    activeLevel: {
        borderColor: '#3989ff',
        shadowColor: '#1a6aff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 22,
        elevation: 8,
    },
    levelText: {
        fontFamily: 'Vazirmatn', // You need to load this font; fallback to system
        fontWeight: '700',
        fontSize: 17,
        color: '#8296ba',
        textAlign: 'center',
    },
    activeText: {
        color: '#ffffff',
    },
});

export default LearnScreen;