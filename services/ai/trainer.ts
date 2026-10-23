// ============================================
// trainer.ts - نسخه با سیستم امتیازدهی
// ============================================

import { STRATEGY_PHASE_WEIGHTS } from '@/constants/aiWeights';
import { getAvailableMoves } from '@/utils/availableMoves';
import { aiService } from './aiService';

class BackgammonAITrainer {
    constructor() {
        this.originalWeights = JSON.parse(JSON.stringify(STRATEGY_PHASE_WEIGHTS));
        this.weights = JSON.parse(JSON.stringify(STRATEGY_PHASE_WEIGHTS));
        this.trainingData = [];
        this.history = [];
        this.bestNormalizedScore = 0;
        this.bestRawScore = 0;
    }

    // ============================================
    // ۱. اضافه کردن داده آموزشی
    // ============================================
    addTrainingData(sampleOrBoard, dice, turn, bestMoves) {
        let sample;

        // ✅ تشخیص فرمت قدیمی (board, dice, turn, bestMoves)
        if (
            Array.isArray(sampleOrBoard) &&
            Array.isArray(dice) &&
            typeof turn === 'string' &&
            Array.isArray(bestMoves)
        ) {
            console.warn(
                '⚠️ فرمت قدیمی شناسایی شد. لطفاً به فرمت جدید (bestMoves1/scoreBestMoves1) مهاجرت کنید.'
            );
            sample = {
                board: JSON.parse(JSON.stringify(sampleOrBoard)),
                dice: [...dice],
                turn,
                bestMoves1: JSON.parse(JSON.stringify(bestMoves)),
                scoreBestMoves1: 1.0,
            };
        } else {
            // ✅ فرمت جدید
            sample = JSON.parse(JSON.stringify(sampleOrBoard));

            // پشتیبانی از فیلد قدیمی bestMoves داخل شیء
            if (!sample.bestMoves1 && sample.bestMoves) {
                sample.bestMoves1 = sample.bestMoves;
                sample.scoreBestMoves1 = 1.0;
                delete sample.bestMoves;
            }
        }

        if (!sample.bestMoves1) {
            console.warn('⚠️ نمونه بدون bestMoves1 نادیده گرفته شد');
            return;
        }

        this.trainingData.push(sample);
    }

    // ============================================
    // ۲. بارگذاری از JSON
    // ============================================
    loadTrainingDataFromJSON(jsonData) {
        this.trainingData = [];
        this.history = [];
        this.bestNormalizedScore = 0;
        this.bestRawScore = 0;

        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        for (const item of data) {
            this.addTrainingData(item);
        }

        console.log(`✅ ${this.trainingData.length} نمونه آموزشی بارگذاری شد`);
    }

    // ============================================
    // ۳. استخراج همه کاندیدهای یک نمونه
    // ============================================
    collectCandidates(sample) {
        const candidates = [];
        let i = 1;

        while (sample[`bestMoves${i}`] !== undefined) {
            const score = sample[`scoreBestMoves${i}`];
            if (score === undefined) {
                console.warn(
                    `⚠️ scoreBestMoves${i} تعریف نشده، مقدار 0 استفاده می‌شود`
                );
            }
            candidates.push({
                moves: sample[`bestMoves${i}`],
                score: score ?? 0,
            });
            i++;
        }

        return candidates;
    }

    // ============================================
    // ۴. حداکثر امتیاز ممکن برای یک نمونه (برای نرمال‌سازی)
    // ============================================
    getMaxScoreForSample(sample) {
        const candidates = this.collectCandidates(sample);
        if (candidates.length === 0) return 0;
        return Math.max(...candidates.map((c) => c.score));
    }

