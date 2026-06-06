import { makeMove } from "./utils";

const AI_LEVELS = {
    '1': {  // افسانه‌ای
        pipCount: 0.5,
        blots: 16,
        hits: 9,
        closedPoints: 22,
        risk: -45,
    },
    '2': {  // خبره
        pipCount: 1,
        blots: 10,
        hits: 5,
        closedPoints: 12,
        risk: -25,
    },
    '3': {  // استاد
        pipCount: 0.8,
        blots: 13,
        hits: 7,
        closedPoints: 16,
        risk: -32,
    },
    '4': {  // ضعیف‌ترین - فقط به فکر کم کردن پیپ
        pipCount: 5,
        blots: 0.1,
        hits: 0.1,
        closedPoints: 0.1,
        risk: 0,
    },
    '5': {  // کمی توجه به امنیت
        pipCount: 4,
        blots: 0.5,
        hits: 0.3,
        closedPoints: 0.5,
        risk: -0.5,
    },
    '6': {  // نیمه‌حرفه‌ای
        pipCount: 1.5,
        blots: 5,
        hits: 3,
        closedPoints: 5,
        risk: -12,
    },
    '7': {  // حرفه‌ای
        pipCount: 1.2,
        blots: 7,
        hits: 4,
        closedPoints: 8,
        risk: -18,
    },
    '8': {  // مبتدی
        pipCount: 3,
        blots: 1,
        hits: 0.5,
        closedPoints: 1,
        risk: -2,
    },
    '9': {  // آماتور - توجه بیشتر به امنیت
        pipCount: 2.5,
        blots: 2,
        hits: 1,
        closedPoints: 2,
        risk: -5,
    },
    '10': {  // متوسط
        pipCount: 2,
        blots: 3,
        hits: 2,
        closedPoints: 3,
        risk: -8,
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

// تعداد نقاط بسته (حداقل دو مهره از خودی)
function countClosedPoints(board, color) {
    let closed = 0;
    for (let i = 1; i <= 24; i++) {
        const count = board[i];
        if ((color === 'black' && count <= -2) || (color === 'white' && count >= 2)) {
            closed++;
        }
    }
    return closed;
}

// =================== جدول احتمالات ضربه ===================
const DISTANCE_PROB = {
    1: 11 / 36,
    2: 12 / 36,
    3: 13 / 36,
    4: 14 / 36,
    5: 15 / 36,
    6: 16 / 36,
    7: 6 / 36,
    8: 5 / 36,
    9: 4 / 36,
    10: 3 / 36,
    11: 2 / 36,
    12: 1 / 36,
};

/**
 * احتمال اینکه یک بلات توسط حریف ضربه بخورد (با در نظر گرفتن همه مهره‌های حریف)
 */
function getBlotHitProbability(board, blotPoint, color) {
    const opponent = color === 'white' ? 'black' : 'white';
    const direction = opponent === 'white' ? -1 : 1;
    let unionProb = 0;

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

// =================== تابع ارزیابی نهایی یک وضعیت ===================
function evaluateBoard(board, color, weights = AI_LEVELS[3]) {
    const opponent = color === 'black' ? 'white' : 'black';
    const myPip = pipCount(board, color);
    const oppPip = pipCount(board, opponent);
    const pipDiff = (oppPip - myPip);

    const myBlots = countBlots(board, color);
    const oppBlots = countBlots(board, opponent);

    const myClosed = countClosedPoints(board, color);
    const oppClosed = countClosedPoints(board, opponent);

    // محاسبه ریسک (میانگین احتمال ضربه خوردن بلات‌های خودی)
    let riskSum = 0;
    for (let i = 1; i <= 24; i++) {
        const count = board[i];
        if ((color === 'white' && count === 1) || (color === 'black' && count === -1)) {
            riskSum += getBlotHitProbability(board, i, color);
        }
    }
    const averageRisk = riskSum / (myBlots || 1);  // اگر بلات نداشته باشیم، ریسک صفر


    // ترکیب خطی
    let score = 0;
    let pipCountPoint = weights.pipCount * pipDiff;
    let blotPoint = weights.blots * (oppBlots - myBlots);
    let closedPoint = weights.closedPoints * (myClosed - oppClosed);
    let riskPoint = weights.risk * averageRisk;   // weights.risk منفی است


    score += pipCountPoint;
    score += blotPoint;
    score += closedPoint;
    score += riskPoint;

    return { score, pipCountPoint, blotPoint, closedPoint, riskPoint };
}

// =================== ارزیابی یک حرکت خاص ===================
export const evaluateMove = (board, dice, moveSequence, color, weights = AI_LEVELS[3]) => {
    // کپی از تخته و مقادیر اولیه bornOff (در ارزیابی تأثیری ندارند، اما برای makeMove لازمند)
    let newBoard = [...board];
    let whiteBornOff = 0;
    let blackBornOff = 0;

    // ذخیره مقدار اولیه بار حریف (برای محاسبه ضربات)
    let initialOppBar;
    if (color === 'white') {
        // حریف سیاه است → بار سیاه در board[0] (عدد منفی)
        initialOppBar = Math.abs(newBoard[0]); // تعداد مهره‌های سیاه در بار
    } else {
        // حریف سفید است → بار سفید در board[25] (عدد مثبت)
        initialOppBar = newBoard[25];
    }

    // اعمال تک‌تک گام‌های حرکت با استفاده از makeMove
    for (const step of moveSequence) {
        const { from, to, die } = step;
        // فراخوانی makeMove؛ prevBoard را null می‌دهیم (چون برای انیمیشن نیست)
        const result = makeMove(newBoard, from, die, color, null, whiteBornOff, blackBornOff);
        // به‌روزرسانی وضعیت پس از هر حرکت
        newBoard = result.newBoard;
        whiteBornOff = result.whiteBornOff;
        blackBornOff = result.blackBornOff;
    }

    // محاسبه مقدار نهایی بار حریف
    let finalOppBar;
    if (color === 'white') {
        finalOppBar = Math.abs(newBoard[0]);
    } else {
        finalOppBar = newBoard[25];
    }

    // تعداد ضربات = افزایش مهره‌های حریف در بار
    const hitsInMove = finalOppBar - initialOppBar; // همیشه نامنفی

    // ارزیابی وضعیت نهایی تخته (بدون در نظر گرفتن bornOffها)
    const { score, pipCountPoint, blotPoint, closedPoint, riskPoint } = evaluateBoard(newBoard, color, weights);
    const baseScore = score;
    const hitScore = weights.hits * hitsInMove;
    const finalScore = baseScore + hitScore;

    return { finalScore, pipCountPoint, blotPoint, closedPoint, riskPoint };
}

// انتخاب بهترین حرکت برای AI
export function selectBestMove(board, dice, moves, currentTurn, difficulty = '3') {
    const weights = AI_LEVELS[difficulty] || AI_LEVELS[3];
    let bestScore = -Infinity;
    let bestMove = null;

    console.log(' unique moves', currentTurn, moves);
    moves.forEach((move) => {
        const evaluation = evaluateMove(board, dice, move, currentTurn, weights);
        if (evaluation.finalScore > bestScore) {
            bestScore = evaluation.finalScore;
            bestMove = move;
        }
    });
    console.log('best move', currentTurn, bestMove);


    return bestMove;
}
