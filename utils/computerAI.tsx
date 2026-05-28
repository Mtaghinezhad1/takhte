const AI_LEVELS = {
    '1': {
        pipCount: 10,
        blots: 10,
        hits: 0,
        closedPoints: 10,
        risk: -20,        // جریمه برای بلات‌های در معرض خطر
    },
    2: {
        pipCount: 1,
        blots: 10,
        hits: 5,
        closedPoints: 10,
        risk: -3,
    },
    3: {
        pipCount: 0,
        blots: 10,
        hits: 1,
        closedPoints: 10,
        risk: -5,
    },
    4: {
        pipCount: 0,
        blots: 0,
        hits: 0,
        closedPoints: 0,
        risk: -8,
    }
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
    const direction = opponent === 'white' ? 1 : -1;
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
    const newBoard = [...board];
    let hitsInMove = 0;
    for (const step of moveSequence) {
        const { from, to, die } = step;

        if (newBoard[from] > 0) {
            newBoard[from] -= 1;
        } else if (newBoard[from] < 0) {
            newBoard[from] += 1;
        }

        const opponent = color === 'black' ? 'white' : 'black';
        if (newBoard[to] &&
            ((opponent === 'black' && newBoard[to] === -1) ||
                (opponent === 'white' && newBoard[to] === 1))) {
            hitsInMove++;
        }

        if (to > 0 && to < 25) {
            const targetValue = newBoard[to];
            if (targetValue > 0) {
                newBoard[25] += 1;
                newBoard[to] = -1;
            } else if (targetValue < 0) {
                newBoard[to] -= 1;
            } else {
                newBoard[to] = -1;
            }
        }
    }

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

    moves.forEach((move) => {
        const evaluation = evaluateMove(board, dice, move, currentTurn, weights);
        if (evaluation.finalScore > bestScore) {
            bestScore = evaluation.finalScore;
            bestMove = move;
        }
    });

    return bestMove;
}