    // ============================================
    // ۵. محاسبه امتیاز یک نمونه با وزن‌های داده‌شده
    // ============================================
    calculateSampleScore(sample, weights) {
        const { board, dice, turn } = sample;
        const candidates = this.collectCandidates(sample);
        if (candidates.length === 0) return 0;

        const allMoves = getAvailableMoves(board, dice, turn);
        if (!allMoves || allMoves.length === 0) return 0;

        // ✅ AI بهترین حرکت خودش را انتخاب می‌کند
        const aiBestMove = aiService.selectBestMove(
            board,
            dice,
            allMoves,
            turn,
            '10',   // سطح بدون نویز
            null,   // strategyInfo → خودش تشخیص می‌دهد
            weights // وزن‌های سفارشی
        );

        if (!aiBestMove) return 0;

        // ✅ جستجو برای تطبیق، انتخاب بالاترین امتیاز در صورت چند تطبیق
        let bestMatchScore = -1;
        for (const candidate of candidates) {
            if (this.compareMoves(aiBestMove, candidate.moves)) {
                bestMatchScore = Math.max(bestMatchScore, candidate.score);
            }
        }

        // اگر تطبیق پیدا نشد → 0
        return bestMatchScore >= 0 ? bestMatchScore : -0.5;
    }

    // ============================================
    // ۶. محاسبه امتیاز کل (مجموع امتیازات + نرمال‌شده)
    // ============================================
    getOverallScore(weights) {
        if (this.trainingData.length === 0) {
            return { rawScore: 0, maxScore: 0, normalized: 0 };
        }

        let rawScore = 0;
        let maxScore = 0;

        for (const sample of this.trainingData) {
            rawScore += this.calculateSampleScore(sample, weights);
            maxScore += this.getMaxScoreForSample(sample);
        }

        return {
            rawScore,
            maxScore,
            normalized: maxScore > 0 ? rawScore / maxScore : 0,
        };
    }

    // ============================================
    // ۷. مقایسه دو توالی حرکت
    // ============================================
    compareMoves(move1, move2) {
        if (!move1 || !move2) return false;
        if (move1.length !== move2.length) return false;

        const sorted1 = [...move1].sort(
            (a, b) => a.from - b.from || a.die - b.die
        );
        const sorted2 = [...move2].sort(
            (a, b) => a.from - b.from || a.die - b.die
        );

        for (let i = 0; i < sorted1.length; i++) {
            if (
                sorted1[i].from !== sorted2[i].from ||
                sorted1[i].to !== sorted2[i].to ||
                sorted1[i].die !== sorted2[i].die
            ) {
                return false;
            }
        }

        return true;
    }

