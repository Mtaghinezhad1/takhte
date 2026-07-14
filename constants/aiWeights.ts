export const AI_LEVELS = {
    '1': {  // افسانه‌ای
        OPENING: {
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
            primes: 0,

        },
        MIDDLEGAME: {
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 0.5,
            blots: 16,
            hits: 9,
            closedPoints: 22,
            risk: -45,
            primes: 0,
        }
    },
    '2': {  // خبره
        OPENING: {
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 1.0,
            blots: 10,
            hits: 5,
            closedPoints: 12,
            risk: -25,
            primes: 0,
        }
    },
    '3': {  // استاد
        OPENING: {
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 0.8,
            blots: 13,
            hits: 7,
            closedPoints: 16,
            risk: -32,
            primes: 0,
        }
    },
    '4': {  // ضعیف‌ترین - فقط به فکر کم کردن پیپ
        OPENING: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 5,
            blots: 0.1,
            hits: 0.1,
            closedPoints: 0.1,
            risk: 0,
            primes: 0,
        }
    },
    '5': {  // کمی توجه به امنیت
        OPENING: {
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 4,
            blots: 0.5,
            hits: 0.3,
            closedPoints: 0.5,
            risk: -0.5,
            primes: 0,
        }
    },
    '6': {  // نیمه‌حرفه‌ای
        OPENING: {
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 1.5,
            blots: 5,
            hits: 3,
            closedPoints: 5,
            risk: -12,
            primes: 0,
        }
    },
    '7': {  // حرفه‌ای
        OPENING: {
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 1.2,
            blots: 7,
            hits: 4,
            closedPoints: 8,
            risk: -18,
            primes: 0,
        }
    },
    '8': {  // مبتدی
        OPENING: {
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 3,
            blots: 1,
            hits: 0.5,
            closedPoints: 1,
            risk: -2,
            primes: 0,
        }
    },
    '9': {  // آماتور - توجه بیشتر به امنیت
        OPENING: {
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
            primes: 0,
        },
        MIDDLEGAME: {
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
            primes: 0,
        },
        ENDGAME: {
            pipCount: 2.5,
            blots: 2,
            hits: 1,
            closedPoints: 2,
            risk: -5,
            primes: 0,
        }
    },
    '10': {  // متوسط
        OPENING: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        },
        MIDDLEGAME: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        },
        ENDGAME: {
            pipCount: 2,
            blots: 3,
            hits: 2,
            closedPoints: 3,
            risk: -8,
            primes: 2,
        }
    },
};

