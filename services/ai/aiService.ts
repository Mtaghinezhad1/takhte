import { AI_LEVELS, LEVEL_CONFIG } from '@/constants/aiWeights';
import { ALL_DICE_COMBINATIONS_WITH_WEIGHT } from '@/constants/tables';
import { getAvailableMoves } from '@/utils/availableMoves';
import { calculateAverageDistance, calculateDiceUtilization, calculateStackingPenalty, checkerValueByPosition, countBlots, countPrimes, countRemainingCheckers, detectBearOffType, detectGamePhase, getBlotHitProbability, getClosedPointsValue, getHitValue, isBearOffPhase, simulateMove } from '@/utils/computerAI';
import { makeMove } from '@/utils/utils';
import { boardService } from '../boardService';

export const aiService = {
    executeBestMove(board, dice, sequences, currentTurn, whiteBornOff, blackBornOff, difficulty = '3') {
        const bestMove = this.selectBestMove(board, dice, sequences, currentTurn, difficulty);

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
    },

    // =================== تابع یکپارچه انتخاب بهترین حرکت ===================
    selectBestMove(board, dice, moves, currentTurn, difficulty = '3') {
        // دریافت تنظیمات سطح
        const config = LEVEL_CONFIG[difficulty] || LEVEL_CONFIG['3'];
        const depth = config.depth;
        const weights = config.weights;

        let bestScore = -Infinity;
        let bestMove = null;

        // تشخیص فاز بازی و نوع Bear Off
        const isSecureBearOff = detectBearOffType(board, currentTurn) === 'secure_bearoff';
        const phase = detectGamePhase(board, currentTurn);
        const isBearOff = isBearOffPhase(board, currentTurn);


        moves.forEach((move) => {
            let score = -Infinity;

            // اگر عمق ۰ باشد یا در Bear Off امن باشیم، فقط حرکت خود را ارزیابی می‌کنیم
            if (depth === 0 || isSecureBearOff || isBearOff) {
                score = this.evaluateMoveWithoutDepth(board, move, currentTurn, weights).finalScore;
            } else if (depth >= 1) {
                score = this.evaluateMoveWithDepth(board, move, currentTurn, weights, phase);
            }

            // انتخاب بهترین حرکت
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        });

        return bestMove;
    },

    // =================== ارزیابی حرکت با عمق (Minimax یک لایه) ===================
    evaluateMoveWithDepth(board, moveSequence, currentTurn, weights, phase) {
        // ۱. شبیه‌سازی حرکت خودمان
        const { newBoard: boardAfterMe } = simulateMove(board, moveSequence, currentTurn);

        // ۲. همه حالات ممکن تاس برای حریف را بررسی می‌کنیم
        const opponent = currentTurn === 'white' ? 'black' : 'white';
        let totalWeightedScore = 0;
        let totalWeight = 0;

        ALL_DICE_COMBINATIONS_WITH_WEIGHT.forEach(({ dice: opponentDice, weight }) => {
            // دریافت حرکات ممکن حریف با این تاس‌ها
            const opponentMoves = getAvailableMoves(boardAfterMe, opponentDice, opponent);

            let worstScoreForUs = Infinity;

            if (opponentMoves.length === 0) {
                // اگر حریف حرکتی نداشت، وضعیت فعلی را ارزیابی می‌کنیم
                const phaseWeights = weights[phase] || weights['middlegame'];
                const evaluation = this.evaluateBoard(boardAfterMe, currentTurn, phaseWeights);
                worstScoreForUs = evaluation.score;
            } else {
                // بهترین حرکت حریف (بدترین برای ما) را پیدا می‌کنیم
                opponentMoves.forEach((opponentMove) => {
                    const { newBoard: boardAfterOpponent } = simulateMove(boardAfterMe, opponentMove, opponent);
                    const phaseWeights = weights[phase] || weights['middlegame'];
                    const evaluation = this.evaluateBoard(boardAfterOpponent, currentTurn, phaseWeights);
                    const scoreForUs = evaluation.score;

                    if (scoreForUs < worstScoreForUs) {
                        worstScoreForUs = scoreForUs;
                    }
                });
            }

            // اضافه کردن امتیاز وزنی
            totalWeightedScore += worstScoreForUs * weight;
            totalWeight += weight;
        });

        return totalWeightedScore / totalWeight;
    },

    // =================== ارزیابی یک حرکت خاص ===================
    evaluateMoveWithoutDepth(board, moveSequence, color, weights = AI_LEVELS[3]) {
        // کپی از تخته و مقادیر اولیه bornOff (در ارزیابی تأثیری ندارند، اما برای makeMove لازمند)
        let newBoard = [...board];
        let whiteBornOff = 0;
        let blackBornOff = 0;

        // تشخیص فاز بازی
        const phase = detectGamePhase(board, color);

        // استخراج وزن‌های فاز مربوطه
        const phaseWeights = weights && weights[phase] ? weights[phase] : AI_LEVELS['3'][phase];

        const isBearOff = isBearOffPhase(board, color);

        // متغیر برای جمع ارزش ضربات
        let totalHitValue = 0;

        // اعمال تک‌تک گام‌های حرکت با استفاده از makeMove
        for (const step of moveSequence) {
            const { from, to, die } = step;
            // قبل از حرکت، بررسی می‌کنیم که آیا در مقصد مهره حریف وجود دارد
            const hasOpponentChecker = (color === 'white' && newBoard[to] == -1) || (color === 'black' && newBoard[to] == 1);
            if (hasOpponentChecker) {
                // ارزش ضربه را محاسبه و اضافه می‌کنیم
                totalHitValue += getHitValue(to, color);
            }

            // فراخوانی makeMove؛ prevBoard را null می‌دهیم (چون برای انیمیشن نیست)
            const result = makeMove(newBoard, from, die, color, null, whiteBornOff, blackBornOff);
            // به‌روزرسانی وضعیت پس از هر حرکت
            newBoard = result.newBoard;
            whiteBornOff = result.whiteBornOff;
            blackBornOff = result.blackBornOff;
        }

        if (isBearOff) {
            const finalScore = this.evaluateBearOff(newBoard, color, weights = null);
            return { finalScore }
        } else {
            // ارزیابی وضعیت نهایی تخته (بدون در نظر گرفتن bornOffها)
            const { score, pipCountPoint, blotPoint, closedPoint, riskPoint, primePoint, stackingPenalty } = this.evaluateBoard(newBoard, color, phaseWeights);
            const baseScore = score;
            // استفاده از ارزش وزنی ضربات
            const hitScore = phaseWeights.hits * totalHitValue;
            const finalScore = baseScore + hitScore;

            return { finalScore, pipCountPoint, blotPoint, closedPoint, riskPoint, primePoint, stackingPenalty };
        }


    },

    // =================== تابع ارزیابی نهایی یک وضعیت ===================
    evaluateBoard(board, color, phaseWeights) {
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

        // ترکیب خطی
        let score = 0;
        let pipCountPoint = phaseWeights.pipCount * pipDiff;
        let blotPoint = phaseWeights.blots * (oppBlots - myBlots);
        let closedPoint = phaseWeights.closedPoints * closedPointValueDiff;
        let riskPoint = phaseWeights.risk * averageRisk;   // weights.risk منفی است
        let primePoint = phaseWeights.primes * (myPrimes - oppPrimes);
        let stackingPenalty = calculateStackingPenalty(board, color); // مستقیماً اضافه می‌شود چون خودش وزن‌دهی شده


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
    }


};