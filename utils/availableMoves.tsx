import { isValidMove } from "./utils";

export const getAvailableMoves = (board, dice, currentTurn) => {
    if (!dice || dice.length === 0) return [];

    // تولید تمام حرکات ترکیبی با بازگشت
    const allSequences = generateMoveSequences(board, dice, currentTurn);

    return allSequences;
};

const generateMoveSequences = (board, remainingDice, currentTurn, currentSequence = []) => {
    // اگر تاسی باقی نمانده، دنباله فعلی را برگردان
    if (remainingDice.length === 0) {
        return [currentSequence];
    }

    const allSequences = [];
    const usedDiceValues = new Set(); // برای جلوگیری از حرکت تکراری با تاس‌های هم‌مقدار

    // برای هر تاس باقی‌مانده
    for (let i = 0; i < remainingDice.length; i++) {
        const dieValue = remainingDice[i];

        // اگر این مقدار تاس قبلاً استفاده شده، رد کن (برای تاس‌های جفت)
        if (usedDiceValues.has(dieValue)) continue;
        usedDiceValues.add(dieValue);

        // حرکات ممکن با این تاس
        const possibleMoves = getSingleDieMoves(board, dieValue, currentTurn);

        if (possibleMoves.length === 0) {
            // اگر حرکتی ممکن نیست، همین دنباله را برگردان
            allSequences.push([...currentSequence]);
        } else {
            // برای هر حرکت ممکن با این تاس
            possibleMoves.forEach(move => {
                // اعمال حرکت روی صفحه
                const newBoard = applyMoveToBoard(board, move, currentTurn);

                // حذف تاس استفاده شده
                const newRemainingDice = [...remainingDice];
                newRemainingDice.splice(i, 1);

                // ادامه بازگشت با وضعیت جدید
                const subSequences = generateMoveSequences(
                    newBoard,
                    newRemainingDice,
                    currentTurn,
                    [...currentSequence, move]
                );

                allSequences.push(...subSequences);
            });
        }
    }
    return allSequences;
};

const getSingleDieMoves = (board, dieValue, currentTurn) => {
    const moves = [];

    // بررسی مهره‌های اسیر شده
    const barPoint = currentTurn === "white" ? 25 : 0;
    const hasCapturedPieces = board[barPoint] !== 0;

    if (hasCapturedPieces) {
        // فقط می‌توانیم از بار حرکت کنیم
        const targetPoint = currentTurn === "white" ? 25 - dieValue : dieValue;

        if (targetPoint >= 1 && targetPoint <= 24 && isValidMove(board, barPoint, dieValue, currentTurn)) {
            moves.push({
                from: barPoint,
                to: targetPoint,
                die: dieValue,
                type: 'enter'
            });
        }
        return moves;
    }

    // بررسی تمام نقاط
    for (let i = 1; i <= 24; i++) {
        const pieces = board[i];

        if (!isPlayerPiece(pieces, currentTurn)) continue;
        const targetPoint = getTargetPoint(i, dieValue, currentTurn);

        if (board[i] !== 0 && isValidMove(board, i, dieValue, currentTurn)) {
            if (targetPoint > 24 || targetPoint < 1) {
                moves.push({
                    from: i,
                    to: currentTurn === 'white' ? -1 : 26, // -1 for white born off and 26 for for black born off 
                    die: dieValue,
                    type: 'bearoff'
                });
            } else {
                moves.push({
                    from: i,
                    to: targetPoint,
                    die: dieValue,
                    type: pieces !== 0 && Math.abs(pieces) === 1 &&
                        ((currentTurn === "white" && board[targetPoint] < 0) ||
                            (currentTurn === "black" && board[targetPoint] > 0))
                        ? 'hit'
                        : 'normal'
                });
            }
        }
    }

    return moves;
};

const applyMoveToBoard = (board, move, currentTurn) => {
    const newBoard = [...board];

    // کاهش مهره از مبدا
    if (move.from === 25 || move.from === 0) {
        // حرکت از بار
        newBoard[move.from] = currentTurn === "white"
            ? newBoard[move.from] - 1  // white captured
            : newBoard[move.from] + 1; // black captured (negative)
    } else {
        // حرکت از نقطه معمولی
        newBoard[move.from] = currentTurn === "white"
            ? newBoard[move.from] - 1
            : newBoard[move.from] + 1;
    }

    // اضافه کردن مهره به مقصد
    if (move.to === 0) {
        // Bear off - مهره از بازی خارج می‌شود
        // نیازی به اضافه کردن به جایی نیست
    } else if (move.type === 'hit') {
        // زدن مهره حریف
        if (currentTurn === "white") {
            // black piece goes to bar (position 0)
            newBoard[0] = newBoard[0] - 1; // black captured becomes more negative
            newBoard[move.to] = 1; // white piece
        } else {
            // white piece goes to bar (position 25)
            newBoard[25] = newBoard[25] + 1; // white captured
            newBoard[move.to] = -1; // black piece (negative)
        }
    } else {
        // حرکت معمولی
        newBoard[move.to] = currentTurn === "white"
            ? newBoard[move.to] + 1
            : newBoard[move.to] - 1;
    }

    return newBoard;
};

// توابع کمکی

const isPlayerPiece = (pieces, currentTurn) => {
    return (currentTurn === "white" && pieces > 0) || (currentTurn === "black" && pieces < 0);
};

const getTargetPoint = (fromPoint, dieValue, currentTurn) => {
    return currentTurn === "white" ? fromPoint - dieValue : fromPoint + dieValue;
};

// حذف دنباله‌های تکراری (مثلاً وقتی تاس‌ها یکسان هستند)
export const removeDuplicateSequences = (sequences) => {
    const seen = new Set();
    return sequences.filter(seq => {
        const key = JSON.stringify(seq.map(m => `${m.from}-${m.to}-${m.die}`).sort());
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

