import useUserStore from '@/stores/useUserStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';


const SelectAvatar = () => {
    const { username, elo, coins, avatar } = useUserStore();
    const [activeIndex, setActiveIndex] = useState(3); // Fourth image is active initially

    // Sample data for images - replace with your actual image sources
    const images = [
        require('@/assets/avatar/1 (1).jpeg'), // Replace with your actual image paths
        require('@/assets/avatar/1 (2).jpeg'),
        require('@/assets/avatar/1 (3).jpeg'),
        require('@/assets/avatar/1 (4).jpeg'),
        require('@/assets/avatar/1 (5).jpeg'),
        require('@/assets/avatar/1 (6).jpeg'),
        require('@/assets/avatar/1 (7).jpeg'),
        require('@/assets/avatar/1 (8).jpeg'),
        require('@/assets/avatar/1 (9).jpeg'),
        require('@/assets/avatar/1 (10).jpeg'),
    ];

    const handleImagePress = (index) => {
        setActiveIndex(index);
    };

    const handleConfirm = () => {
        // Handle confirm action
        console.log('Confirm pressed');
    };

    return (
        <View style={styles.body}>
            {/* Profile Section */}
            <View style={styles.profileSection}>

                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Image style={styles.avatarImg} source={images[activeIndex]} />
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.imgSection}>
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.imgContainer,
                                activeIndex === index && styles.active,
                            ]}
                            onPress={() => handleImagePress(index)}
                            activeOpacity={0.8}
                        >
                            <Image source={image} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.btn, styles.cancel]}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelText}>انصراف</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.confirm]}
                        onPress={handleConfirm}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.confirmText}>تایید</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        padding: 16,
        width: '90%',
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    imgSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imgContainer: {
        borderRadius: 999,
        overflow: 'hidden',
        width: '30%',
        aspectRatio: 1,
        borderWidth: 0,
        marginBottom: 16, // Replaces gap for vertical spacing
    },
    active: {
        borderWidth: 8,
        borderColor: 'orange',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: '100%',
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
        borderColor: 'orange',
        marginRight: 8, // Replaces gap between buttons
    },
    cancelText: {
        color: 'orange',
        fontSize: 20,
        fontFamily: 'Kaghaz',
    },
    confirm: {
        backgroundColor: 'orange',
        borderWidth: 3,
        borderColor: 'orange',
        marginLeft: 8, // Replaces gap between buttons
    },
    confirmText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Kaghaz',
    },
    profileSection: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    avatar: {
        width: '35%',
        aspectRatio: 1,
        backgroundColor: 'grey',
        borderRadius: '50%',
        borderWidth: 0,
        marginVertical: 10,
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
});

export default SelectAvatar;