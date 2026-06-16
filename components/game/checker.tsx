import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const Checker = ({ isWhite, children }) => {


    return (
        <View style={[styles.checker, { width: '90%', }, isWhite && styles.white]}>
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.25)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.outsideCircle}
            >
                {/* <Text style={styles.text}>6</Text> */}

                <View style={[styles.checker, { width: '80%', }, isWhite && styles.white]}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.25)']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.insideCircle}
                    >
                        <Text style={styles.text}>
                            {children}
                        </Text>
                    </LinearGradient>
                </View>
            </LinearGradient>
        </View>

    );
};

const styles = StyleSheet.create({
    checker: {
        aspectRatio: 1,
        borderRadius: 50,
        backgroundColor: '#2e2bac',
        overflow: 'hidden',
    },
    outsideCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    insideCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    text: {
        fontFamily: 'Kaghaz',
    },
    white: {
        backgroundColor: 'white',
    },
});

export default Checker;