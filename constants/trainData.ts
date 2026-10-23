// ============================================
// sampleTrainingData.js - نمونه داده‌های آموزشی
// ============================================

export const sampleTrainingData = [
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 1, 1, 1],
        turn: 'black',
        bestMoves1: [{ from: 17, to: 18, die: 1 }, { from: 17, to: 18, die: 1 }, { from: 19, to: 20, die: 1 }, { from: 19, to: 20, die: 1 }],
        scoreBestMoves1: 0.315,
        bestMoves2: [{ from: 1, to: 2, die: 1 }, { from: 2, to: 3, die: 1 }, { from: 19, to: 20, die: 1 }, { from: 19, to: 20, die: 1 }],
        scoreBestMoves2: 0.292,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 2],
        turn: 'black',
        bestMoves1: [{ from: 1, to: 2, die: 1 }, { from: 12, to: 14, die: 2 }],
        scoreBestMoves1: -.010,
        bestMoves2: [{ from: 1, to: 2, die: 1 }, { from: 2, to: 4, die: 2 }],
        scoreBestMoves2: -0.022,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 3],
        turn: 'black',
        bestMoves1: [{ from: 17, to: 20, die: 3 }, { from: 19, to: 20, die: 1 }],
        scoreBestMoves1: 0.219,
        bestMoves2: [{ from: 12, to: 15, die: 3 }, { from: 1, to: 2, die: 1 }],
        scoreBestMoves2: -0.011,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 4],
        turn: 'black',
        bestMoves1: [{ from: 12, to: 16, die: 4 }, { from: 1, to: 2, die: 1 }],
        scoreBestMoves1: -0.012,
        bestMoves2: [{ from: 12, to: 16, die: 4 }, { from: 19, to: 20, die: 1 }],
        scoreBestMoves2: -0.027,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 5],
        turn: 'black',
        bestMoves1: [{ from: 12, to: 17, die: 5 }, { from: 1, to: 2, die: 1 }],
        scoreBestMoves1: -0.006,
        bestMoves2: [{ from: 1, to: 2, die: 1 }, { from: 2, to: 7, die: 5 }],
        scoreBestMoves2: -0.029,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 6],
        turn: 'black',
        bestMoves1: [{ from: 12, to: 18, die: 6 }, { from: 17, to: 18, die: 1 }],
        scoreBestMoves1: 0.127,
        bestMoves2: [{ from: 1, to: 7, die: 6 }, { from: 1, to: 2, die: 1 }],
        scoreBestMoves2: -0.039,
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [2, 5],
        turn: 'black',
        bestMoves1: [{ from: 12, to: 17, die: 5 }, { from: 1, to: 3, die: 2 }],
        scoreBestMoves1: 0.003,
        bestMoves2: [{ from: 12, to: 17, die: 5 }, { from: 12, to: 14, die: 2 }],
        scoreBestMoves2: -0.007,
    },




    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -3, 6, -1, 0, 0, -4, 0, -5, 0, 0, 0, 0, 1, 0],
        dice: [2, 2, 2, 2],
        turn: 'black',
        bestMoves1: [{ from: 1, to: 3, die: 2 }, { from: 12, to: 14, die: 2 }, { from: 19, to: 21, die: 2 }, { from: 19, to: 21, die: 2 }],
        scoreBestMoves1: 0.096,
        bestMoves2: [{ from: 1, to: 3, die: 2 }, { from: 1, to: 3, die: 2 }, { from: 19, to: 21, die: 2 }, { from: 19, to: 21, die: 2 }],
        scoreBestMoves2: 0.084,
    },
    {
        board: [0, -1, 0, 2, 0, -1, 4, 0, 2, 0, 0, 0, -2, 6, -2, 1, 0, -4, 0, -3, 0, -2, 0, 0, 0, 0],
        dice: [3, 5],
        turn: 'black',
        bestMoves1: [{ from: 12, to: 17, die: 5 }, { from: 12, to: 15, die: 3 }],
        scoreBestMoves1: 0.121,
        bestMoves2: [{ from: 5, to: 10, die: 5 }, { from: 12, to: 15, die: 3 }],
        scoreBestMoves2: 0.092,
    },
    {
        board: [0, -1, 0, 2, 0, -1, 4, 1, 2, 0, 0, 0, 0, 5, -2, -1, 0, -5, 0, -3, 0, -2, 0, 1, 0, 0],
        dice: [3, 2],
        turn: 'black',
        bestMoves1: [{ from: 5, to: 7, die: 2 }, { from: 7, to: 10, die: 3 }],
        scoreBestMoves1: 0.223,
        bestMoves2: [{ from: 5, to: 7, die: 2 }, { from: 1, to: 4, die: 3 }],
        scoreBestMoves2: 0.179,
    },
    {
        board: [0, -1, 0, 2, 0, 0, 4, 0, 2, 0, -1, 0, 0, 5, -2, -1, 0, -5, 0, -3, 0, -2, 0, 1, 0, 1],
        dice: [5, 5, 5, 5],
        turn: 'black',
        bestMoves1: [{ from: 10, to: 15, die: 5 }, { from: 14, to: 19, die: 5 }, { from: 15, to: 20, die: 5 }, { from: 15, to: 20, die: 5 }],
        scoreBestMoves1: 0.458,
        bestMoves2: [{ from: 5, to: 7, die: 2 }, { from: 17, to: 22, die: 5 }, { from: 17, to: 22, die: 5 }, { from: 17, to: 22, die: 5 }],
        scoreBestMoves2: 0.44,
    },
    {
        board: [0, -1, 0, 2, 0, 0, 4, 0, 2, 1, 0, 0, 0, 4, -1, -2, 0, -3, 0, -4, 1, -2, -2, 1, 0, 0],
        dice: [2, 3],
        turn: 'black',
        bestMoves1: [{ from: 17, to: 20, die: 3 }, { from: 20, to: 22, die: 2 }],
        scoreBestMoves1: 0.381,
        bestMoves2: [{ from: 14, to: 17, die: 3 }, { from: 19, to: 21, die: 2 }],
        scoreBestMoves2: 0.317,
    },
    {
        board: [0, 0, 0, 2, -1, 0, 3, 0, 2, 1, 0, 0, 1, 3, -1, -2, 0, -3, 0, -3, 1, -2, -2, -1, 1, 1],
        dice: [4, 3],
        turn: 'black',
        bestMoves1: [{ from: 17, to: 20, die: 3 }, { from: 19, to: 23, die: 4 }],
        scoreBestMoves1: 0.613,
        bestMoves2: [{ from: 17, to: 20, die: 3 }, { from: 20, to: 24, die: 4 }],
        scoreBestMoves2: 0.544,
    },
    {
        board: [0, 0, 0, 2, 0, 0, 3, -1, 2, 1, 0, 0, 1, 3, -1, -2, 0, -3, 0, -2, 1, -2, -2, -2, 1, 1],
        dice: [6, 2],
        turn: 'black',
        bestMoves1: [{ from: 14, to: 20, die: 6 }, { from: 7, to: 9, die: 2 }],
        scoreBestMoves1: 0.661,
        bestMoves2: [{ from: 7, to: 9, die: 2 }, { from: 9, to: 15, die: 6 }],
        scoreBestMoves2: 0.646,
    },
    {
        board: [0, 0, 0, 2, 0, 0, 3, 0, 2, -1, 0, 0, 1, 3, 0, -2, 0, -3, 0, -2, -1, -2, -2, -2, 1, 3],
        dice: [5, 2],
        turn: 'black',
        bestMoves1: [{ from: 15, to: 20, die: 5 }, { from: 17, to: 19, die: 2 }],
        scoreBestMoves1: 0.729,
        bestMoves2: [{ from: 15, to: 20, die: 5 }, { from: 15, to: 17, die: 2 }],
        scoreBestMoves2: 0.727,
    },
];

// ==========================================
// داده‌های آموزشی کوچک‌تر برای تست سریع
// ==========================================
export const quickTrainingData = sampleTrainingData.slice(0, 10);
