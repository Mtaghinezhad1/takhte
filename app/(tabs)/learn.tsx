import { learnData } from '@/constants/learnData';
import { learnService } from '@/services/learnService';
import useLearningStore from '@/stores/useLearningStore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView, StyleSheet, Text,
    TouchableOpacity, useWindowDimensions, View
} from 'react-native';

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
        <View style={styles.container}>
            {/* Button Container */}
            <View style={[styles.btnContainer, { paddingHorizontal: width * 0.08 }]}>
                {buttons.map((btn) => (
                    <TouchableOpacity
                        key={btn.key}
                        style={[
                            styles.btn,
                            activeTab === btn.key && styles.activeBtn,
                            { padding: getPadding() },
                        ]}
                        onPress={() => setActiveTab(btn.key)}
                    >
                        <Text
                            style={[
                                styles.btnText,
                                activeTab === btn.key && styles.activeBtnText,
                                { fontSize: getFontSize() },
                            ]}
                        >
                            {btn.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Subcategories Container */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.itemContainer}
                showsVerticalScrollIndicator={false}
            >
                {learnData
                    .find(cat => cat.key === activeTab)
                    ?.subcategories.map((subcat) => (
                        <TouchableOpacity
                            key={subcat.key}
                            style={styles.item}
                            onPress={() => router.push(`/learn/${activeTab}/${subcat.key}`)}
                        >
                            {/* Progress Bar */}
                            <View style={styles.loader}>
                                <View
                                    style={[
                                        styles.progress,
                                        { height: `${getLocalProgress(activeTab, subcat.key)}%` },
                                    ]}
                                />
                            </View>
                            <View style={styles.textSection}>
                                <Text style={[styles.text, { fontSize: getFontSize() }]}>
                                    {subcat.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    btnContainer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 25,
        marginBottom: 16,
    },
    btn: {
        flex: 1,
        backgroundColor: '#dee4e0',
        borderWidth: 0,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeBtn: {
        backgroundColor: '#070024',
    },
    btnText: {
        color: '#000',
        fontFamily: 'Kaghaz',
    },
    activeBtnText: {
        color: '#fff',
    },
    itemContainer: {
        width: '100%',
        marginTop: 32,
        paddingBottom: 20,
    },
    item: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingRight: 32,
        backgroundColor: '#dee4e0',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
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
        backgroundColor: 'green',
        width: '100%',
    },
    textSection: {
        flex: 1,
    },
    text: {
        textAlign: 'right',
        fontSize: 24,
        fontFamily: 'Kaghaz',
    },
});

export default LearnScreen;