import useGameStore from "@/stores/useGameStore";
import React from "react";


import Point from "./point";

const QuarterBoard = ({ pointIds }) => {
  const board = useGameStore(state => state.board);


  return pointIds.map((pointId) => (
    <Point
      key={pointId}
      pointId={pointId}
      value={board[pointId]}
    />
  ));
};

export default QuarterBoard;