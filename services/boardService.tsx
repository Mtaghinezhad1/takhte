import { InitialBoard_fun, InitialBoard_standard } from "@/constants/constants";
import { getAvailableMoves, removeDuplicateSequences } from "@/utils/availableMoves";
import { isValidMove, makeMove } from "@/utils/utils";

export const boardService = {
    isValidMove(board, pointId, die, currentTurn) {
        return isValidMove(board, pointId, die, currentTurn);
    },

    makeMove(board, pointId, die, currentTurn, prevBoard, whiteBornOff, blackBornOff) {
        return makeMove(board, pointId, die, currentTurn, prevBoard, whiteBornOff, blackBornOff);
    },

    getAvailableMoves(board, dice, currentTurn) {
        const b = [-1, 2, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, -5, 5, 0, 0, 0, -2, 0, -5, 0, -3, 2, 0, 3, 1];
        const d = [1, 3];
        const c = 'black';
        //console.log('manual move',getAvailableMoves(b, d, c));

        const moves = getAvailableMoves(board, dice, currentTurn);
        return removeDuplicateSequences(moves);
    },

    getInitialBoard() {
        return InitialBoard_standard;
    },

    getInitialBoardByGameMode(gameMode) {
        switch (gameMode) {
            case 'standard':
                return InitialBoard_standard;
            case 'fun':
                return InitialBoard_fun;
            case 'aiVsAi':
                return InitialBoard_standard;
            case 'twoPlayer':
                return InitialBoard_standard;
            default:
                return InitialBoard_standard;
        }
    },

    // محاسبه تعداد پیپ برای یک رنگ (فاصله تا خانه)
    pipCount(board, color) {
        let total = 0;
        for (let i = 1; i <= 24; i++) {
            const count = board[i];
            if ((color === 'black' && count < 0) || (color === 'white' && count > 0)) {
                const pipIndex = color === 'black' ? (25 - i) : (i); // فاصله از خانه
                total += Math.abs(count) * pipIndex;
            }
        }
        if ((color == 'black' && board[0] != 0)) {
            total += Math.abs(board[0]) * 25;
        }
        if ((color == 'white' && board[25] != 0)) {
            total += Math.abs(board[25]) * 25;
        }
        return total;
    },

    hasAnyMove(board, dice, currentTurn) {
        let moves = 0;
        dice.forEach(dieValue => {
            if (currentTurn == "white") {
                for (let i = 0; i <= 25; i++) {
                    if (board[i] > 0 && isValidMove(board, i, dieValue, currentTurn)) {
                        moves = moves + 1;
                        //add logic for moves available after this move
                        //also add logic for double dice
                    }
                }
            } else {
                for (let i = 0; i <= 25; i++) {
                    if (board[i] < 0 && isValidMove(board, i, dieValue, currentTurn)) {
                        moves = moves + 1;
                        //add logic for moves available after this move
                        //also add logic for double dice
                    }
                }
            }
        });
        if (moves != 0) {
            return true;
        } else {
            return false;
        }
    }
}