    // ============================================
    // ۸. آموزش با بهینه‌سازی تکاملی
    // ============================================
    train(iterations = 100, populationSize = 30) {
        console.log('🧠 شروع آموزش...');
        console.log(`📊 ${this.trainingData.length} نمونه آموزشی`);
        console.log(`👥 جمعیت: ${populationSize} | نسل‌ها: ${iterations}`);

        if (this.trainingData.length === 0) {
            console.log('❌ هیچ داده آموزشی وجود ندارد!');
            return null;
        }

        // ✅ maxScore ثابت است (وابسته به داده، نه وزن)
        let bestWeights = JSON.parse(JSON.stringify(this.weights));
        let initialResult = this.getOverallScore(bestWeights);
        const maxPossibleScore = initialResult.maxScore;
        let bestRaw = initialResult.rawScore;
        let bestNormalized = initialResult.normalized;

        this.bestRawScore = bestRaw;
        this.bestNormalizedScore = bestNormalized;

        console.log(
            `📈 امتیاز اولیه: ${bestRaw.toFixed(2)} / ${maxPossibleScore.toFixed(2)} (${(bestNormalized * 100).toFixed(2)}%)`
        );

        if (bestNormalized >= 0.9999) {
            console.log('✅ امتیاز ۱۰۰٪! نیازی به آموزش نیست.');
            return bestWeights;
        }

        let noImprovementCount = 0;

        for (let iter = 0; iter < iterations; iter++) {
            const population = [];

            // ایجاد جمعیت با جهش‌های متفاوت
            for (let i = 0; i < populationSize; i++) {
                let mutant;
                if (i < populationSize * 0.3) {
                    mutant = this.mutateWeightsStrong(bestWeights);
                } else if (i < populationSize * 0.6) {
                    mutant = this.mutateWeightsMedium(bestWeights);
                } else {
                    mutant = this.mutateWeightsWeak(bestWeights);
                }
                population.push(mutant);
            }

            // افزودن بهترین فعلی (حفظ نخبه)
            population.push(JSON.parse(JSON.stringify(bestWeights)));

            // ارزیابی
            const scored = population.map((w) => ({
                weights: w,
                result: this.getOverallScore(w),
            }));

            // مرتب‌سازی بر اساس امتیاز نرمال‌شده
            scored.sort((a, b) => b.result.normalized - a.result.normalized);

            if (scored[0].result.normalized > bestNormalized) {
                const improvement =
                    (scored[0].result.normalized - bestNormalized) * 100;
                bestNormalized = scored[0].result.normalized;
                bestRaw = scored[0].result.rawScore;
                bestWeights = JSON.parse(JSON.stringify(scored[0].weights));
                this.bestNormalizedScore = bestNormalized;
                this.bestRawScore = bestRaw;
                noImprovementCount = 0;

                console.log(
                    `🔄 نسل ${iter + 1}: امتیاز = ${bestRaw.toFixed(2)} / ${maxPossibleScore.toFixed(2)} (${(bestNormalized * 100).toFixed(2)}%) (+${improvement.toFixed(2)}%)`
                );
                this.showWeightChanges(
                    bestWeights,
                    `تغییرات نسل ${iter + 1}`
                );
            } else {
                noImprovementCount++;
            }

            // جهش شدید در صورت رکود
            if (noImprovementCount > 20) {
                console.log(
                    `⚠️ ${noImprovementCount} نسل بدون بهبود - افزایش نرخ جهش...`
                );
                for (let i = 0; i < 5; i++) {
                    const extremeMutant = this.mutateWeightsExtreme(bestWeights);
                    const result = this.getOverallScore(extremeMutant);
                    if (result.normalized > bestNormalized) {
                        bestNormalized = result.normalized;
                        bestRaw = result.rawScore;
                        bestWeights = JSON.parse(
                            JSON.stringify(extremeMutant)
                        );
                        this.bestNormalizedScore = bestNormalized;
                        this.bestRawScore = bestRaw;
                        console.log(
                            `💥 جهش شدید! امتیاز جدید: ${bestRaw.toFixed(2)} / ${maxPossibleScore.toFixed(2)} (${(bestNormalized * 100).toFixed(2)}%)`
                        );
                        break;
                    }
                }
                noImprovementCount = 0;
            }

            // گزارش هر ۱۰ نسل
            if ((iter + 1) % 10 === 0) {
                console.log(
                    `📊 نسل ${iter + 1}/${iterations} - بهترین امتیاز: ${bestRaw.toFixed(2)} / ${maxPossibleScore.toFixed(2)} (${(bestNormalized * 100).toFixed(2)}%)`
                );
                this.history.push({
                    iteration: iter + 1,
                    rawScore: bestRaw,
                    maxScore: maxPossibleScore,
                    normalized: bestNormalized,
                    normalizedPercent: (bestNormalized * 100).toFixed(2),
                });
            }
        }

        console.log('✅ آموزش کامل شد!');
        console.log(
            `🏆 بهترین امتیاز: ${bestRaw.toFixed(2)} / ${maxPossibleScore.toFixed(2)} (${(bestNormalized * 100).toFixed(2)}%)`
        );

        this.showWeightChanges(bestWeights, 'وزن‌های نهایی');

        this.weights = bestWeights;
        return bestWeights;
    }

    // ============================================
    // ۹. انواع جهش
    // ============================================
    mutateWeightsStrong(weights) {
        return this._mutate(weights, 0.6, 1.5, -3, 5);
    }

    mutateWeightsMedium(weights) {
        return this._mutate(weights, 0.4, 0.8, -3, 5);
    }

    mutateWeightsWeak(weights) {
        return this._mutate(weights, 0.2, 0.3, -3, 5);
    }

    mutateWeightsExtreme(weights) {
        return this._mutate(weights, 0.8, 3.0, -5, 7);
    }

