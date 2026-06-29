export const AI_LEVELS = {
    '1': {  // افسانه‌ای
        opening: {
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
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
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
            primes: 0,
        }
    },
    '2': {  // خبره
        opening: {
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
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
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        }
    },
    '3': {  // استاد
        opening: {
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
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
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
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
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
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
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
            primes: 0,
        }
    },
    '6': {  // نیمه‌حرفه‌ای
        opening: {
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
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
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
            primes: 0,
        }
    },
    '7': {  // حرفه‌ای
        opening: {
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
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
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
            primes: 0,
        }
    },
    '8': {  // مبتدی
        opening: {
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
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
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
            primes: 0,
        }
    },
    '9': {  // آماتور - توجه بیشتر به امنیت
        opening: {
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
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
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
            primes: 0,
        }
    },
    '10': {  // متوسط
        opening: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
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
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        }
    },
}

// =================== تنظیمات سطح بازی ===================
export const LEVEL_CONFIG = {
    '1': { depth: 0, weights: AI_LEVELS['1'] },  // مبتدی
    '2': { depth: 0, weights: AI_LEVELS['3'] },  // آسان
    '3': { depth: 0, weights: AI_LEVELS['5'] },  // متوسط
    '4': { depth: 0, weights: AI_LEVELS['7'] },  // سخت
    '5': { depth: 0, weights: AI_LEVELS['10'] },
    '6': { depth: 1, weights: AI_LEVELS['1'] },
    '7': { depth: 1, weights: AI_LEVELS['3'] },
    '8': { depth: 1, weights: AI_LEVELS['5'] },
    '9': { depth: 1, weights: AI_LEVELS['7'] },
    '10': { depth: 1, weights: AI_LEVELS['10'] },
}