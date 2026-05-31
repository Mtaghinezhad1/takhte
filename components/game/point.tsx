import useGameStore from "@/stores/useGameStore";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Point = ({ value, pointId }) => {
  const handlePointPress = useGameStore(state => state.handlePointPress);
  const justify = (pointId < 13) ? true : false;
  const count = Math.abs(value);
  const isWhite = value > 0;

  return (
    <TouchableOpacity
      style={[styles.point, justify ? styles.flexEnd : styles.flexStart ]}
      onPress={() => handlePointPress(pointId)}
      activeOpacity={0.7}
    >
      {Array.from({ length: count > 5 ? 5 : count }).map((_, index) => (
        <View
          key={index}
          style={[styles.checker, isWhite && styles.white]}
        >
          <Text style={{fontFamily: 'Kaghaz',}}>
              {count > 5 && index == 4 && `${count}`}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  point: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  flexEnd : {
    justifyContent: 'flex-end',
  },
  flexStart : {
    justifyContent: 'flex-start',
  },
  checker: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: '#2e2bac',
    marginVertical: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    backgroundColor: 'white',
  },
});

export default Point;