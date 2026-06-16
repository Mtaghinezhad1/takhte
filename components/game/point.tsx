import useGameStore from "@/stores/useGameStore";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Checker from "./checker";

const Point = ({ value, pointId }) => {
  const handlePointPress = useGameStore(state => state.handlePointPress);
  const justify = (pointId < 13) ? true : false;
  const count = Math.abs(value);
  const isWhite = value > 0;

  return (
    <TouchableOpacity
      style={[styles.point, justify ? styles.flexEnd : styles.flexStart]}
      onPress={() => handlePointPress(pointId)}
      activeOpacity={0.7}
    >
      {Array.from({ length: count > 5 ? 5 : count }).map((_, index) => (
        <Checker key={index} isWhite={isWhite}>
          {count > 5 && index == 4 && `${count}`}
        </Checker>
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
  flexEnd: {
    justifyContent: 'flex-end',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },

});

export default Point;