export const AI_LEVELS_MULTIPLIER = {
    // ========== سطوح ۱-۳: مبتدی تا آسان ==========
    '1': {  // بسیار مبتدی - فقط پیپ کانت مهمه
        pipCount: 0.5,
        blots: 16,
        hits: 9,
        closedPoints: 22,
        risk: -45,
        primes: 0,
        stackingPenalty: -0.1, // ❌ ازدحام براش مهم نیست
        homeBoardStrength: 0.1,
        opponentOnBar: 0.1,
        bearoffEfficiency: 0.2,
        flexibility: 0.1,
        blockingValue: 0.1,
        primeExtensionValue: 0.1,
        bearoffPrep: 0.2,
        safetyInHome: 0.2,
        wastage: 0.1,
        contactAvoidance: 0.1,
        gapControl: 0.1,
        anchorStrength: 0.1,
        escapePotential: 0.1,
        counterPlay: 0.1,
        desperateEscape: 0.2,
        savingGammon: 0.1,
        timingValue: 0.1,
        anchorCount: 0.1,
        hittingNumbers: 0.1,
        hitAndContain: 0.1,
        containmentValue: 0.1,
        safety: 0.2,
        diceUtilization: 0.2,
        averageDistance: 0.2,
        bearoffPrep: 0.2
    },
    
    '2': {  // مبتدی - کمی به بلات‌ها توجه میکنه
        pipCount: 1.0,
        blots: 10,
        hits: 5,
        closedPoints: 12,
        risk: -25,
        primes: 0,
        stackingPenalty: -0.2,
        homeBoardStrength: 0.2,
        opponentOnBar: 0.2,
        bearoffEfficiency: 0.3,
        flexibility: 0.2,
        blockingValue: 0.2,
        primeExtensionValue: 0.2,
        bearoffPrep: 0.3,
        safetyInHome: 0.3,
        wastage: 0.2,
        contactAvoidance: 0.2,
        gapControl: 0.2,
        anchorStrength: 0.2,
        escapePotential: 0.2,
        counterPlay: 0.2,
        desperateEscape: 0.3,
        savingGammon: 0.2,
        timingValue: 0.2,
        anchorCount: 0.2,
        hittingNumbers: 0.2,
        hitAndContain: 0.2,
        containmentValue: 0.2,
        safety: 0.3,
        diceUtilization: 0.3,
        averageDistance: 0.3
    },
    
    '3': {  // آسان - تعادل ساده
        pipCount: 0.8,
        blots: 13,
        hits: 7,
        closedPoints: 16,
        risk: -32,
        primes: 0,
        stackingPenalty: -0.3,
        homeBoardStrength: 0.3,
        opponentOnBar: 0.3,
        bearoffEfficiency: 0.4,
        flexibility: 0.3,
        blockingValue: 0.3,
        primeExtensionValue: 0.3,
        bearoffPrep: 0.4,
        safetyInHome: 0.4,
        wastage: 0.3,
        contactAvoidance: 0.3,
        gapControl: 0.3,
        anchorStrength: 0.3,
        escapePotential: 0.3,
        counterPlay: 0.3,
        desperateEscape: 0.4,
        savingGammon: 0.3,
        timingValue: 0.3,
        anchorCount: 0.3,
        hittingNumbers: 0.3,
        hitAndContain: 0.3,
        containmentValue: 0.3,
        safety: 0.4,
        diceUtilization: 0.4,
        averageDistance: 0.4
    },

    // ========== سطوح ۴-۶: متوسط ==========
    '4': {  // متوسط رو به پایین
        pipCount: 5,
        blots: 0.1,
        hits: 0.1,
        closedPoints: 0.1,
        risk: 0,
        primes: 0,
        stackingPenalty: -0.5,
        homeBoardStrength: 0.5,
        opponentOnBar: 0.5,
        bearoffEfficiency: 0.6,
        flexibility: 0.5,
        blockingValue: 0.5,
        primeExtensionValue: 0.5,
        bearoffPrep: 0.6,
        safetyInHome: 0.6,
        wastage: 0.5,
        contactAvoidance: 0.5,
        gapControl: 0.5,
        anchorStrength: 0.5,
        escapePotential: 0.5,
        counterPlay: 0.5,
        desperateEscape: 0.6,
        savingGammon: 0.5,
        timingValue: 0.5,
        anchorCount: 0.5,
        hittingNumbers: 0.5,
        hitAndContain: 0.5,
        containmentValue: 0.5,
        safety: 0.6,
        diceUtilization: 0.6,
        averageDistance: 0.6
    },
    
    '5': {  // متوسط استاندارد
        pipCount: 4,
        blots: 0.5,
        hits: 0.3,
        closedPoints: 0.5,
        risk: -0.5,
        primes: 0,
        stackingPenalty: -0.6,
        homeBoardStrength: 0.6,
        opponentOnBar: 0.6,
        bearoffEfficiency: 0.7,
        flexibility: 0.6,
        blockingValue: 0.6,
        primeExtensionValue: 0.6,
        bearoffPrep: 0.7,
        safetyInHome: 0.7,
        wastage: 0.6,
        contactAvoidance: 0.6,
        gapControl: 0.6,
        anchorStrength: 0.6,
        escapePotential: 0.6,
        counterPlay: 0.6,
        desperateEscape: 0.7,
        savingGammon: 0.6,
        timingValue: 0.6,
        anchorCount: 0.6,
        hittingNumbers: 0.6,
        hitAndContain: 0.6,
        containmentValue: 0.6,
        safety: 0.7,
        diceUtilization: 0.7,
        averageDistance: 0.7
    },
    
    '6': {  // متوسط رو به بالا
        pipCount: 1.5,
        blots: 5,
        hits: 3,
        closedPoints: 5,
        risk: -12,
        primes: 0,
        stackingPenalty: -0.7,
        homeBoardStrength: 0.7,
        opponentOnBar: 0.7,
        bearoffEfficiency: 0.8,
        flexibility: 0.7,
        blockingValue: 0.7,
        primeExtensionValue: 0.7,
        bearoffPrep: 0.8,
        safetyInHome: 0.8,
        wastage: 0.7,
        contactAvoidance: 0.7,
        gapControl: 0.7,
        anchorStrength: 0.7,
        escapePotential: 0.7,
        counterPlay: 0.7,
        desperateEscape: 0.8,
        savingGammon: 0.7,
        timingValue: 0.7,
        anchorCount: 0.7,
        hittingNumbers: 0.7,
        hitAndContain: 0.7,
        containmentValue: 0.7,
        safety: 0.8,
        diceUtilization: 0.8,
        averageDistance: 0.8
    },

    // ========== سطوح ۷-۸: خوب تا خیلی خوب ==========
    '7': {  // خوب - تاکتیکی
        pipCount: 1.2,
        blots: 7,
        hits: 4,
        closedPoints: 8,
        risk: -18,
        primes: 0,
        stackingPenalty: -0.8,
        homeBoardStrength: 0.9,
        opponentOnBar: 0.9,
        bearoffEfficiency: 0.9,
        flexibility: 0.8,
        blockingValue: 0.8,
        primeExtensionValue: 0.8,
        bearoffPrep: 0.9,
        safetyInHome: 0.9,
        wastage: 0.8,
        contactAvoidance: 0.8,
        gapControl: 0.8,
        anchorStrength: 0.8,
        escapePotential: 0.8,
        counterPlay: 0.8,
        desperateEscape: 0.9,
        savingGammon: 0.8,
        timingValue: 0.8,
        anchorCount: 0.8,
        hittingNumbers: 0.8,
        hitAndContain: 0.8,
        containmentValue: 0.8,
        safety: 0.9,
        diceUtilization: 0.9,
        averageDistance: 0.9
    },
    
    '8': {  // خیلی خوب - تهاجمی
        pipCount: 3,
        blots: 1,
        hits: 0.5,
        closedPoints: 1,
        risk: -2,
        primes: 0,
        stackingPenalty: -0.9,
        homeBoardStrength: 1.0,
        opponentOnBar: 1.0,
        bearoffEfficiency: 1.0,
        flexibility: 0.9,
        blockingValue: 0.9,
        primeExtensionValue: 0.9,
        bearoffPrep: 1.0,
        safetyInHome: 1.0,
        wastage: 0.9,
        contactAvoidance: 0.9,
        gapControl: 0.9,
        anchorStrength: 0.9,
        escapePotential: 0.9,
        counterPlay: 0.9,
        desperateEscape: 1.0,
        savingGammon: 0.9,
        timingValue: 0.9,
        anchorCount: 0.9,
        hittingNumbers: 0.9,
        hitAndContain: 0.9,
        containmentValue: 0.9,
        safety: 1.0,
        diceUtilization: 1.0,
        averageDistance: 1.0
    },

    // ========== سطوح ۹-۱۰: حرفه‌ای تا استاد ==========
    '9': {  // حرفه‌ای - هوشمند و متعادل
        pipCount: 2.5,
        blots: 2,
        hits: 1,
        closedPoints: 2,
        risk: -5,
        primes: 0,
        stackingPenalty: -1.0,
        homeBoardStrength: 1.1,
        opponentOnBar: 1.1,
        bearoffEfficiency: 1.1,
        flexibility: 1.0,
        blockingValue: 1.0,
        primeExtensionValue: 1.0,
        bearoffPrep: 1.1,
        safetyInHome: 1.1,
        wastage: 1.0,
        contactAvoidance: 1.0,
        gapControl: 1.0,
        anchorStrength: 1.0,
        escapePotential: 1.0,
        counterPlay: 1.0,
        desperateEscape: 1.1,
        savingGammon: 1.0,
        timingValue: 1.0,
        anchorCount: 1.0,
        hittingNumbers: 1.0,
        hitAndContain: 1.0,
        containmentValue: 1.0,
        safety: 1.1,
        diceUtilization: 1.1,
        averageDistance: 1.1
    },
    
    '10': {  // استاد - کامل و دقیق
        pipCount: 2,
        blots: 3,
        hits: 2,
        closedPoints: 3,
        risk: -8,
        primes: 2,
        stackingPenalty: -1,
        homeBoardStrength: 1,
        opponentOnBar: 1,
        bearoffEfficiency: 1,
        flexibility: 1,
        blockingValue: 1,
        primeExtensionValue: 1,
        bearoffPrep: 1,
        safetyInHome: 1,
        wastage: 1,
        contactAvoidance: 1,
        gapControl: 1,
        anchorStrength: 1,
        escapePotential: 1,
        counterPlay: 1,
        desperateEscape: 1,
        savingGammon: 1,
        timingValue: 1,
        anchorCount: 1,
        hittingNumbers: 1,
        hitAndContain: 1,
        containmentValue: 1,
        safety: 1,
        diceUtilization: 1,
        averageDistance: 1
    }
};

