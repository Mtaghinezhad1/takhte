import { CLOSED_POINT_VALUES, DISTANCE_PROB } from "@/constants/tables";
import { isInHomeBoard, makeMove } from "./utils";

const AI_LEVELS = {
    '1': {  // افسانه‌ای
        opening: {
            pipCount: 0.3,
            blots: 14,
            hits: 8,
            closedPoints: 20,
            risk: -40,
            primes: 0,
        },
        middlegame: {
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
            primes: 0,
        },
        endgame: {
            pipCount: 0.8,
            blots: 10,
            hits: 5,
            closedPoints: 15,
            risk: -30,
            primes: 0,
        }
    },
    '2': {  // خبره
        opening: {
            pipCount: 0.7,
            blots: 8,
            hits: 4,
            closedPoints: 10,
            risk: -22,
            primes: 0,
        },
        middlegame: {
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        },
        endgame: {
            pipCount: 1.4,
            blots: 7,
            hits: 3,
            closedPoints: 9,
            risk: -18,
            primes: 0,
        }
    },
    '3': {  // استاد
        opening: {
            pipCount: 0.5,
            blots: 10,
            hits: 6,
            closedPoints: 14,
            risk: -28,
            primes: 0,
        },
        middlegame: {
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
            primes: 0,
        },
        endgame: {
            pipCount: 1.2,
            blots: 8,
            hits: 4,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        }
    },
    '4': {  // ضعیف‌ترین - فقط به فکر کم کردن پیپ
        opening: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        },
        middlegame: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        },
        endgame: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        }
    },
    '5': {  // کمی توجه به امنیت
        opening: {
            pipCount: 3.5,
            blots: 0.4,
            hits: 0.2,
            closedPoints: 0.4,
            risk: -0.4,
            primes: 0,
        },
        middlegame: {
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
            primes: 0,
        },
        endgame: {
            pipCount: 4.5,
            blots: 0.3,
            hits: 0.2,
            closedPoints: 0.3,
            risk: -0.3,
            primes: 0,
        }
    },
    '6': {  // نیمه‌حرفه‌ای
        opening: {
            pipCount: 1.2,
            blots: 4,
            hits: 2.5,
            closedPoints: 4,
            risk: -10,
            primes: 0,
        },
        middlegame: {
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
            primes: 0,
        },
        endgame: {
            pipCount: 2.0,
            blots: 3.5,
            hits: 2,
            closedPoints: 3.5,
            risk: -8,
            primes: 0,
        }
    },
    '7': {  // حرفه‌ای
        opening: {
            pipCount: 0.9,
            blots: 6,
            hits: 3.5,
            closedPoints: 7,
            risk: -16,
            primes: 0,
        },
        middlegame: {
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
            primes: 0,
        },
        endgame: {
            pipCount: 1.6,
            blots: 5.5,
            hits: 3,
            closedPoints: 6.5,
            risk: -14,
            primes: 0,
        }
    },
    '8': {  // مبتدی
        opening: {
            pipCount: 2.5,
            blots: 0.8,
            hits: 0.4,
            closedPoints: 0.8,
            risk: -1.5,
            primes: 0,
        },
        middlegame: {
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
            primes: 0,
        },
        endgame: {
            pipCount: 3.5,
            blots: 0.7,
            hits: 0.3,
            closedPoints: 0.7,
            risk: -1.2,
            primes: 0,
        }
    },
    '9': {  // آماتور - توجه بیشتر به امنیت
        opening: {
            pipCount: 2.0,
            blots: 1.5,
            hits: 0.8,
            closedPoints: 1.5,
            risk: -4,
            primes: 0,
        },
        middlegame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
            primes: 0,
        },
        endgame: {
            pipCount: 3.0,
            blots: 1.2,
            hits: 0.6,
            closedPoints: 1.2,
            risk: -3,
            primes: 0,
        }
    },
    '10': {  // متوسط
        opening: {
            pipCount: 1.5,
            blots: 1,
            hits: 1.5,
            closedPoints: 2.5,
            risk: -6,
            primes: 2,
        },
        middlegame: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        },
        endgame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1.2,
            closedPoints: 2,
            risk: -5,
            primes: 2,
        }
    },
    '11': {  // متوسط با پرایم ضعیف
        opening: {
            pipCount: 1.5,
            blots: 2.5,
            hits: 1.5,
            closedPoints: 2.5,
            risk: -6,
            primes: 1.5,
        },
        middlegame: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        },
        endgame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1.2,
            closedPoints: 2,
            risk: -5,
            primes: 1,
        }
    },
    '12': {  // متوسط با پرایم متوسط
        opening: {
            pipCount: 1.5,
            blots: 2.5,
            hits: 1.5,
            closedPoints: 2.5,
            risk: -6,
            primes: 3,
        },
        middlegame: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 4,
        },
        endgame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1.2,
            closedPoints: 2,
            risk: -5,
            primes: 2,
        }
    },
    '13': {  // متوسط با پرایم قوی
        opening: {
            pipCount: 1.5,
            blots: 2.5,
            hits: 1.5,
            closedPoints: 2.5,
            risk: -6,
            primes: 5,
        },
        middlegame: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 6,
        },
        endgame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1.2,
            closedPoints: 2,
            risk: -5,
            primes: 3,
        }
    },
    '14': {  // متوسط با پرایم خیلی قوی
        opening: {
            pipCount: 1.5,
            blots: 2.5,
            hits: 1.5,
            closedPoints: 2.5,
            risk: -6,
            primes: 7,
        },
        middlegame: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 8,
        },
        endgame: {
            pipCount: 2.5,
            blots: 2,
            hits: 1.2,
            closedPoints: 2,
            risk: -5,
            primes: 4,
        }
    },
}

