import { AI_LEVELS_MULTIPLIER, STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';

export const scoreCalculator = {
    calculateScore(features, strategy, phase, difficulty = '5', showDetails = false) {
        // ۱. دریافت وزن‌های پایه استراتژی
        const baseWeights = this.getBaseWeights(strategy, phase);
        if (!baseWeights) {
            console.warn(`No weights found for ${strategy}/${phase}, using default`);
            return this.calculateDefaultScore(features);
        }

        // ۲. اعمال ضریب سطح دشواری
        const adjustedWeights = this.applyDifficultyMultiplier(baseWeights, difficulty);

        // ۳. محاسبه امتیاز خام با جزئیات
        const { score: rawScore, details } = this.calculateRawScoreWithDetails(features, adjustedWeights);

        // ۴. اعمال نویز برای سطوح پایین‌تر (اختیاری)
        const finalScore = rawScore;

        // نمایش جزئیات در صورت درخواست
        if (showDetails) {
            console.log('===== جزئیات محاسبه امتیاز =====');
            console.log(`استراتژی: ${strategy}`);
            console.log(`فاز: ${phase}`);
            console.log(`سطح دشواری: ${difficulty}`);
            console.log('\nوزن‌های تعدیل شده:');
            console.table(adjustedWeights);
            console.log('\nامتیاز هر بخش:');
            console.table(details);
            console.log(`امتیاز نهایی): ${finalScore}`);
            console.log('================================\n');
        }

        return finalScore;
    },

    /**
     * محاسبه امتیاز خام به همراه جزئیات هر بخش
     */
    calculateRawScoreWithDetails(features, weights) {
        let score = 0;
        const details = {};

        // وزن‌های پایه
        const pipScore = (features.pipCount?.pipDiff || 0) * (weights.pipCount || 0);
        score += pipScore;
        details.pipCount = pipScore;

        const blotScore = (features.blot?.blotDiff || 0) * (weights.blots || 0);
        score += blotScore;
        details.blots = blotScore;

        const closedScore = (features.closedPoints?.closedDiff || 0) * (weights.closedPoints || 0);
        score += closedScore;
        details.closedPoints = closedScore;

        const riskScore = (features.blot?.totalRisk || 0) * (weights.risk || 0);
        score += riskScore;
        details.risk = riskScore;

        const primeScore = (features.prime?.primeDiff || 0) * (weights.primes || 0);
        score += primeScore;
        details.primes = primeScore;

        const hitScore = (features.attack?.totalHitValue || 0) * (weights.hits || 0);
        score += hitScore;
        details.hits = hitScore;

        const stackingScore = (features.structure?.stackingPenalty || 0) * (weights.stackingPenalty || 0);
        score += stackingScore;
        details.stackingPenalty = stackingScore;

        // وزن‌های اختصاصی استراتژی‌ها
        if (weights.homeBoardStrength) {
            const homeScore = (features.closedPoints?.myClosedCount || 0) * weights.homeBoardStrength;
            score += homeScore;
            details.homeBoardStrength = homeScore;
        }

        if (weights.opponentOnBar) {
            const oppBarScore = (features.attack?.opponentOnBar || 0) * weights.opponentOnBar;
            score += oppBarScore;
            details.opponentOnBar = oppBarScore;
        }

        if (weights.anchorStrength) {
            const anchorScore = (features.defense?.anchors?.length || 0) * weights.anchorStrength;
            score += anchorScore;
            details.anchorStrength = anchorScore;
        }

        if (weights.primeExtensionValue) {
            const primeExtScore = (features.prime?.myMaxPrimeLength || 0) * weights.primeExtensionValue;
            score += primeExtScore;
            details.primeExtensionValue = primeExtScore;
        }

        if (weights.blockingValue) {
            const blockingScore = (features.prime?.oppMaxPrimeLength || 0) * -weights.blockingValue;
            score += blockingScore;
            details.blockingValue = blockingScore;
        }

        if (weights.wastage) {
            const myWastage = (features.pipCount?.effectivePips || 0) - (features.pipCount?.myPips || 0);
            const wastageScore = myWastage * weights.wastage;
            score += wastageScore;
            details.wastage = wastageScore;
        }

        if (weights.contactAvoidance) {
            const inContact = (features.blot?.myBlots || 0) > 0 || (features.blot?.oppBlots || 0) > 0;
            const contactScore = (inContact ? -1 : 1) * weights.contactAvoidance;
            score += contactScore;
            details.contactAvoidance = contactScore;
        }

        if (weights.bearoffEfficiency) {
            const effScore = (features.bearoff?.diceUtilization || 0) * weights.bearoffEfficiency;
            const distScore = (features.bearoff?.averageDistance || 0) * -weights.bearoffEfficiency;
            score += effScore + distScore;
            details.bearoffEfficiency = effScore;
            details.averageDistance = distScore;
        }

        if (weights.flexibility) {
            const flexScore = (features.structure?.flexibility || 0) * weights.flexibility;
            score += flexScore;
            details.flexibility = flexScore;
        }

        if (weights.connectivity) {
            const connScore = (features.structure?.connectivity || 0) * weights.connectivity;
            score += connScore;
            details.connectivity = connScore;
        }

        if (weights.timingValue) {
            const timingScore = (features.metadata?.timing || 0) * weights.timingValue;
            score += timingScore;
            details.timingValue = timingScore;
        }

        if (weights.anchorCount) {
            const anchorCountScore = (features.defense?.anchors?.length || 0) * weights.anchorCount;
            score += anchorCountScore;
            details.anchorCount = anchorCountScore;
        }

        if (weights.hittingNumbers) {
            const hitNumScore = (features.attack?.directHits || 0) * weights.hittingNumbers;
            score += hitNumScore;
            details.hittingNumbers = hitNumScore;
        }

        if (weights.hitAndContain) {
            const hitContainScore = (features.attack?.directHits || 0) * weights.hitAndContain;
            const containScore = (features.attack?.opponentOnBar || 0) * weights.hitAndContain * 0.5;
            score += hitContainScore + containScore;
            details.hitAndContain = hitContainScore;
            details.containment = containScore;
        }

        if (weights.containmentValue) {
            const containScore = (features.defense?.anchors?.length || 0) * weights.containmentValue * 0.3;
            score += containScore;
            details.containmentValue = containScore;
        }

        if (weights.safety) {
            const safetyScore = -(features.blot?.myBlots || 0) * weights.safety * 0.5;
            score += safetyScore;
            details.safety = safetyScore;
        }

        if (weights.diceUtilization) {
            const diceScore = (features.bearoff?.diceUtilization || 0) * weights.diceUtilization;
            score += diceScore;
            details.diceUtilization = diceScore;
        }

        if (weights.averageDistance) {
            const avgDistScore = (features.bearoff?.averageDistance || 0) * (weights.averageDistance || 0);
            score += avgDistScore;
            details.averageDistanceWeighted = avgDistScore;
        }

        if (weights.desperateEscape) {
            const escapeScore = (features.defense?.backCheckers || 0) * weights.desperateEscape * 0.5;
            score += escapeScore;
            details.desperateEscape = escapeScore;
        }

        if (weights.savingGammon) {
            const gammonScore = (features.blot?.oppBlots || 0) * weights.savingGammon * 0.3;
            score += gammonScore;
            details.savingGammon = gammonScore;
        }

        if (weights.counterPlay) {
            const counterScore = ((features.blot?.oppBlots || 0) * 0.3 + (features.closedPoints?.myClosedCount || 0) * 0.1) * weights.counterPlay;
            score += counterScore;
            details.counterPlay = counterScore;
        }

        if (weights.escapePotential) {
            const escapePotScore = (features.defense?.escapeRoutes || 0) * weights.escapePotential * 0.2;
            score += escapePotScore;
            details.escapePotential = escapePotScore;
        }

        if (weights.bearoffPrep) {
            const remaining = features.bearoff?.remainingCheckers || 0;
            const avgDist = features.bearoff?.averageDistance || 0;
            const prepScore = (15 - remaining) * weights.bearoffPrep * 0.3 - avgDist * weights.bearoffPrep * 0.1;
            score += prepScore;
            details.bearoffPrep = prepScore;
        }

        if (weights.safetyInHome) {
            const safetyHomeScore = -(features.blot?.myBlots || 0) * weights.safetyInHome * 0.4;
            score += safetyHomeScore;
            details.safetyInHome = safetyHomeScore;
        }

        if (weights.gapControl) {
            const myClosed = features.closedPoints?.myClosedCount || 0;
            const oppClosed = features.closedPoints?.oppClosedCount || 0;
            const gapScore = (myClosed - oppClosed) * weights.gapControl * 0.2;
            score += gapScore;
            details.gapControl = gapScore;
        }

        return { score, details };
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