export const STRATEGIES = {
    BLITZ: 'BLITZ',
    PRIME: 'PRIME',
    RACE: 'RACE',
    HOLDING: 'HOLDING',
    BACKGAME: 'BACKGAME',
    BEAROFF: 'BEAROFF'
};

export const PHASES = {
    OPENING: 'OPENING',
    MIDDLEGAME: 'MIDDLEGAME',
    ENDGAME: 'ENDGAME'
};

export const STRATEGY_PHASE_WEIGHTS = {
    [STRATEGIES.BLITZ]: {
        [PHASES.OPENING]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            homeBoardStrength: 1.8,
            opponentOnBar: 2.0  // حریف روی bar خیلی ارزشمنده
        },
        [PHASES.MIDDLEGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            homeBoardStrength: 2.0,
            opponentOnBar: 2.5  // حریف روی bar حیاتیه
        },
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            bearoffEfficiency: 1.5,  // تبدیل به بیرون آوردن
            safety: 0.8
        }
    },

    [STRATEGIES.PRIME]: {
        [PHASES.OPENING]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            flexibility: 0.8,  // انعطاف‌پذیری مهمه
            blockingValue: 0.6
        },
        [PHASES.MIDDLEGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            primeExtensionValue: 1.5,  // گسترش پرایم
            blockingValue: 1.2
        },
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            bearoffPrep: 1.2,  // آمادگی برای بیرون آوردن
            safetyInHome: 0.9
        }
    },

    [STRATEGIES.RACE]: {
        [PHASES.OPENING]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            wastage: -0.5,     // اتلاف پیپ منفیه
            contactAvoidance: 0.7
        },
        [PHASES.MIDDLEGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            wastage: -0.8,
            gapControl: 0.6
        },
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            bearoffEfficiency: 2.0,  // کارایی بیرون آوردن
            wastage: -1.0
        }
    },

    [STRATEGIES.HOLDING]: {
        [PHASES.OPENING]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            anchorStrength: 1.5,  // قدرت لنگر خیلی مهمه
            escapePotential: 0.8
        },
        [PHASES.MIDDLEGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            anchorStrength: 1.2,
            counterPlay: 0.9
        },
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            desperateEscape: 1.5,  // فرار ضروریه
            savingGammon: 1.2
        }
    },

    [STRATEGIES.BACKGAME]: {
        [PHASES.MIDDLEGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            timingValue: 1.8,  // تایمینگ همه چیزه
            anchorCount: 1.0,
            hittingNumbers: 0.7
        },
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            hitAndContain: 1.8,
            containmentValue: 1.2
        }
    },

    [STRATEGIES.BEAROFF]: {
        [PHASES.ENDGAME]: {
            pipCount: 1,
            blots: 1,        // بلات‌های حریف خیلی مهمن
            closedPoints: 1,  // بستن تخته اولویته
            risk: 1,        // ریسک کمتر چون تخته هنوز قوی نیست
            primes: 1,
            hits: 1,
            stackingPenalty: 1,
            bearoffEfficiency: 2.5,
            diceUtilization: 1.5,
            averageDistance: -1.0,
            safety: 1.0
        }
    }
};