// =================== توابع کمکی ===================

// محاسبه تعداد پیپ برای یک رنگ (فاصله تا خانه)
export const pipCount = (board, color) => {
    let total = 0;
    for (let i = 1; i <= 24; i++) {
        const count = board[i];
        if ((color === 'black' && count < 0) || (color === 'white' && count > 0)) {
            const pipIndex = color === 'black' ? (25 - i) : (i);
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
}

// شمارش بلات (مهره‌های تنها)
function countBlots(board, color) {
    let blots = 0;
    for (let i = 1; i <= 24; i++) {
        if ((color === 'black' && board[i] === -1) || (color === 'white' && board[i] === 1)) {
            blots++;
        }
    }
    return blots;
}

function countPrimes(board, color) {
    let maxConsecutive = 0;
    let currentStreak = 0;

    for (let i = 1; i <= 24; i++) {
        const count = board[i];
        const isMyPoint = (color === 'white' && count >= 2) ||
            (color === 'black' && count <= -2);

        if (isMyPoint) {
            currentStreak++;
            maxConsecutive = Math.max(maxConsecutive, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    // ارزش بیشتر برای پرایم‌های ۶ تایی
    return maxConsecutive >= 6 ? maxConsecutive * 2 : maxConsecutive;
}



/**
 * احتمال اینکه یک بلات توسط حریف ضربه بخورد (با در نظر گرفتن همه مهره‌های حریف)
 */
function getBlotHitProbability(board, blotPoint, color) {
    const opponent = color === 'white' ? 'black' : 'white';
    const direction = opponent === 'white' ? -1 : 1;
    let unionProb = 0;

    const barPoint = opponent === 'white' ? 25 : 0; // بار برای سفید در 25 و برای سیاه در 0
    const barCheckers = Math.abs(board[barPoint]);

    // calculate getting hit by bar checkers 
    if (barCheckers > 0) {
        // فاصله از بار تا بلات
        let distanceFromBar;
        if (opponent === 'white') {
            // سفید از بار (خانه 25) باید به سمت خانه‌های پایین حرکت کند
            distanceFromBar = 25 - blotPoint;
        } else {
            // سیاه از بار (خانه 0) باید به سمت خانه‌های بالا حرکت کند
            distanceFromBar = blotPoint;
        }

        // اگر فاصله معتبر باشد (1 تا 6)
        if (distanceFromBar >= 1 && distanceFromBar <= 6) {
            // احتمال آوردن عدد مورد نظر با دو تاس: 11/36
            const barHitProb = 11 / 36;
            unionProb = unionProb + barHitProb - unionProb * barHitProb;
        }
    }

    // calculate getting hit by normal checkers 
    for (let point = 1; point <= 24; point++) {
        const checkers = board[point];
        const hasOpponentChecker =
            (opponent === 'white' && checkers > 0) ||
            (opponent === 'black' && checkers < 0);

        if (!hasOpponentChecker) continue;

        let distance;
        if (direction === 1) {
            distance = blotPoint - point;
        } else {
            distance = point - blotPoint;
        }

        if (distance <= 0 || distance > 12) continue;

        const p = DISTANCE_PROB[distance];
        unionProb = unionProb + p - unionProb * p;
    }

    return unionProb;
}

function getHitValue(to, color) {
    // ارزش نقاط مختلف را وزن‌دهی کنید
    const pointValue = color === 'white' ? to : (25 - to);
    return pointValue / 24; // نرمال‌سازی به 0-1
}

function checkerValueByPosition(point, color) {
    const pointValue = color === 'white' ? (25 - point) : point;
    return pointValue / 24; // نرمال‌سازی به 0-1
}

// =================== Bear Off ===================
function isBearOffPhase(board, color) {
    return isInHomeBoard(color, board);
}

function countRemainingCheckers(board, color) {
    let count = 0;
    if (color === 'white') {
        for (let i = 1; i <= 25; i++) {
            if (board[i] > 0) count += board[i];
        }
    } else {
        for (let i = 0; i <= 24; i++) {
            if (board[i] < 0) count += Math.abs(board[i]);
        }
    }
    return count;
}

function calculateAverageDistance(board, color) {
    let totalDistance = 0;
    let totalCheckers = 0;

    if (color === 'white') {
        for (let i = 1; i <= 24; i++) {
            if (board[i] > 0) {
                totalDistance += board[i] * i;
                totalCheckers += board[i];
            }
        }
    } else {
        for (let i = 1; i <= 24; i++) {
            if (board[i] < 0) {
                const distance = 25 - i;
                totalDistance += Math.abs(board[i]) * distance;
                totalCheckers += Math.abs(board[i]);
            }
        }
    }

    return totalCheckers > 0 ? totalDistance / totalCheckers : 0;
}

function calculateDiceUtilization(board, color) {
    let score = 0;

    for (let die = 1; die <= 6; die++) {
        const targetPoint = color === 'white' ? die : (25 - die);
        const count = board[targetPoint];
        const hasChecker = (color === 'white' && count > 0) || (color === 'black' && count < 0);

        if (hasChecker) {
            // می‌توانیم مستقیم خارج کنیم
            score += 1.0;
        } else {
            // بررسی می‌کنیم آیا از خانه بالاتر می‌توان حرکت داد
            let canMoveFromHigher = false;

            if (color === 'white') {
                for (let i = die + 1; i <= 24; i++) {
                    if (board[i] > 0) {
                        canMoveFromHigher = true;
                        break;
                    }
                }
            } else {
                for (let i = 25 - die - 1; i >= 1; i--) {
                    if (board[i] < 0) {
                        canMoveFromHigher = true;
                        break;
                    }
                }
            }

            if (canMoveFromHigher) {
                score += 0.7;
            }
            // else: score += 0 (تاس هدر می‌رود)
        }
    }

    return (score / 6) * 100;
}

function evaluateBearOff(board, color, weights = null) {
    const remainingCheckers = countRemainingCheckers(board, color);
    let score = 0;

    const bornOff = 15 - remainingCheckers;
    const diceUtil = calculateDiceUtilization(board, color);
    const avgDist = calculateAverageDistance(board, color);

    score = (bornOff * 100) + (diceUtil * 2) - (avgDist * 5);

    return score;
}

// ======================================================================
function detectGamePhase(board, color) {
    const myPips = pipCount(board, color);
    const opponent = color === 'white' ? 'black' : 'white';
    const oppPips = pipCount(board, opponent);

    // اگر در فاز بیرون بردن هستیم = آخر بازی
    if (isBearOffPhase(board, color)) {
        return 'endgame';
    }

    // اگر حریف در فاز بیرون بردن است = آخر بازی برای ما هم
    if (isBearOffPhase(board, opponent)) {
        return 'endgame';
    }

    // معیار پیپ کانت:
    // بالای ۱۲۰ = گشایش (هنوز مهره‌های زیادی در تخته حریف داریم)
    // زیر ۸۰ = آخر بازی
    // بین ۸۰ تا ۱۲۰ = میانه بازی

    const totalPips = myPips + oppPips;

    if (totalPips > 280) {  // هر دو بازیکن پیمایش بالایی دارند
        return 'opening';
    } else if (totalPips < 120) {  // بازی رو به پایان است
        return 'endgame';
    } else if (myPips < 80 || oppPips < 80) {
        return 'endgame';
    } else if (myPips > 140) {
        return 'opening';
    } else {
        return 'middlegame';
    }
}

function getClosedPointsValue(board, color) {
    // تشخیص فاز بازی
    const phase = detectGamePhase(board, color);
    const pointValues = CLOSED_POINT_VALUES[phase];

    let totalValue = 0;

    for (let i = 1; i <= 24; i++) {
        const count = board[i];

        // بررسی بسته بودن نقطه توسط ما
        const isMyClosedPoint =
            (color === 'white' && count >= 2) ||
            (color === 'black' && count <= -2);

        if (isMyClosedPoint) {
            // شماره نقطه از دید خودمان
            // سفید: خانه ۱ تا ۲۴ همان شماره واقعی
            // سیاه: خانه ۱ از دید سیاه = خانه ۲۴ واقعی
            const pointFromMyView = color === 'white' ? i : (25 - i);

            // اضافه کردن ارزش آن نقطه
            totalValue += pointValues[pointFromMyView] || 0;
        }
    }

    return totalValue;
}

// نسخه ساده و بهینه نهایی
function calculateStackingPenalty(board, color) {
    const phase = detectGamePhase(board, color);
    if (phase !== 'opening') return 0;

    let penalty = 0;

    for (let i = 1; i <= 24; i++) {
        const count = board[i];
        const absoluteCount = Math.abs(count);

        if (((color === 'white' && count > 5) || (color === 'black' && count < -5)) &&
            absoluteCount > 5) {

            const excess = absoluteCount - 5;
            penalty += Math.pow(excess, 1.7) * 12;
        }
    }

    return -penalty;
}

// =================== تابع ارزیابی نهایی یک وضعیت ===================
function evaluateBoard(board, color, phaseWeights) {
    const opponent = color === 'black' ? 'white' : 'black';
    const myPip = pipCount(board, color);
    const oppPip = pipCount(board, opponent);
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
}

// =================== ارزیابی یک حرکت خاص ===================
export const evaluateMove = (board, dice, moveSequence, color, weights = AI_LEVELS[3]) => {
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
        const finalScore = evaluateBearOff(newBoard, color, weights = null);
        return { finalScore }
    } else {
        // ارزیابی وضعیت نهایی تخته (بدون در نظر گرفتن bornOffها)
        const { score, pipCountPoint, blotPoint, closedPoint, riskPoint, primePoint, stackingPenalty } = evaluateBoard(newBoard, color, phaseWeights);
        const baseScore = score;
        // استفاده از ارزش وزنی ضربات
        const hitScore = phaseWeights.hits * totalHitValue;
        const finalScore = baseScore + hitScore;

        return { finalScore, pipCountPoint, blotPoint, closedPoint, riskPoint, primePoint, stackingPenalty };
    }


}

// انتخاب بهترین حرکت برای AI
export function selectBestMove(board, dice, moves, currentTurn, difficulty = '3') {
    const weights = AI_LEVELS[difficulty] || AI_LEVELS[3];
    let bestScore = -Infinity;
    let bestMove = null;

    moves.forEach((move) => {
        const evaluation = evaluateMove(board, dice, move, currentTurn, weights);
        if (evaluation.finalScore > bestScore) {
            bestScore = evaluation.finalScore;
            bestMove = move;
        }
    });
    const myMove = [
        {
            "from": 19,
            "to": 20,
            "die": 1,
            "type": "normal"
        },
        {
            "from": 19,
            "to": 20,
            "die": 1,
            "type": "normal"
        },
        {
            "from": 17,
            "to": 18,
            "die": 1,
            "type": "normal"
        },
        {
            "from": 17,
            "to": 18,
            "die": 1,
            "type": "normal"
        }
    ];
    console.log(detectGamePhase(board, currentTurn));
    console.log('my move', currentTurn, evaluateMove(board, dice, myMove, currentTurn, weights));
    console.log('best move', currentTurn, evaluateMove(board, dice, bestMove, currentTurn, weights));


    return bestMove;
}
