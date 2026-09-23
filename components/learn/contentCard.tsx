import { learnData } from '@/constants/learnData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';



const ContentCard = ({ categoryId, subcategoryId, pageId }) => {
    const category = learnData.find(c => c.key === categoryId);
    const subcategory = category?.subcategories.find(s => s.key === subcategoryId);
    const page = subcategory?.pages.find(p => p.id === Number(pageId));

    const heroComponent = page.components?.find(c => c.type === 'hero');
    const contentComponent = page.components?.find(c => c.type === 'content');
    const imageComponent = page.components?.find(c => c.type === 'image');




    return (
        <LinearGradient
            colors={['rgba(4, 42, 82, 0.86)', 'rgba(2, 25, 52, 0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Title */}
            <View style={styles.cardTitle}>
                <View style={styles.titleIcon}>
                    <Text style={styles.titleIconText}>{page?.id}</Text>
                </View>
                <Text style={styles.titleText}>{heroComponent.title}</Text>
            </View>

            {/* Body text */}
            <Text style={styles.text}>{contentComponent.value}</Text>

            {/* Board image wrapper */}
            <View style={styles.boardWrapper}>
                <Image
                    source={imageComponent.src}
                    style={styles.boardImage}
                    resizeMode="cover"
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(0, 127, 255, 0.42)',
        paddingVertical: 22,
        paddingHorizontal: 14,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 35,
        elevation: 8,
    },
    cardTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    titleIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: '#087cf1',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#007dff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 6,
    },
    titleIconText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 22,
    },
    titleText: {
        flex: 1,
        fontSize: 21,
        fontWeight: '900',
        color: '#f4f8ff',
        textAlign: 'right',
    },
    text: {
        color: '#d8e7fb',
        fontSize: 14,
        lineHeight: 30, // ~2.2
        textAlign: 'right',
        marginBottom: 18,
    },
    boardWrapper: {
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#0087ff',
        backgroundColor: '#021631',
        shadowColor: '#007eff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 6,
    },
    boardImage: {
        width: '100%',
        height: 220, // Adjust based on your Board.png aspect ratio
        backgroundColor: '#06295a',
    },
});

export default ContentCard;