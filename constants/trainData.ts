// ============================================
// sampleTrainingData.js - نمونه داده‌های آموزشی
// ============================================

export const sampleTrainingData = [
    // ==========================================
    // موقعیت‌های OPENING - استراتژی BLITZ
    // ==========================================
    // {
    //     board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     dice: [4, 2],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 20, die: 4 }, { from: 13, to: 11, die: 2 }],
    //     strategy: 'BLITZ',
    //     phase: 'OPENING',
    //     description: 'حرکت ابتدایی استاندارد سفید'
    // },
    // {
    //     board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     dice: [5, 3],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 19, die: 5 }, { from: 13, to: 10, die: 3 }],
    //     strategy: 'BLITZ',
    //     phase: 'OPENING',
    //     description: 'حرکت ابتدایی با تاس ۵ و ۳'
    // },
    // {
    //     board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     dice: [6, 1],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 18, die: 6 }, { from: 13, to: 12, die: 1 }],
    //     strategy: 'BLITZ',
    //     phase: 'OPENING',
    //     description: 'حرکت ابتدایی با تاس ۶ و ۱'
    // },

    // ==========================================
    // موقعیت‌های OPENING - استراتژی PRIME
    // ==========================================
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 3],
        turn: 'black',
        bestMoves: [{ from: 17, to: 20, die: 3 }, { from: 19, to: 20, die: 1 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 2],
        turn: 'black',
        bestMoves: [{ from: 1, to: 2, die: 1 }, { from: 12, to: 14, die: 2 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [1, 6],
        turn: 'black',
        bestMoves: [{ from: 12, to: 18, die: 6 }, { from: 17, to: 18, die: 1 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [2, 3],
        turn: 'black',
        bestMoves: [{ from: 1, to: 4, die: 3 }, { from: 12, to: 14, die: 2 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [2, 4],
        turn: 'black',
        bestMoves: [{ from: 17, to: 21, die: 4 }, { from: 19, to: 21, die: 2 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [2, 6],
        turn: 'black',
        bestMoves: [{ from: 1, to: 7, die: 6 }, { from: 7, to: 9, die: 2 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [3, 5],
        turn: 'black',
        bestMoves: [{ from: 17, to: 22, die: 5 }, { from: 19, to: 22, die: 3 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [3, 6],
        turn: 'black',
        bestMoves: [{ from: 1, to: 7, die: 6 }, { from: 7, to: 10, die: 3 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    {
        board: [0, -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2, 0],
        dice: [6, 5],
        turn: 'black',
        bestMoves: [{ from: 1, to: 7, die: 6 }, { from: 7, to: 12, die: 5 }],
        strategy: 'PRIME',
        phase: 'OPENING',
        description: 'ساخت پرایم با ۳ و ۱'
    },
    // {
    //     board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     dice: [2, 1],
    //     turn: 'black',
    //     bestMoves: [{ from: 13, to: 11, die: 2 }, { from: 24, to: 23, die: 1 }],
    //     strategy: 'PRIME',
    //     phase: 'OPENING',
    //     description: 'ساخت پرایم با ۲ و ۱'
    // },

    // ==========================================
    // موقعیت‌های MIDDLEGAME - استراتژی BLITZ
    // ==========================================
    // {
    //     board: [
    //         0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, 0
    //     ],
    //     dice: [4, 3],
    //     turn: 'white',
    //     bestMoves: [{ from: 22, to: 18, die: 4 }, { from: 23, to: 20, die: 3 }],
    //     strategy: 'BLITZ',
    //     phase: 'MIDDLEGAME',
    //     description: 'حمله به بلات حریف در خانه ۱۸'
    // },
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0
    //     ],
    //     dice: [5, 2],
    //     turn: 'white',
    //     bestMoves: [{ from: 23, to: 18, die: 5 }, { from: 24, to: 22, die: 2 }],
    //     strategy: 'BLITZ',
    //     phase: 'MIDDLEGAME',
    //     description: 'زدن دو بلات پشت سر هم'
    // },

    // ==========================================
    // موقعیت‌های MIDDLEGAME - استراتژی PRIME
    // ==========================================
    // {
    //     board: [
    //         0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, 0
    //     ],
    //     dice: [6, 5],
    //     turn: 'white',
    //     bestMoves: [{ from: 13, to: 7, die: 6 }, { from: 13, to: 8, die: 5 }],
    //     strategy: 'PRIME',
    //     phase: 'MIDDLEGAME',
    //     description: 'ساخت پرایم ۶ تایی'
    // },
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, 0
    //     ],
    //     dice: [4, 2],
    //     turn: 'black',
    //     bestMoves: [{ from: 24, to: 20, die: 4 }, { from: 13, to: 11, die: 2 }],
    //     strategy: 'PRIME',
    //     phase: 'MIDDLEGAME',
    //     description: 'پرایم با نقاط ۴ و ۲'
    // },

    // ==========================================
    // موقعیت‌های MIDDLEGAME - استراتژی RACE
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [6, 6],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 18, die: 6 }, { from: 18, to: 12, die: 6 }],
    //     strategy: 'RACE',
    //     phase: 'MIDDLEGAME',
    //     description: 'مسابقه با دبل ۶'
    // },
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [5, 5],
    //     turn: 'black',
    //     bestMoves: [{ from: 24, to: 19, die: 5 }, { from: 19, to: 14, die: 5 }],
    //     strategy: 'RACE',
    //     phase: 'MIDDLEGAME',
    //     description: 'مسابقه با دبل ۵'
    // },

    // ==========================================
    // موقعیت‌های ENDGAME - استراتژی BEAROFF
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [6, 5],
    //     turn: 'white',
    //     bestMoves: [{ from: 6, to: 0, die: 6 }, { from: 5, to: 0, die: 5 }],
    //     strategy: 'BEAROFF',
    //     phase: 'ENDGAME',
    //     description: 'بیرون آوردن با ۶ و ۵'
    // },
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [4, 2],
    //     turn: 'black',
    //     bestMoves: [{ from: 24, to: 20, die: 4 }, { from: 20, to: 18, die: 2 }],
    //     strategy: 'BEAROFF',
    //     phase: 'ENDGAME',
    //     description: 'آماده‌سازی برای بیرون آوردن'
    // },

    // ==========================================
    // موقعیت‌های ENDGAME - استراتژی HOLDING
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [3, 1],
    //     turn: 'white',
    //     bestMoves: [{ from: 20, to: 17, die: 3 }, { from: 17, to: 16, die: 1 }],
    //     strategy: 'HOLDING',
    //     phase: 'ENDGAME',
    //     description: 'نگه‌داشتن لنگر در خانه ۲۰'
    // },

    // ==========================================
    // موقعیت‌های MIDDLEGAME - استراتژی BACKGAME
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [2, 1],
    //     turn: 'black',
    //     bestMoves: [{ from: 24, to: 22, die: 2 }, { from: 22, to: 21, die: 1 }],
    //     strategy: 'BACKGAME',
    //     phase: 'MIDDLEGAME',
    //     description: 'بازی عقب با دو لنگر'
    // },

    // ==========================================
    // موقعیت‌های ویژه - ضربه زدن
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0
    //     ],
    //     dice: [5, 4],
    //     turn: 'white',
    //     bestMoves: [{ from: 23, to: 18, die: 5 }, { from: 24, to: 20, die: 4 }],
    //     strategy: 'BLITZ',
    //     phase: 'MIDDLEGAME',
    //     description: 'زدن بلات حریف در خانه ۱۸'
    // },
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0
    //     ],
    //     dice: [6, 3],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 18, die: 6 }, { from: 23, to: 20, die: 3 }],
    //     strategy: 'BLITZ',
    //     phase: 'MIDDLEGAME',
    //     description: 'زدن بلات در خانه ۱۸ و ۲۰'
    // },

    // ==========================================
    // موقعیت‌های ویژه - پرایم کامل
    // ==========================================
    // {
    //     board: [
    //         0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, 0
    //     ],
    //     dice: [4, 3],
    //     turn: 'white',
    //     bestMoves: [{ from: 13, to: 9, die: 4 }, { from: 9, to: 6, die: 3 }],
    //     strategy: 'PRIME',
    //     phase: 'MIDDLEGAME',
    //     description: 'پرایم کامل ۱-۶'
    // },

    // ==========================================
    // موقعیت‌های OPENING - استراتژی RACE
    // ==========================================
    // {
    //     board: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     dice: [4, 4],
    //     turn: 'white',
    //     bestMoves: [{ from: 24, to: 20, die: 4 }, { from: 20, to: 16, die: 4 }],
    //     strategy: 'RACE',
    //     phase: 'OPENING',
    //     description: 'دبل ۴ برای مسابقه'
    // },

    // ==========================================
    // موقعیت‌های ENDGAME - استراتژی RACE
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [3, 3],
    //     turn: 'white',
    //     bestMoves: [{ from: 6, to: 3, die: 3 }, { from: 3, to: 0, die: 3 }],
    //     strategy: 'RACE',
    //     phase: 'ENDGAME',
    //     description: 'مسابقه نهایی با دبل ۳'
    // },

    // ==========================================
    // موقعیت‌های HOLDING - نگه‌داشتن لنگر
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [5, 2],
    //     turn: 'white',
    //     bestMoves: [{ from: 20, to: 15, die: 5 }, { from: 15, to: 13, die: 2 }],
    //     strategy: 'HOLDING',
    //     phase: 'MIDDLEGAME',
    //     description: 'پیشروی لنگر از ۲۰ به ۱۵'
    // },

    // ==========================================
    // موقعیت‌های BACKGAME - بازی عقب
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [6, 4],
    //     turn: 'black',
    //     bestMoves: [{ from: 24, to: 18, die: 6 }, { from: 22, to: 18, die: 4 }],
    //     strategy: 'BACKGAME',
    //     phase: 'MIDDLEGAME',
    //     description: 'بازی عقب با دو مهره در عقب'
    // },

    // ==========================================
    // موقعیت‌های BLITZ - حمله شدید
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 0
    //     ],
    //     dice: [3, 2],
    //     turn: 'white',
    //     bestMoves: [{ from: 23, to: 20, die: 3 }, { from: 22, to: 20, die: 2 }],
    //     strategy: 'BLITZ',
    //     phase: 'MIDDLEGAME',
    //     description: 'حمله به دو بلت حریف'
    // },

    // ==========================================
    // موقعیت‌های ENDGAME - بیرون آوردن سریع
    // ==========================================
    // {
    //     board: [
    //         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    //     ],
    //     dice: [2, 2],
    //     turn: 'white',
    //     bestMoves: [{ from: 6, to: 4, die: 2 }, { from: 4, to: 2, die: 2 }],
    //     strategy: 'BEAROFF',
    //     phase: 'ENDGAME',
    //     description: 'بیرون آوردن با دبل ۲'
    // }
];

// ==========================================
// داده‌های آموزشی کوچک‌تر برای تست سریع
// ==========================================
export const quickTrainingData = sampleTrainingData.slice(0, 10);

// ==========================================
// داده‌های آموزشی برای یک استراتژی خاص
// ==========================================
export const blitzTrainingData = sampleTrainingData.filter(d => d.strategy === 'BLITZ');
export const primeTrainingData = sampleTrainingData.filter(d => d.strategy === 'PRIME');
export const raceTrainingData = sampleTrainingData.filter(d => d.strategy === 'RACE');
export const holdingTrainingData = sampleTrainingData.filter(d => d.strategy === 'HOLDING');
export const backgameTrainingData = sampleTrainingData.filter(d => d.strategy === 'BACKGAME');
export const bearoffTrainingData = sampleTrainingData.filter(d => d.strategy === 'BEAROFF');

// ==========================================
// داده‌های آموزشی بر اساس فاز بازی
// ==========================================
export const openingTrainingData = sampleTrainingData.filter(d => d.phase === 'OPENING');
export const middleGameTrainingData = sampleTrainingData.filter(d => d.phase === 'MIDDLEGAME');
export const endGameTrainingData = sampleTrainingData.filter(d => d.phase === 'ENDGAME');

