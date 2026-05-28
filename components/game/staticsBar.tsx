import { boardService } from "@/services/boardService";
import useGameStore from "@/stores/useGameStore";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StaticsBar = () => {
  const board = useGameStore(state => state.board);
  const handlePointPress = useGameStore(state => state.handlePointPress);
  const blackCaptured = board[0];
  const whiteCaptured = board[25];

  return (
    <View style={styles.staticsBar}>
      <View style={styles.statics}>
        <Text style={styles.pointsRemained}>{boardService.pipCount(board,'black')}</Text>
        {whiteCaptured > 0 &&
          <TouchableOpacity
            style={[styles.checkersOut, styles.white]}
            onPress={() => handlePointPress(25)}
            activeOpacity={0.7}
          >
            {whiteCaptured > 1 && <Text>{Math.abs(whiteCaptured)}</Text>}
          </TouchableOpacity>
        }
      </View>

      {/* <View style={styles.doubleDiceContainer}>
        <View style={styles.doubleDice}>
          <Text style={styles.doubleDiceText}>64</Text>
        </View>
      </View> */}

      <View style={styles.statics}>
        <Text style={styles.pointsRemained}>{boardService.pipCount(board,'white')}</Text>
        {blackCaptured < 0 &&
          <TouchableOpacity
            style={styles.checkersOut}
            onPress={() => handlePointPress(0)}
            activeOpacity={0.7}
          >
            {blackCaptured < -1 && <Text>{Math.abs(blackCaptured)}</Text>}
          </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  staticsBar: {
    width: '6%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  doubleDiceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  doubleDice: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: '#2a44fe',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleDiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statics: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pointsRemained: {
    color: 'white',
    marginBottom: 5,
    fontSize: 12,
  },
  checkersOut: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: '#2e2bac',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  white: {
    backgroundColor: 'white',
  },
});

export default StaticsBar;