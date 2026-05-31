import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PointNumber = ({ pointIds }) => {


    return (
        <View style={styles.container}>
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
        flexDirection: 'row',
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