import { AI_LEVELS, STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';

export const scoreCalculator = {
    calculateScore(features, strategy, phase, difficulty = '5', showDetails = false) {
        const weights = this.getWeights(strategy, phase);
        if (!weights) {
            return this.calculateDefaultScore(features);
        }

        const rawScore = this.calculateRawScore(features, weights, showDetails);

        if (showDetails) {
            this.printDetails(features, weights, rawScore, strategy, phase, difficulty);
        }

        return rawScore;
    },

    getWeights(strategy, phase) {
        return STRATEGY_PHASE_WEIGHTS[strategy]?.[phase] || null;
    },

    getNoiseLevel(difficulty) {
        const level = AI_LEVELS[difficulty];
        return level?.noise ?? 0.3;
    },

    applyNoise(score, difficulty = '5') {
        const noiseLevel = this.getNoiseLevel(difficulty);
        if (noiseLevel <= 0) return score;
        return score * (1 + (Math.random() - 0.5) * noiseLevel);
    },

    calculateRawScore(features, weights, showDetails = false) {
        let score = 0;


        if (weights.blots !== undefined) {
            score += (features.blot?.blotDiff || 0) * weights.blots;
            if (showDetails) console.log('blot', (features.blot?.blotDiff || 0) * weights.blots)
        }
        if (weights.closedPoints !== undefined) {
            score += (features.closedPoints?.closedDiff || 0) * weights.closedPoints;
            if (showDetails) console.log('closedPoint', (features.closedPoints?.closedDiff || 0) * weights.closedPoints)
        }
        if (weights.risk !== undefined) {
            score += (features.blot?.totalRisk || 0) * weights.risk;
            if (showDetails) console.log('totalRisk', (features.blot?.totalRisk || 0) * weights.risk)
        }
        if (weights.primes !== undefined) {
            score += (features.prime?.primeDiff || 0) * weights.primes;
            if (showDetails) console.log('prime', (features.prime?.primeDiff || 0) * weights.primes)
        }
        if (weights.hits !== undefined) {
            score += (features.attack?.totalHitValue || 0) * weights.hits;
            if (showDetails) console.log('hits', (features.attack?.totalHitValue || 0) * weights.hits)
        }

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
            primeExtensionValue: features.prime?.myMaxPrimeValue || 0,
            blockingValue: -(features.prime?.oppMaxPrimeValue || 0),
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
                if (showDetails) console.log(key, specialFeatures[key] * weights[key])
            }
        }

        return score;
    },

    calculateDefaultScore(features) {
        return (
            (features.blot?.blotDiff || 0) * 0.3 +
            (features.closedPoints?.closedDiff || 0) * 0.4 +
            (features.blot?.totalRisk || 0) * -0.2 +
            (features.attack?.totalHitValue || 0) * 0.1
        );
    },

    printDetails(features, weights, rawScore, strategy, phase, difficulty) {
        console.log('===== calcucate score details =====');
        console.log(`strategy: ${strategy}`);
        console.log(`phase: ${phase}`);
        console.log(`difficulty: ${difficulty}`);
        console.log(`(noise in selectBestMove): ${this.getNoiseLevel(difficulty)}`);
        console.log(`raw score: ${rawScore.toFixed(2)}`);
        console.log('================================\n');
    }
};