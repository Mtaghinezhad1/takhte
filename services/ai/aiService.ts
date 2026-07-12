import { AI_LEVELS_MULTIPLIER, LEVEL_CONFIG, STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';
import { ALL_DICE_COMBINATIONS_WITH_WEIGHT } from '@/constants/tables';
import { getAvailableMoves } from '@/utils/availableMoves';
import { calculateAverageDistance, calculateDiceUtilization, calculateStackingPenalty, checkerValueByPosition, countBlots, countPrimes, countRemainingCheckers, detectBearOffType, getBlotHitProbability, getClosedPointsValue, getHitValue, isBearOffPhase, simulateMove } from '@/utils/computerAI';
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
    selectBestMove(board, dice, moves, currentTurn, difficulty = '5', strategyInfo = null) {
        // دریافت تنظیمات سطح
        const config = LEVEL_CONFIG[difficulty] || LEVEL_CONFIG['3'];
        const depth = config.depth;
        const difficultyLevel = config.difficulty || '5'; // سطح دشواری برای ضریب‌ها

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
                // ارسال difficultyLevel به تابع ارزیابی
                score = this.evaluateMoveWithoutDepth(
                    board, move, currentTurn,
                    difficultyLevel, // <-- اضافه شد
                    strategy, phase
                );
            } else if (depth >= 1) {
                score = this.evaluateMoveWithDepth(
                    board, move, currentTurn,
                    difficultyLevel, // <-- اضافه شد
                    phase, strategy
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
    evaluateMoveWithDepth(board, moveSequence, currentTurn, difficulty, phase, strategy = 'neutral') {
        const { newBoard: boardAfterMe } = simulateMove(board, moveSequence, currentTurn);
        const opponent = currentTurn === 'white' ? 'black' : 'white';
        let totalWeightedScore = 0;
        let totalWeight = 0;

        ALL_DICE_COMBINATIONS_WITH_WEIGHT.forEach(({ dice: opponentDice, weight }) => {
            const opponentMoves = getAvailableMoves(boardAfterMe, opponentDice, opponent);
            let worstScoreForUs = Infinity;

            if (opponentMoves.length === 0) {
                const features = featureExtractor.extractFeatures(boardAfterMe, currentTurn);
                // ارسال difficulty به scoreCalculator
                worstScoreForUs = scoreCalculator.calculateScore(
                    features, strategy, phase, difficulty
                );
            } else {
                opponentMoves.forEach((opponentMove) => {
                    const { newBoard: boardAfterOpponent } = simulateMove(
                        boardAfterMe, opponentMove, opponent
                    );
                    const features = featureExtractor.extractFeatures(boardAfterOpponent, currentTurn);
                    // ارسال difficulty به scoreCalculator
                    const scoreForUs = scoreCalculator.calculateScore(
                        features, strategy, phase, difficulty
                    );
                    worstScoreForUs = Math.min(worstScoreForUs, scoreForUs);
                });
            }

            totalWeightedScore += worstScoreForUs * weight;
            totalWeight += weight;
        });

        return totalWeightedScore / totalWeight;
    },

    // =================== ارزیابی یک حرکت خاص ===================
    evaluateMoveWithoutDepth(board, moveSequence, color, difficulty, strategy = 'neutral', phase = null) {
        const { newBoard } = simulateMove(board, moveSequence, color);
        const isBearOff = isBearOffPhase(board, color);

        if (isBearOff) {
            return this.evaluateBearOff(newBoard, color, difficulty);
        } else {
            const features = featureExtractor.extractFeatures(newBoard, color);
            features.metadata.phase = phase;

            // ارسال difficulty به scoreCalculator
            let score = scoreCalculator.calculateScore(
                features, strategy, phase, difficulty
            );

            // اضافه کردن امتیاز ضربات
            if (strategy === 'BLITZ' || strategy === 'HOLDING') {
                let totalHitValue = 0;
                for (const step of moveSequence) {
                    const { to } = step;
                    const hasOpponent = (color === 'white' && board[to] == -1) ||
                        (color === 'black' && board[to] == 1);
                    if (hasOpponent) {
                        totalHitValue += getHitValue(to, color);
                    }
                }
                const weights = scoreCalculator.getBaseWeights(strategy, phase);
                const hitWeight = weights?.hits || 0;
                // اعمال ضریب دشواری روی ضربه
                const multiplier = AI_LEVELS_MULTIPLIER[difficulty];
                const adjustedHitWeight = hitWeight * (multiplier?.hits || 1);
                score += totalHitValue * adjustedHitWeight;
            }

            return score;
        }
    },

    // =================== تابع ارزیابی نهایی یک وضعیت ===================
    evaluateBoard(board, color, phaseWeights, phase, strategy = 'neutral') {
        const opponent = color === 'black' ? 'white' : 'black';
        const myPip = boardService.pipCount(board, color);
        const oppPip = boardService.pipCount(board, opponent);
        const pipDiff = (oppPip - myPip);

        const myBlots = countBlots(board, color);
        const oppBlots = countBlots(board, opponent);

        const myClosedValue = getClosedPointsValue(board, color);
        const oppClosedValue = getClosedPointsValue(board, opponent);
        const closedPointValueDiff = myClosedValue - oppClosedValue;

        const myPrimes = countPrimes(board, color);
        const oppPrimes = countPrimes(board, opponent);

        // محاسبه ریسک (میانگین احتمال ضربه خوردن بلات‌های خودی)
        let riskSum = 0;
        for (let i = 1; i <= 24; i++) {
            const count = board[i];
            if ((color === 'white' && count === 1) || (color === 'black' && count === -1)) {
                riskSum += getBlotHitProbability(board, i, color) * checkerValueByPosition(i, color);
            }
        }
        const averageRisk = riskSum / (myBlots || 1);  // اگر بلات نداشته باشیم، ریسک صفر

        // ✨ تنظیم وزن‌ها بر اساس استراتژی
        const adjustedWeights = this.adjustWeightsForStrategy(
            phaseWeights, strategy, phase, board, color
        );

        // ترکیب خطی
        let score = 0;
        let pipCountPoint = adjustedWeights.pipCount * pipDiff;
        let blotPoint = adjustedWeights.blots * (oppBlots - myBlots);
        let closedPoint = adjustedWeights.closedPoints * closedPointValueDiff;
        let riskPoint = adjustedWeights.risk * averageRisk;
        let primePoint = adjustedWeights.primes * (myPrimes - oppPrimes);
        let stackingPenalty = calculateStackingPenalty(board, color);


        score += pipCountPoint;
        score += blotPoint;
        score += closedPoint;
        score += riskPoint;
        score += primePoint;
        score += stackingPenalty;

        return { score, pipCountPoint, blotPoint, closedPoint, riskPoint, primePoint, stackingPenalty };
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

    adjustWeightsForStrategy(baseWeights, strategy, phase) {
        // ✨ اگر استراتژی در STRATEGY_PHASE_WEIGHTS وجود داشته باشد، از آن استفاده می‌کنیم
        if (STRATEGY_PHASE_WEIGHTS[strategy] && STRATEGY_PHASE_WEIGHTS[strategy][phase]) {
            const strategicWeights = STRATEGY_PHASE_WEIGHTS[strategy][phase];

            // وزن‌های استراتژیک را با وزن‌های پایه ترکیب می‌کنیم
            const adjusted = { ...baseWeights };

            // برای هر کلید در وزن‌های استراتژیک، مقدار را تنظیم می‌کنیم
            for (const key in strategicWeights) {
                if (adjusted.hasOwnProperty(key)) {
                    // ترکیب: 60% وزن استراتژیک + 40% وزن پایه (برای حفظ تعادل)
                    adjusted[key] = (strategicWeights[key] * 0.6) + (adjusted[key] * 0.4);
                } else {
                    adjusted[key] = strategicWeights[key];
                }
            }

            return adjusted;
        }

        // اگر استراتژی پیدا نشد، از روش قبلی استفاده می‌کنیم
        const adjusted = { ...baseWeights };

        switch (strategy) {
            case 'blitz':
                adjusted.blots = (baseWeights.blots || 0) * 1.5;
                adjusted.closedPoints = (baseWeights.closedPoints || 0) * 1.3;
                adjusted.risk = (baseWeights.risk || 0) * 0.7;
                break;
            case 'prime':
                adjusted.primes = (baseWeights.primes || 0) * 1.5;
                adjusted.risk = (baseWeights.risk || 0) * 1.3;
                adjusted.pipCount = (baseWeights.pipCount || 0) * 0.8;
                break;
            case 'neutral':
            default:
                break;
        }

        return adjusted;
    },

    hasAdvancedAnchor(board, color) {
        if (color === 'white') {
            return (board[20] >= 2 || board[21] >= 2);
        } else {
            return (board[4] <= -2 || board[5] <= -2);
        }
    },

    countOpponentBlotsInHome(board, currentTurn) {
        let count = 0;
        const homeStart = currentTurn === 'white' ? 19 : 1;
        const homeEnd = currentTurn === 'white' ? 24 : 6;
        for (let i = homeStart; i <= homeEnd; i++) {
            if ((currentTurn === 'white' && board[i] === -1) ||
                (currentTurn === 'black' && board[i] === 1)) {
                count++;
            }
        }
        return count;
    },

    calculatePrimeLength(board, color) {
        let maxPrime = 0;
        let currentPrime = 0;
        for (let i = 1; i <= 24; i++) {
            const isMyPoint = (color === 'white' && board[i] >= 2) ||
                (color === 'black' && board[i] <= -2);
            if (isMyPoint) {
                currentPrime++;
                maxPrime = Math.max(maxPrime, currentPrime);
            } else {
                currentPrime = 0;
            }
        }
        return maxPrime;
    },

    countClosedPoints(board, color) {
        let closedPoints = 0;
        for (let i = 1; i <= 24; i++) {
            if ((color === 'white' && board[i] >= 2) ||
                (color === 'black' && board[i] <= -2)) {
                closedPoints++;
            }
        }
        return closedPoints;
    },

    calculateTiming(board, currentTurn, myPips, oppPips) {
        const remainingMoves = Math.ceil(myPips / 8);
        const opponentRemaining = Math.ceil(oppPips / 8);
        if (remainingMoves < opponentRemaining - 5) return 'CRITICAL';
        if (remainingMoves < opponentRemaining) return 'AHEAD';
        return 'BEHIND';
    },


};