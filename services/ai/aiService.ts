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

        const myMove = [
            { from: 24, to: 20, die: 4 },
            { from: 13, to: 11, die: 2 }
        ];
        // console.log('estMove')
        // this.evaluateMoveWithoutDepth(
        //     board, bestMove, currentTurn,
        //     difficultyLevel, // <-- اضافه شد
        //     strategy, phase, true
        // );

        // console.log('myMove')
        // this.evaluateMoveWithoutDepth(
        //     board, myMove, currentTurn,
        //     difficultyLevel, // <-- اضافه شد
        //     strategy, phase, true
        // );
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
    evaluateMoveWithoutDepth(board, moveSequence, color, difficulty, strategy = 'neutral', phase = null, showDetails= false) {
        const { newBoard } = simulateMove(board, moveSequence, color);
        const isBearOff = isBearOffPhase(board, color);

        if (isBearOff) {
            return this.evaluateBearOff(newBoard, color, difficulty);
        } else {
            const features = featureExtractor.extractFeatures(newBoard, color);
            features.metadata.phase = phase;

            // ارسال difficulty به scoreCalculator
            let score = scoreCalculator.calculateScore(
                features, strategy, phase, difficulty, showDetails
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

    calculateTiming(board, currentTurn, myPips, oppPips) {
        const remainingMoves = Math.ceil(myPips / 8);
        const opponentRemaining = Math.ceil(oppPips / 8);
        if (remainingMoves < opponentRemaining - 5) return 'CRITICAL';
        if (remainingMoves < opponentRemaining) return 'AHEAD';
        return 'BEHIND';
    },













    /**
 * دیباگ و مقایسه دو حرکت با نمایش جزئیات امتیازات
 */
debugCompareMoves(board, dice, sequences, currentTurn, difficulty = '5', myMove) {
    const strategyInfo = strategyEngine.determineStrategy(board, currentTurn);
    const { strategy, phase } = strategyInfo;
    
    // 1. پیدا کردن بهترین حرکت کامپیوتر
    const computerMove = this.selectBestMove(board, dice, sequences, currentTurn, difficulty, strategyInfo);
    
    // 2. ارزیابی هر دو حرکت
    const computerScore = this.evaluateMoveWithDetails(board, computerMove, currentTurn, difficulty, strategy, phase);
    const myScore = this.evaluateMoveWithDetails(board, myMove, currentTurn, difficulty, strategy, phase);
    
    // 3. نمایش جزئیات
    console.log('═══════════════════════════════════════════');
    console.log('🔍 مقایسه حرکت‌ها');
    console.log('─────────────────────────────────────────');
    console.log(`📊 استراتژی: ${strategy} | فاز: ${phase} | سطح: ${difficulty}`);
    console.log('─────────────────────────────────────────');
    
    // نمایش حرکت کامپیوتر
    console.log('🤖 حرکت کامپیوتر:');
    computerMove.forEach((move, i) => {
        console.log(`   ${i+1}. از ${move.from} → ${move.to || 'بیرون'} (تاس: ${move.die})`);
    });
    console.log(`   امتیاز نهایی: ${computerScore.totalScore.toFixed(2)}`);
    console.log(`   ─── جزئیات ───`);
    this.printScoreDetails(computerScore.details);
    
    console.log('─────────────────────────────────────────');
    
    // نمایش حرکت کاربر
    console.log('👤 حرکت شما:');
    myMove.forEach((move, i) => {
        console.log(`   ${i+1}. از ${move.from} → ${move.to || 'بیرون'} (تاس: ${move.die})`);
    });
    console.log(`   امتیاز نهایی: ${myScore.totalScore.toFixed(2)}`);
    console.log(`   ─── جزئیات ───`);
    this.printScoreDetails(myScore.details);
    
    console.log('─────────────────────────────────────────');
    const diff = myScore.totalScore - computerScore.totalScore;
    console.log(`📈 تفاوت امتیاز: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}`);
    console.log(`🏆 ${diff > 0 ? '✅ حرکت شما بهتر است' : diff < 0 ? '❌ حرکت کامپیوتر بهتر است' : '⚖️ مساوی'}`);
    console.log('═══════════════════════════════════════════');
    
    return {
        computer: { move: computerMove, score: computerScore },
        my: { move: myMove, score: myScore },
        strategyInfo
    };
},

/**
 * ارزیابی حرکت با جزئیات کامل
 */
evaluateMoveWithDetails(board, moveSequence, color, difficulty, strategy, phase) {
    const { newBoard } = simulateMove(board, moveSequence, color);
    const features = featureExtractor.extractFeatures(newBoard, color);
    features.metadata.phase = phase;
    
    // دریافت وزن‌ها
    const baseWeights = scoreCalculator.getBaseWeights(strategy, phase) || {};
    const weights = scoreCalculator.applyDifficultyMultiplier(baseWeights, difficulty);
    
    // محاسبه هر جزء به صورت جداگانه
    const details = this.calculateScoreComponents(features, weights);
    
    // محاسبه امتیاز نهایی
    const totalScore = scoreCalculator.calculateRawScore(features, weights);
    const noise = scoreCalculator.getNoiseLevel(difficulty);
    const finalScore = totalScore * (1 + (Math.random() - 0.5) * noise);
    
    return {
        totalScore: finalScore,
        rawScore: totalScore,
        details,
        features,
        weights
    };
},

/**
 * محاسبه اجزای امتیاز به صورت جداگانه
 */
calculateScoreComponents(features, weights) {
    const details = {};
    
    // محاسبه هر جزء
    const pipDiff = features.pipCount?.pipDiff || 0;
    const blotDiff = features.blot?.blotDiff || 0;
    const closedDiff = features.closedPoints?.closedDiff || 0;
    const risk = features.blot?.totalRisk || 0;
    const primeDiff = features.prime?.primeDiff || 0;
    const hits = features.attack?.totalHitValue || 0;
    const stacking = features.structure?.stackingPenalty || 0;
    
    details.pipCount = {
        value: pipDiff,
        weight: weights.pipCount || 0,
        contribution: pipDiff * (weights.pipCount || 0)
    };
    
    details.blots = {
        value: blotDiff,
        weight: weights.blots || 0,
        contribution: blotDiff * (weights.blots || 0)
    };
    
    details.closedPoints = {
        value: closedDiff,
        weight: weights.closedPoints || 0,
        contribution: closedDiff * (weights.closedPoints || 0)
    };
    
    details.risk = {
        value: risk,
        weight: weights.risk || 0,
        contribution: risk * (weights.risk || 0)
    };
    
    details.primes = {
        value: primeDiff,
        weight: weights.primes || 0,
        contribution: primeDiff * (weights.primes || 0)
    };
    
    details.hits = {
        value: hits,
        weight: weights.hits || 0,
        contribution: hits * (weights.hits || 0)
    };
    
    details.stackingPenalty = {
        value: stacking,
        weight: weights.stackingPenalty || 0,
        contribution: stacking * (weights.stackingPenalty || 0)
    };
    
    // ویژگی‌های اضافی
    if (weights.homeBoardStrength) {
        const myClosed = features.closedPoints?.myClosedCount || 0;
        details.homeBoardStrength = {
            value: myClosed,
            weight: weights.homeBoardStrength,
            contribution: myClosed * weights.homeBoardStrength
        };
    }
    
    if (weights.opponentOnBar) {
        const oppOnBar = features.attack?.opponentOnBar || 0;
        details.opponentOnBar = {
            value: oppOnBar,
            weight: weights.opponentOnBar,
            contribution: oppOnBar * weights.opponentOnBar
        };
    }
    
    if (weights.anchorStrength) {
        const anchors = features.defense?.anchors?.length || 0;
        details.anchorStrength = {
            value: anchors,
            weight: weights.anchorStrength,
            contribution: anchors * weights.anchorStrength
        };
    }
    
    if (weights.bearoffEfficiency) {
        const diceUtil = features.bearoff?.diceUtilization || 0;
        const avgDist = features.bearoff?.averageDistance || 0;
        details.bearoffEfficiency = {
            value: diceUtil - avgDist * 0.1,
            weight: weights.bearoffEfficiency,
            contribution: (diceUtil - avgDist * 0.1) * weights.bearoffEfficiency
        };
    }
    
    if (weights.flexibility) {
        const flex = features.structure?.flexibility || 0;
        details.flexibility = {
            value: flex,
            weight: weights.flexibility,
            contribution: flex * weights.flexibility
        };
    }
    
    if (weights.timingValue) {
        const timing = features.metadata?.timing || 0;
        details.timingValue = {
            value: timing,
            weight: weights.timingValue,
            contribution: timing * weights.timingValue
        };
    }
    
    if (weights.safety) {
        const myBlots = features.blot?.myBlots || 0;
        details.safety = {
            value: -myBlots * 0.5,
            weight: weights.safety,
            contribution: -myBlots * 0.5 * weights.safety
        };
    }
    
    if (weights.diceUtilization) {
        const diceUtil = features.bearoff?.diceUtilization || 0;
        details.diceUtilization = {
            value: diceUtil,
            weight: weights.diceUtilization,
            contribution: diceUtil * weights.diceUtilization
        };
    }
    
    // اضافه کردن مجموع
    details.total = 0;
    for (const key in details) {
        if (details[key]?.contribution !== undefined) {
            details.total += details[key].contribution;
        }
    }
    
    return details;
},

/**
 * چاپ جزئیات امتیازات
 */
printScoreDetails(details) {
    const keys = [
        'pipCount', 'blots', 'closedPoints', 'risk', 'primes', 'hits', 'stackingPenalty',
        'homeBoardStrength', 'opponentOnBar', 'anchorStrength', 'bearoffEfficiency',
        'flexibility', 'timingValue', 'safety', 'diceUtilization'
    ];
    
    let maxLen = 0;
    const labels = {
        pipCount: 'پیپ کانت',
        blots: 'بلات‌ها',
        closedPoints: 'نقاط بسته',
        risk: 'ریسک',
        primes: 'پرایم‌ها',
        hits: 'ضربات',
        stackingPenalty: 'جریمه ازدحام',
        homeBoardStrength: 'قدرت تخته خانه',
        opponentOnBar: 'حریف روی Bar',
        anchorStrength: 'قدرت لنگر',
        bearoffEfficiency: 'کارایی بیرون‌آوردن',
        flexibility: 'انعطاف‌پذیری',
        timingValue: 'تایمینگ',
        safety: 'ایمنی',
        diceUtilization: 'استفاده از تاس'
    };
    
    const persianKeys = [];
    for (const key of keys) {
        if (details[key] && details[key].contribution !== undefined) {
            const label = labels[key] || key;
            persianKeys.push({ key, label });
            maxLen = Math.max(maxLen, label.length);
        }
    }
    
    for (const { key, label } of persianKeys) {
        const d = details[key];
        const sign = d.contribution >= 0 ? '+' : '';
        console.log(`   ${label.padEnd(maxLen + 2)}: ${d.value.toFixed(2)} × ${d.weight.toFixed(2)} = ${sign}${d.contribution.toFixed(2)}`);
    }
    
    console.log(`   ${'─'.repeat(maxLen + 25)}`);
    console.log(`   ${'مجموع'.padEnd(maxLen + 2)}: ${details.total.toFixed(2)}`);
},


};