// =================== تنظیمات سطح بازی ===================
// export const LEVEL_CONFIG = {
//     '1': { depth: 0, weights: AI_LEVELS['1'] },  // مبتدی
//     '2': { depth: 0, weights: AI_LEVELS['3'] },  // آسان
//     '3': { depth: 0, weights: AI_LEVELS['5'] },  // متوسط
//     '4': { depth: 0, weights: AI_LEVELS['7'] },  // سخت
//     '5': { depth: 0, weights: AI_LEVELS['10'] },
//     '6': { depth: 1, weights: AI_LEVELS['1'] },
//     '7': { depth: 1, weights: AI_LEVELS['3'] },
//     '8': { depth: 1, weights: AI_LEVELS['5'] },
//     '9': { depth: 1, weights: AI_LEVELS['7'] },
//     '10': { depth: 1, weights: AI_LEVELS['10'] },
// }

// ========== تنظیمات سطح بازی ==========
export const LEVEL_CONFIG = {
    '1': { depth: 0, difficulty: '1' },
    '2': { depth: 0, difficulty: '2' },
    '3': { depth: 0, difficulty: '3' },
    '4': { depth: 0, difficulty: '4' },
    '5': { depth: 0, difficulty: '5' },
    '6': { depth: 0, difficulty: '6' },
    '7': { depth: 0, difficulty: '7' },
    '8': { depth: 0, difficulty: '8' },
    '9': { depth: 0, difficulty: '9' },
    '10': { depth: 0, difficulty: '10' },
};