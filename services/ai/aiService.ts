import { LEVEL_CONFIG } from '@/constants/aiWeights';
import { ALL_DICE_COMBINATIONS_WITH_WEIGHT } from '@/constants/tables';
import { getAvailableMoves } from '@/utils/availableMoves';
import { calculateAverageDistance, calculateDiceUtilization, countRemainingCheckers, detectBearOffType, getBlotHitProbability, isBearOffPhase, simulateMove } from '@/utils/computerAI';
import { boardService } from '../boardService';
import { featureExtractor } from './featureExtractor';
import { scoreCalculator } from './scoreCalculator';
import { strategyEngine } from './strategyEngine';

export const aiService = {
    executeBestMove(board, dice, sequences, currentTurn, whiteBornOff, blackBornOff, difficulty = '3') {
        const strategyInfo = strategyEngine.determineStrategy(board, currentTurn);

        const bestMove = this.selectBestMove(board, dice, sequences, currentTurn, difficulty, strategyInfo);

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
            turnComplete,
            strategyInfo
        };
    },

    // =================== تابع یکپارچه انتخاب بهترین حرکت ===================
    selectBestMove(
        board,
        dice,
        moves,
        currentTurn,
        difficulty = '5',
        strategyInfo = null,
        customWeights = null  // پارامتر جدید
    ) {
        const config = LEVEL_CONFIG[difficulty] || LEVEL_CONFIG['3'];
        const depth = config.depth;
        const difficultyLevel = config.difficulty || '5';

        if (!strategyInfo) {
            strategyInfo = strategyEngine.determineStrategy(board, currentTurn);
        }
        const { strategy, phase } = strategyInfo;

        let bestScore = -Infinity;
        let bestMove = null;

        const isSecureBearOff = detectBearOffType(board, currentTurn) === 'secure_bearoff';
        const isBearOff = isBearOffPhase(board, currentTurn);

        moves.forEach((move) => {
            let score = -Infinity;

            if (depth === 0 || isSecureBearOff || isBearOff) {
                score = this.evaluateMoveWithoutDepth(
                    board, move, currentTurn,
                    difficultyLevel,
                    strategy,
                    phase,
                    false,
                    customWeights  // ارسال به تابع
                );
            } else if (depth >= 1) {
                score = this.evaluateMoveWithDepth(
                    board, move, currentTurn,
                    difficultyLevel,
                    phase,
                    strategy,
                    customWeights  // ارسال به تابع
                );
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        });

        return bestMove;
    },

    // =================== ارزیابی حرکت با عمق (Minimax یک لایه) ===================
    evaluateMoveWithDepth(
        board,
        moveSequence,
        currentTurn,
        difficulty,
        phase,
        strategy = 'neutral',
        customWeights = null  // پارامتر جدید
    ) {
        const { newBoard: boardAfterMe } = simulateMove(board, moveSequence, currentTurn);
        const opponent = currentTurn === 'white' ? 'black' : 'white';
        let totalWeightedScore = 0;
        let totalWeight = 0;

        ALL_DICE_COMBINATIONS_WITH_WEIGHT.forEach(({ dice: opponentDice, weight }) => {
            const opponentMoves = getAvailableMoves(boardAfterMe, opponentDice, opponent);
            let worstScoreForUs = Infinity;

            if (opponentMoves.length === 0) {
                const features = featureExtractor.extractFeatures(boardAfterMe, currentTurn);
                if (customWeights) {
                    worstScoreForUs = scoreCalculator.calculateRawScore(features, customWeights);
                } else {
                    worstScoreForUs = scoreCalculator.calculateScore(
                        features, strategy, phase, difficulty
                    );
                }
            } else {
                opponentMoves.forEach((opponentMove) => {
                    const { newBoard: boardAfterOpponent } = simulateMove(
                        boardAfterMe, opponentMove, opponent
                    );
                    const features = featureExtractor.extractFeatures(boardAfterOpponent, currentTurn);

                    let scoreForUs;
                    if (customWeights) {
                        scoreForUs = scoreCalculator.calculateRawScore(features, customWeights);
                    } else {
                        scoreForUs = scoreCalculator.calculateScore(
                            features, strategy, phase, difficulty
                        );
                    }

                    worstScoreForUs = Math.min(worstScoreForUs, scoreForUs);
                });
            }

            totalWeightedScore += worstScoreForUs * weight;
            totalWeight += weight;
        });

        return totalWeightedScore / totalWeight;
    },


    // =================== ارزیابی یک حرکت خاص ===================
    evaluateMoveWithoutDepth(
        board,
        moveSequence,
        color,
        difficulty,
        strategy = 'neutral',
        phase = null,
        showDetails = false,
        customWeights = null  // پارامتر جدید
    ) {
        const { newBoard } = simulateMove(board, moveSequence, color);
        const isBearOff = isBearOffPhase(board, color);

        if (isBearOff) {
            return this.evaluateBearOff(newBoard, color, difficulty);
        } else {
            const features = featureExtractor.extractFeatures(newBoard, color);
            features.metadata.phase = phase;

            let score;
            if (customWeights) {
                // اگر وزن سفارشی داشتیم، بدون نویز محاسبه کن
                score = scoreCalculator.calculateRawScore(features, customWeights);
            } else {
                // اگر نداشتیم، با نویز و استراتژی محاسبه کن
                score = scoreCalculator.calculateScore(
                    features, strategy, phase, difficulty, showDetails
                );
            }

            return score;
        }
    },

    evaluateBearOff(board, color, weights = null) {
        const bearOffType = detectBearOffType(board, color);
        const opponent = color === 'white' ? 'black' : 'white';

        // امتیاز پایه Bear Off
        const remainingCheckers = countRemainingCheckers(board, color);
        const bornOff = 15 - remainingCheckers;
        const diceUtil = calculateDiceUtilization(board, color);
        const avgDist = calculateAverageDistance(board, color);

        let score = (bornOff * 100) + (diceUtil * 2) - (avgDist * 5);

        // اگر Bear Off ناامن باشد، باید فاکتورهای امنیتی را در نظر بگیریم
        if (bearOffType === 'unsecure_bearoff') {
            // ۱. محاسبه ریسک بلات‌های خودی
            let blotsInHome = 0;
            let totalBlotRisk = 0;
            const homeStart = color === 'white' ? 1 : 19;  // شروع خانه خودی
            const homeEnd = color === 'white' ? 6 : 24;     // پایان خانه خودی

            for (let i = homeStart; i <= homeEnd; i++) {
                const count = board[i];
                if ((color === 'white' && count === 1) || (color === 'black' && count === -1)) {
                    blotsInHome++;
                    totalBlotRisk += getBlotHitProbability(board, i, color);
                }
            }


            score -= totalBlotRisk * 1000;

        }

        return score;
    },
};