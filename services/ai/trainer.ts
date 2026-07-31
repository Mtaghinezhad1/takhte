// ============================================
// trainer.ts - نسخه اصلاح‌شده با جهش قوی‌تر
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
        this.bestAccuracy = 0;
    }

    // ============================================
    // ۱. اضافه کردن داده آموزشی
    // ============================================
    addTrainingData(board, dice, turn, bestMoves, strategy, phase) {
        this.trainingData.push({
            board: JSON.parse(JSON.stringify(board)),
            dice: [...dice],
            turn: turn,
            bestMoves: bestMoves.map(m => ({ ...m })),
            strategy: strategy,
            phase: phase
        });
    }

    // ============================================
    // ۲. بارگذاری داده از JSON
    // ============================================
    loadTrainingDataFromJSON(jsonData) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        for (const item of data) {
            this.addTrainingData(
                item.board,
                item.dice,
                item.turn,
                item.bestMoves,
                item.strategy,
                item.phase
            );
        }
        
        console.log(`✅ ${this.trainingData.length} نمونه آموزشی بارگذاری شد`);
    }

    // ============================================
    // ۳. محاسبه دقت (Accuracy)
    // ============================================
    calculateAccuracy(sample, weights) {
        const { board, dice, turn, bestMoves, strategy, phase } = sample;
        
        const allMoves = getAvailableMoves(board, dice, turn);
        if (allMoves.length === 0) return 1;
        
        const customWeights = weights[strategy]?.[phase];
        if (!customWeights) return 0;
        
        const bestMoveFromAI = aiService.selectBestMove(
            board, 
            dice, 
            allMoves, 
            turn, 
            '10',
            null,
            customWeights
        );
        
        return this.compareMoves(bestMoveFromAI, bestMoves) ? 1 : 0;
    }

    // ============================================
    // ۴. مقایسه دو حرکت
    // ============================================
    compareMoves(move1, move2) {
        if (!move1 || !move2) return false;
        if (move1.length !== move2.length) return false;
        
        const sorted1 = [...move1].sort((a, b) => a.from - b.from || a.die - b.die);
        const sorted2 = [...move2].sort((a, b) => a.from - b.from || a.die - b.die);
        
        for (let i = 0; i < sorted1.length; i++) {
            if (sorted1[i].from !== sorted2[i].from || 
                sorted1[i].to !== sorted2[i].to || 
                sorted1[i].die !== sorted2[i].die) {
                return false;
            }
        }
        
        return true;
    }

    // ============================================
    // ۵. محاسبه دقت کل
    // ============================================
    getOverallAccuracy(weights) {
        if (this.trainingData.length === 0) return 0;
        
        let correct = 0;
        for (const sample of this.trainingData) {
            correct += this.calculateAccuracy(sample, weights);
        }
        
        return correct / this.trainingData.length;
    }

    // ============================================
    // ۶. آموزش با بهینه‌سازی تکاملی (نسخه اصلاح‌شده)
    // ============================================
    train(iterations = 100, populationSize = 30) {
        console.log('🧠 شروع آموزش...');
        console.log(`📊 ${this.trainingData.length} نمونه آموزشی`);
        console.log(`👥 جمعیت: ${populationSize} | نسل‌ها: ${iterations}`);
        
        if (this.trainingData.length === 0) {
            console.log('❌ هیچ داده آموزشی وجود ندارد!');
            return null;
        }
        
        let bestWeights = JSON.parse(JSON.stringify(this.weights));
        let bestAccuracy = this.getOverallAccuracy(bestWeights);
        this.bestAccuracy = bestAccuracy;
        
        console.log(`📈 دقت اولیه: ${(bestAccuracy * 100).toFixed(2)}%`);
        
        // اگر دقت اولیه ۱۰۰٪ بود، نیازی به آموزش نیست
        if (bestAccuracy === 1) {
            console.log('✅ دقت ۱۰۰٪! نیازی به آموزش نیست.');
            return bestWeights;
        }
        
        let noImprovementCount = 0;
        
        for (let iter = 0; iter < iterations; iter++) {
            const population = [];
            const progress = iter / iterations;
            
            // ایجاد جمعیت با جهش قوی‌تر
            for (let i = 0; i < populationSize; i++) {
                // چندین نوع جهش مختلف
                let mutant;
                if (i < populationSize * 0.3) {
                    // جهش قوی (۳۰٪ جمعیت)
                    mutant = this.mutateWeightsStrong(bestWeights, progress);
                } else if (i < populationSize * 0.6) {
                    // جهش متوسط (۳۰٪ جمعیت)
                    mutant = this.mutateWeightsMedium(bestWeights, progress);
                } else {
                    // جهش ضعیف (۴۰٪ جمعیت) - برای حفظ تنوع
                    mutant = this.mutateWeightsWeak(bestWeights, progress);
                }
                population.push(mutant);
            }
            
            // اضافه کردن خود bestWeights به جمعیت (برای حفظ بهترین)
            population.push(JSON.parse(JSON.stringify(bestWeights)));
            
            // ارزیابی هر عضو
            const scores = [];
            for (const individual of population) {
                const accuracy = this.getOverallAccuracy(individual);
                scores.push({ weights: individual, accuracy: accuracy });
            }
            
            // مرتب‌سازی بر اساس دقت
            scores.sort((a, b) => b.accuracy - a.accuracy);
            
            // به‌روزرسانی بهترین
            if (scores[0].accuracy > bestAccuracy) {
                const improvement = (scores[0].accuracy - bestAccuracy) * 100;
                bestAccuracy = scores[0].accuracy;
                bestWeights = JSON.parse(JSON.stringify(scores[0].weights));
                this.bestAccuracy = bestAccuracy;
                noImprovementCount = 0;
                
                console.log(`🔄 نسل ${iter + 1}: دقت = ${(bestAccuracy * 100).toFixed(2)}% (${improvement.toFixed(2)}% بهبود)`);
                this.showWeightChanges(bestWeights, `تغییرات نسل ${iter + 1}`);
            } else {
                noImprovementCount++;
            }
            
            // اگر ۲۰ نسل متوالی بهبود نداشت، جهش را افزایش بده
            if (noImprovementCount > 20) {
                console.log(`⚠️ ${noImprovementCount} نسل بدون بهبود - افزایش نرخ جهش...`);
                // چند عضو با جهش بسیار قوی اضافه کن
                for (let i = 0; i < 5; i++) {
                    const extremeMutant = this.mutateWeightsExtreme(bestWeights);
                    const accuracy = this.getOverallAccuracy(extremeMutant);
                    if (accuracy > bestAccuracy) {
                        bestAccuracy = accuracy;
                        bestWeights = JSON.parse(JSON.stringify(extremeMutant));
                        this.bestAccuracy = bestAccuracy;
                        console.log(`💥 جهش شدید! دقت جدید: ${(bestAccuracy * 100).toFixed(2)}%`);
                        break;
                    }
                }
                noImprovementCount = 0;
            }
            
            // گزارش هر ۱۰ نسل
            if ((iter + 1) % 10 === 0) {
                console.log(`📊 نسل ${iter + 1}/${iterations} - بهترین دقت: ${(bestAccuracy * 100).toFixed(2)}%`);
                this.history.push({ 
                    iteration: iter + 1, 
                    accuracy: bestAccuracy,
                    accuracyPercent: (bestAccuracy * 100).toFixed(2)
                });
            }
        }
        
        console.log('✅ آموزش کامل شد!');
        console.log(`🏆 بهترین دقت: ${(bestAccuracy * 100).toFixed(2)}%`);
        console.log(`📊 تعداد نمونه‌های درست: ${Math.round(bestAccuracy * this.trainingData.length)} از ${this.trainingData.length}`);
        
        this.showWeightChanges(bestWeights, 'وزن‌های نهایی');
        
        this.weights = bestWeights;
        return bestWeights;
    }

    // ============================================
    // ۷. انواع جهش‌ها
    // ============================================
    
    // جهش قوی - تغییرات بزرگ
    mutateWeightsStrong(weights, progress) {
        const mutant = JSON.parse(JSON.stringify(weights));
        const mutationRate = 0.6; // ۶۰٪ شانس تغییر
        const mutationScale = 1.5; // دامنه تغییر بزرگ
        
        for (const strategy of Object.keys(mutant)) {
            for (const phase of Object.keys(mutant[strategy])) {
                const phaseWeights = mutant[strategy][phase];
                for (const key of Object.keys(phaseWeights)) {
                    if (Math.random() < mutationRate) {
                        const change = (Math.random() - 0.5) * mutationScale * 2;
                        phaseWeights[key] = Math.max(-3, Math.min(5, phaseWeights[key] + change));
                    }
                }
            }
        }
        return mutant;
    }

    // جهش متوسط
    mutateWeightsMedium(weights, progress) {
        const mutant = JSON.parse(JSON.stringify(weights));
        const mutationRate = 0.4;
        const mutationScale = 0.8;
        
        for (const strategy of Object.keys(mutant)) {
            for (const phase of Object.keys(mutant[strategy])) {
                const phaseWeights = mutant[strategy][phase];
                for (const key of Object.keys(phaseWeights)) {
                    if (Math.random() < mutationRate) {
                        const change = (Math.random() - 0.5) * mutationScale;
                        phaseWeights[key] = Math.max(-3, Math.min(5, phaseWeights[key] + change));
                    }
                }
            }
        }
        return mutant;
    }

    // جهش ضعیف - تغییرات کوچک
    mutateWeightsWeak(weights, progress) {
        const mutant = JSON.parse(JSON.stringify(weights));
        const mutationRate = 0.2;
        const mutationScale = 0.3;
        
        for (const strategy of Object.keys(mutant)) {
            for (const phase of Object.keys(mutant[strategy])) {
                const phaseWeights = mutant[strategy][phase];
                for (const key of Object.keys(phaseWeights)) {
                    if (Math.random() < mutationRate) {
                        const change = (Math.random() - 0.5) * mutationScale;
                        phaseWeights[key] = Math.max(-3, Math.min(5, phaseWeights[key] + change));
                    }
                }
            }
        }
        return mutant;
    }

    // جهش بسیار شدید - برای مواقعی که الگوریتم گیر کرده
    mutateWeightsExtreme(weights) {
        const mutant = JSON.parse(JSON.stringify(weights));
        const mutationRate = 0.8;
        const mutationScale = 3.0;
        
        for (const strategy of Object.keys(mutant)) {
            for (const phase of Object.keys(mutant[strategy])) {
                const phaseWeights = mutant[strategy][phase];
                for (const key of Object.keys(phaseWeights)) {
                    if (Math.random() < mutationRate) {
                        const change = (Math.random() - 0.5) * mutationScale;
                        phaseWeights[key] = Math.max(-5, Math.min(7, phaseWeights[key] + change));
                    }
                }
            }
        }
        return mutant;
    }

    // ============================================
    // ۸. نمایش تغییرات وزن‌ها
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
                            console.log(`    ${key}: ${origValue.toFixed(3)} → ${newValue.toFixed(3)} (${diff > 0 ? '+' : ''}${diff.toFixed(3)})`);
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
            console.log('  ⚠️ ⚠️ ⚠️ هیچ تغییری در وزن‌ها مشاهده نشد!');
            console.log('  دلیل: نرخ جهش خیلی کم یا داده‌های آموزشی مشکل دارند');
        }
    }

    // ============================================
    // ۹. ارزیابی روی داده‌های تست
    // ============================================
    evaluateOnTestData(testData) {
        if (!testData || testData.length === 0) {
            console.log('❌ داده تست وجود ندارد');
            return null;
        }
        
        const tempData = this.trainingData;
        this.trainingData = testData;
        const accuracy = this.getOverallAccuracy(this.weights);
        this.trainingData = tempData;
        
        console.log(`📊 دقت روی داده تست: ${(accuracy * 100).toFixed(2)}%`);
        return accuracy;
    }

    // ============================================
    // ۱۰. ذخیره و بارگذاری
    // ============================================
    saveWeights() {
        return JSON.stringify(this.weights, null, 2);
    }

    loadWeights(weightsJson) {
        this.weights = typeof weightsJson === 'string' ? 
            JSON.parse(weightsJson) : weightsJson;
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
        const accuracy = this.getOverallAccuracy(this.weights);
        console.log('📊 خلاصه آموزش:');
        console.log(`   تعداد نمونه‌ها: ${this.trainingData.length}`);
        console.log(`   دقت نهایی: ${(accuracy * 100).toFixed(2)}%`);
        console.log(`   تعداد درست: ${Math.round(accuracy * this.trainingData.length)} از ${this.trainingData.length}`);
        console.log(`   بهترین دقت ثبت‌شده: ${(this.bestAccuracy * 100).toFixed(2)}%`);
    }
}

export const trainer = new BackgammonAITrainer();