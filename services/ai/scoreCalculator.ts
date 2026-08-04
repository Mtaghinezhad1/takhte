import { AI_LEVELS, STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';

export const scoreCalculator = {
    calculateScore(features, strategy, phase, difficulty = '5', showDetails = false) {
        // 1. دریافت وزن‌های استراتژی
        const weights = this.getWeights(strategy, phase);
        if (!weights) {
            return this.calculateDefaultScore(features);
        }

        // 2. محاسبه امتیاز خام
        const rawScore = this.calculateRawScore(features, weights);

        // 3. اعمال نویز بر اساس سطح دشواری
        const noiseLevel = this.getNoiseLevel(difficulty);
        const finalScore = rawScore * (1 + (Math.random() - 0.5) * noiseLevel);

        if (showDetails) {
            this.printDetails(features, weights, rawScore, finalScore, strategy, phase, difficulty);
        }

        return finalScore;
    },

    getWeights(strategy, phase) {
        return STRATEGY_PHASE_WEIGHTS[strategy]?.[phase] || null;
    },

    getNoiseLevel(difficulty) {
        const level = AI_LEVELS[difficulty];
        return level?.noise ?? 0.3; // پیش‌فرض: 0.3
    },

    calculateRawScore(features, weights) {
        let score = 0;

        // وزن‌های پایه
        if (weights.pipCount !== undefined) {
            score += (features.pipCount?.pipDiff || 0) * weights.pipCount;
        }
        if (weights.blots !== undefined) {
            score += (features.blot?.blotDiff || 0) * weights.blots;
        }
        if (weights.closedPoints !== undefined) {
            score += (features.closedPoints?.closedDiff || 0) * weights.closedPoints;
        }
        if (weights.risk !== undefined) {
            score += (features.blot?.totalRisk || 0) * weights.risk;
        }
        if (weights.primes !== undefined) {
            score += (features.prime?.primeDiff || 0) * weights.primes;
        }
        if (weights.hits !== undefined) {
            score += (features.attack?.totalHitValue || 0) * weights.hits;
        }

        // وزن‌های اختصاصی استراتژی‌ها
        const specialKeys = [
            'homeBoardStrength', 'opponentOnBar', 'anchorStrength', 'primeExtensionValue', 'oppClosedPoint',
            'blockingValue', 'wastage', 'contactAvoidance', 'bearoffEfficiency',
            'flexibility', 'connectivity', 'timingValue', 'anchorCount', 'homeClosedDifference',
            'hittingNumbers', 'hitAndContain', 'containmentValue', 'safety',
            'diceUtilization', 'averageDistance', 'desperateEscape', 'savingGammon',
            'counterPlay', 'escapePotential', 'bearoffPrep', 'safetyInHome', 'gapControl'
        ];

        const specialFeatures = {
            oppClosedPoint: features.closedPoints?.oppHomeClosedvalue || 0,
            homeClosedDifference: features.closedPoints?.homeClosedvalueDiff || 0,
            homeBoardStrength: features.closedPoints?.myClosedCount || 0,
            opponentOnBar: features.attack?.opponentOnBar || 0,
            anchorStrength: features.defense?.anchorStrength || 0,
            primeExtensionValue: features.prime?.myMaxPrimeLength || 0,
            blockingValue: -(features.prime?.oppMaxPrimeLength || 0),
            wastage: (features.pipCount?.effectivePips || 0) - (features.pipCount?.myPips || 0),
            contactAvoidance: (features.blot?.myBlots || 0) > 0 || (features.blot?.oppBlots || 0) > 0 ? -1 : 1,
            bearoffEfficiency: (features.bearoff?.diceUtilization || 0) - (features.bearoff?.averageDistance || 0) * 0.1,
            flexibility: features.structure?.flexibility || 0,
            connectivity: features.structure?.connectivity || 0,
            timingValue: features.metadata?.timing || 0,
            anchorCount: features.defense?.anchors?.length || 0,
            hittingNumbers: features.attack?.directHits || 0,
            hitAndContain: (features.attack?.directHits || 0) + (features.attack?.opponentOnBar || 0) * 0.5,
            containmentValue: (features.defense?.anchors?.length || 0) * 0.3,
            safety: -(features.blot?.myBlots || 0) * 0.5,
            diceUtilization: features.bearoff?.diceUtilization || 0,
            averageDistance: -(features.bearoff?.averageDistance || 0),
            desperateEscape: (features.defense?.backCheckers || 0) * 0.5,
            savingGammon: (features.blot?.oppBlots || 0) * 0.3,
            counterPlay: (features.blot?.oppBlots || 0) * 0.3 + (features.closedPoints?.myClosedCount || 0) * 0.1,
            escapePotential: (features.defense?.escapeRoutes || 0) * 0.2,
            bearoffPrep: (15 - (features.bearoff?.remainingCheckers || 15)) * 0.3 - (features.bearoff?.averageDistance || 0) * 0.1,
            safetyInHome: -(features.blot?.myBlots || 0) * 0.4,
            gapControl: ((features.closedPoints?.myClosedCount || 0) - (features.closedPoints?.oppClosedCount || 0)) * 0.2
        };

        for (const key of specialKeys) {
            if (weights[key] !== undefined && specialFeatures[key] !== undefined) {
                score += specialFeatures[key] * weights[key];
            }
        }

        return score;
    },

    calculateDefaultScore(features) {
        return (
            (features.pipCount?.pipDiff || 0) * 0.5 +
            (features.blot?.blotDiff || 0) * 0.3 +
            (features.closedPoints?.closedDiff || 0) * 0.4 +
            (features.blot?.totalRisk || 0) * -0.2 +
            (features.prime?.primeDiff || 0) * 0.3 +
            (features.attack?.totalHitValue || 0) * 0.1
        );
    },

    printDetails(features, weights, rawScore, finalScore, strategy, phase, difficulty) {
        console.log('===== جزئیات محاسبه امتیاز =====');
        console.log(`استراتژی: ${strategy}`);
        console.log(`فاز: ${phase}`);
        console.log(`سطح دشواری: ${difficulty}`);
        console.log(`نویز: ${this.getNoiseLevel(difficulty)}`);
        console.log(`امتیاز خام: ${rawScore.toFixed(2)}`);
        console.log(`امتیاز نهایی: ${finalScore.toFixed(2)}`);
        console.log('================================\n');
    }
};