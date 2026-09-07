import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1rem ≈ 16px (converted from your CSS)
const rem = 16;

const LessonCard = ({ title, onPress, numberOfLessons }) => {


    return (
        <TouchableOpacity style={styles.lessonCard} onPress={onPress}>

            <View style={styles.blurDecoration} />

            {/* Progress Bar */}
            <View style={styles.loader}>
                <View
                    style={[
                        styles.progress,
                        { height: `${20}%` },
                    ]}
                />
            </View>

            {/* Content column */}
            <View style={styles.lessonContent}>
                <View style={styles.lessonTop}>
                    <Text style={styles.lessonTitle}>{title}</Text>
                </View>

                {/* Meta */}
                <View style={styles.lessonMeta}>
                    <View style={styles.meta}>
                        <Text style={styles.metaIcon}>▢</Text>
                        <Text style={styles.metaText}>{numberOfLessons} درس</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>


    );
};

const styles = StyleSheet.create({
    lessonCard: {
        position: 'relative',
        padding: 22,
        flexDirection: 'row',
        marginBottom: 16,
        gap: 18, // works on newer RN, fallback: use margin/padding
        borderRadius: 25,
        backgroundColor: 'rgba(14, 45, 94, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(61, 132, 255, 0.25)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 8,
        overflow: 'hidden',
    },
    blurDecoration: {
        position: 'absolute',
        width: 220,
        height: 220,
        left: -80,
        bottom: -100,
        backgroundColor: 'rgba(26, 104, 255, 0.16)',
        borderRadius: 110,
        // Blur is not available natively, so we simulate with a large semi-transparent circle
        // For real blur, use expo-blur or react-native-blur
    },
    lessonContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    lessonTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#f4f7ff',
        lineHeight: 34, // 1.7 * 20
        textAlign: 'right',
        flex: 1,
    },
    lessonMeta: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        justifyContent: 'flex-start',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 9,
        borderRadius: 14,
        backgroundColor: 'rgba(3, 19, 45, 0.65)',
        borderWidth: 1,
        borderColor: 'rgba(47, 112, 218, 0.25)',
        gap: 5,
    },
    metaIcon: {
        color: '#3987ff',
        fontSize: 14,
    },
    metaText: {
        color: '#b4c8e8',
        fontSize: 11,
        fontWeight: '400',
        textAlign: 'right',
    },
    loader: {
        width: 8,
        height: 'auto',
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    progress: {
        backgroundColor: '#9EB323',
        width: '100%',
    },
});

export default LessonCard;