import { selectBestMove } from '@/utils/computerAI';
import { boardService } from './boardService';

export const aiService = {
    executeBestMove(board, dice, sequences, currentTurn, whiteBornOff, blackBornOff, difficulty = '3') {
        const bestMove = selectBestMove(board, dice, sequences, currentTurn, difficulty);

        let currentBoard = [...board];
        let currentDice = [...dice];
        let currentWhiteBornOff = whiteBornOff;
        let currentBlackBornOff = blackBornOff;



        // Execute moves in sequence
        for (const move of bestMove) {
            const result = boardService.makeMove(
                currentBoard, move.from, move.die, currentTurn,
                currentBoard, currentWhiteBornOff, currentBlackBornOff
            );

            currentBoard = result.newBoard;
            currentWhiteBornOff = result.newWhiteBornOff;
            currentBlackBornOff = result.newBlackBornOff;

            const dieIndex = currentDice.indexOf(move.die);
            if (dieIndex !== -1) {
                currentDice.splice(dieIndex, 1);
            }
        }

        const turnComplete = currentDice.length === 0 ||
            !boardService.hasAnyMove(currentBoard, currentDice, currentTurn);

        return {
            board: currentBoard,
            remainingDice: currentDice,
            whiteBornOff: currentWhiteBornOff,
            blackBornOff: currentBlackBornOff,
            turnComplete
        };
    }
};