    _mutate(weights, rate, scale, min, max) {
        const mutant = JSON.parse(JSON.stringify(weights));

        for (const strategy of Object.keys(mutant)) {
            for (const phase of Object.keys(mutant[strategy])) {
                const phaseWeights = mutant[strategy][phase];
                for (const key of Object.keys(phaseWeights)) {
                    if (Math.random() < rate) {
                        const change = (Math.random() - 0.5) * scale * 2;
                        phaseWeights[key] = Math.max(
                            min,
                            Math.min(max, phaseWeights[key] + change)
                        );
                    }
                }
            }
        }

        return mutant;
    }

    // ============================================
    // ۱۰. نمایش تغییرات وزن‌ها
    // ============================================
    showWeightChanges(newWeights, label = '') {
        console.log(`\n📊 ${label}:`);

        let totalDiff = 0;
        let count = 0;
        const changes = [];

        for (const strategy of Object.keys(newWeights)) {
            for (const phase of Object.keys(newWeights[strategy])) {
                const origWeights = this.originalWeights[strategy]?.[phase];
                const newPhaseWeights = newWeights[strategy][phase];

                if (origWeights) {
                    let hasChange = false;
                    for (const key of Object.keys(newPhaseWeights)) {
                        const origValue = origWeights[key] || 0;
                        const newValue = newPhaseWeights[key];
                        const diff = newValue - origValue;

                        if (Math.abs(diff) > 0.001) {
                            if (!hasChange) {
                                console.log(`\n  ${strategy} - ${phase}:`);
                                hasChange = true;
                            }
                            console.log(
                                `    ${key}: ${origValue.toFixed(3)} → ${newValue.toFixed(3)} (${diff > 0 ? '+' : ''}${diff.toFixed(3)})`
                            );
                            changes.push({ strategy, phase, key, diff });
                        }
                        totalDiff += Math.abs(diff);
                        count++;
                    }
                }
            }
        }

        const avgDiff = count > 0 ? totalDiff / count : 0;
        console.log(`\n  📈 میانگین تغییر: ${avgDiff.toFixed(4)}`);
        console.log(`  📈 تعداد تغییرات: ${changes.length} از ${count}`);

        if (changes.length === 0) {
            console.log('  ⚠️ هیچ تغییری در وزن‌ها مشاهده نشد!');
        }
    }

    // ============================================
    // ۱۱. ارزیابی روی داده تست
    // ============================================
    evaluateOnTestData(testData) {
        if (!testData || testData.length === 0) {
            console.log('❌ داده تست وجود ندارد');
            return null;
        }

        const tempData = this.trainingData;
        this.trainingData = testData.map((s) =>
            JSON.parse(JSON.stringify(s))
        );
        const result = this.getOverallScore(this.weights);
        this.trainingData = tempData;

        console.log(
            `📊 امتیاز روی داده تست: ${result.rawScore.toFixed(2)} / ${result.maxScore.toFixed(2)} (${(result.normalized * 100).toFixed(2)}%)`
        );
        return result;
    }

    // ============================================
    // ۱۲. ذخیره و بارگذاری
    // ============================================
    saveWeights() {
        return JSON.stringify(this.weights, null, 2);
    }

    loadWeights(weightsJson) {
        this.weights =
            typeof weightsJson === 'string'
                ? JSON.parse(weightsJson)
                : weightsJson;
        console.log('✅ وزن‌ها بارگذاری شدند');
    }

    printWeights() {
        console.log('📊 وزن‌های فعلی:');
        console.log(JSON.stringify(this.weights, null, 2));
    }

    printHistory() {
        console.log('📈 تاریخچه آموزش:');
        console.table(this.history);
    }

    printSummary() {
        const result = this.getOverallScore(this.weights);
        console.log('📊 خلاصه آموزش:');
        console.log(`   تعداد نمونه‌ها: ${this.trainingData.length}`);
        console.log(
            `   امتیاز کل: ${result.rawScore.toFixed(2)} / ${result.maxScore.toFixed(2)}`
        );
        console.log(`   درصد امتیاز: ${(result.normalized * 100).toFixed(2)}%`);
        console.log(
            `   بهترین امتیاز ثبت‌شده: ${(this.bestNormalizedScore * 100).toFixed(2)}%`
        );
    }
}

export const trainer = new BackgammonAITrainer();