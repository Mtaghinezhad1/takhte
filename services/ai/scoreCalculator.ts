import { AI_LEVELS_MULTIPLIER, STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';

export const scoreCalculator = {
    /**
     * محاسبه امتیاز نهایی با در نظر گرفتن استراتژی، فاز و سطح دشواری
     */
    calculateScore(features, strategy, phase, difficulty = '5') {
        // ۱. دریافت وزن‌های پایه استراتژی
        const baseWeights = this.getBaseWeights(strategy, phase);
        if (!baseWeights) {
            console.warn(`No weights found for ${strategy}/${phase}, using default`);
            return this.calculateDefaultScore(features);
        }

        // ۲. اعمال ضریب سطح دشواری
        const adjustedWeights = this.applyDifficultyMultiplier(baseWeights, difficulty);

        // ۳. محاسبه امتیاز خام
        const rawScore = this.calculateRawScore(features, adjustedWeights);

        // ۴. اعمال نویز برای سطوح پایین‌تر (اختیاری)
        const noise = this.getNoiseLevel(difficulty);
        const finalScore = rawScore * (1 + (Math.random() - 0.5) * noise);

        return finalScore;
    },

    /**
     * دریافت وزن‌های پایه استراتژی
     */
    getBaseWeights(strategy, phase) {
        return STRATEGY_PHASE_WEIGHTS[strategy]?.[phase] || null;
    },

    /**
     * اعمال ضریب سطح دشواری روی وزن‌ها
     */
    applyDifficultyMultiplier(weights, difficulty) {
        const multiplier = AI_LEVELS_MULTIPLIER[difficulty];
        if (!multiplier) return weights;

        const result = {};
        for (const key in weights) {
            const weightValue = weights[key];
            const multiplierValue = multiplier[key] || 1;

            result[key] = weightValue * multiplierValue;
        }
        return result;
    },

    /**
     * محاسبه امتیاز خام از روی ویژگی‌ها و وزن‌ها
     */
    calculateRawScore(features, weights) {
        let score = 0;

        // وزن‌های پایه
        score += (features.pipCount?.pipDiff || 0) * (weights.pipCount || 0);
        score += (features.blot?.blotDiff || 0) * (weights.blots || 0);
        score += (features.closedPoints?.closedDiff || 0) * (weights.closedPoints || 0);
        score += (features.blot?.totalRisk || 0) * (weights.risk || 0);
        score += (features.prime?.primeDiff || 0) * (weights.primes || 0);
        score += (features.attack?.totalHitValue || 0) * (weights.hits || 0);
        score += (features.structure?.stackingPenalty || 0) * (weights.stackingPenalty || 0);

        // وزن‌های اختصاصی استراتژی‌ها
        if (weights.homeBoardStrength) {
            score += (features.closedPoints?.myClosedCount || 0) * weights.homeBoardStrength;
        }

        if (weights.opponentOnBar) {
            score += (features.attack?.opponentOnBar || 0) * weights.opponentOnBar;
        }

        if (weights.anchorStrength) {
            score += (features.defense?.anchors?.length || 0) * weights.anchorStrength;
        }

        if (weights.primeExtensionValue) {
            score += (features.prime?.myMaxPrimeLength || 0) * weights.primeExtensionValue;
        }

        if (weights.blockingValue) {
            score += (features.prime?.oppMaxPrimeLength || 0) * -weights.blockingValue;
        }

        if (weights.wastage) {
            const myWastage = (features.pipCount?.effectivePips || 0) - (features.pipCount?.myPips || 0);
            score += myWastage * weights.wastage;
        }

        if (weights.contactAvoidance) {
            const inContact = (features.blot?.myBlots || 0) > 0 || (features.blot?.oppBlots || 0) > 0;
            score += (inContact ? -1 : 1) * weights.contactAvoidance;
        }

        if (weights.bearoffEfficiency) {
            score += (features.bearoff?.diceUtilization || 0) * weights.bearoffEfficiency;
            score += (features.bearoff?.averageDistance || 0) * -weights.bearoffEfficiency;
        }

        if (weights.flexibility) {
            score += (features.structure?.flexibility || 0) * weights.flexibility;
        }

        if (weights.connectivity) {
            score += (features.structure?.connectivity || 0) * weights.connectivity;
        }

        if (weights.timingValue) {
            score += (features.metadata?.timing || 0) * weights.timingValue;
        }

        if (weights.anchorCount) {
            score += (features.defense?.anchors?.length || 0) * weights.anchorCount;
        }

        if (weights.hittingNumbers) {
            score += (features.attack?.directHits || 0) * weights.hittingNumbers;
        }

        if (weights.hitAndContain) {
            score += (features.attack?.directHits || 0) * weights.hitAndContain;
            score += (features.attack?.opponentOnBar || 0) * weights.hitAndContain * 0.5;
        }

        if (weights.containmentValue) {
            score += (features.defense?.anchors?.length || 0) * weights.containmentValue * 0.3;
        }

        if (weights.safety) {
            const myBlots = features.blot?.myBlots || 0;
            score -= myBlots * weights.safety * 0.5;
        }

        if (weights.diceUtilization) {
            score += (features.bearoff?.diceUtilization || 0) * weights.diceUtilization;
        }

        if (weights.averageDistance) {
            score += (features.bearoff?.averageDistance || 0) * (weights.averageDistance || 0);
        }

        if (weights.desperateEscape) {
            const backCheckers = features.defense?.backCheckers || 0;
            score += backCheckers * weights.desperateEscape * 0.5;
        }

        if (weights.savingGammon) {
            const oppBlots = features.blot?.oppBlots || 0;
            score += oppBlots * weights.savingGammon * 0.3;
        }

        if (weights.counterPlay) {
            const oppBlots = features.blot?.oppBlots || 0;
            const myClosed = features.closedPoints?.myClosedCount || 0;
            score += (oppBlots * 0.3 + myClosed * 0.1) * weights.counterPlay;
        }

        if (weights.escapePotential) {
            const escapeRoutes = features.defense?.escapeRoutes || 0;
            score += escapeRoutes * weights.escapePotential * 0.2;
        }

        if (weights.bearoffPrep) {
            const remaining = features.bearoff?.remainingCheckers || 0;
            const avgDist = features.bearoff?.averageDistance || 0;
            score += (15 - remaining) * weights.bearoffPrep * 0.3;
            score -= avgDist * weights.bearoffPrep * 0.1;
        }

        if (weights.safetyInHome) {
            const myBlots = features.blot?.myBlots || 0;
            score -= myBlots * weights.safetyInHome * 0.4;
        }

        if (weights.gapControl) {
            const myClosed = features.closedPoints?.myClosedCount || 0;
            const oppClosed = features.closedPoints?.oppClosedCount || 0;
            score += (myClosed - oppClosed) * weights.gapControl * 0.2;
        }

        return score;
    },

    /**
     * دریافت سطح نویز بر اساس دشواری
     * سطوح پایین‌تر نویز بیشتر = تصمیمات تصادفی‌تر
     */
    getNoiseLevel(difficulty) {
        const noiseMap = {
            '1': 0.4,
            '2': 0.35,
            '3': 0.3,
            '4': 0.25,
            '5': 0.2,
            '6': 0.15,
            '7': 0.1,
            '8': 0.07,
            '9': 0.03,
            '10': 0.0
        };
        return noiseMap[difficulty] || 0.2;
    },

    /**
     * محاسبه امتیاز پیش‌فرض (زمانی که استراتژی پیدا نشود)
     */
    calculateDefaultScore(features) {
        return (
            (features.pipCount?.pipDiff || 0) * 0.5 +
            (features.blot?.blotDiff || 0) * 0.3 +
            (features.closedPoints?.closedDiff || 0) * 0.4 +
            (features.blot?.totalRisk || 0) * -0.2 +
            (features.prime?.primeDiff || 0) * 0.3 +
            (features.attack?.totalHitValue || 0) * 0.1 +
            (features.structure?.stackingPenalty || 0)
        );
    }
};