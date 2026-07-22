// ==================== services/ai/featureExtractor.js ====================
import {
    calculateAverageDistance,
    calculateDiceUtilization,
    calculateStackingPenalty, checkerValueByPosition, countBlots,
    countPrimes,
    countRemainingCheckers,
    getBlotHitProbability,
    getClosedPointsValue,
    getHitValue
} from '@/utils/computerAI';
import { boardService } from '../boardService';

export const featureExtractor = {
    extractFeatures(board, color) {
        const opponent = color === 'white' ? 'black' : 'white';
        
        return {
            // ویژگی‌های پیپ کانت
            pipCount: this.extractPipFeatures(board, color, opponent),
            
            // ویژگی‌های بلات و ریسک
            blot: this.extractBlotFeatures(board, color, opponent),
            
            // ویژگی‌های نقاط بسته
            closedPoints: this.extractClosedPointFeatures(board, color, opponent),
            
            // ویژگی‌های پرایم
            prime: this.extractPrimeFeatures(board, color, opponent),
            
            // ویژگی‌های حمله
            attack: this.extractAttackFeatures(board, color),
            
            // ویژگی‌های دفاعی
            defense: this.extractDefenseFeatures(board, color, opponent),
            
            // ویژگی‌های ساختاری
            structure: this.extractStructureFeatures(board, color),
            
            // ویژگی‌های بیرون آوردن
            bearoff: this.extractBearoffFeatures(board, color),
            
            // متادیتا
            metadata: {
                color,
                phase: null, // توسط caller پر میشه
                turn: null
            }
        };
    },

    extractPipFeatures(board, color, opponent) {
        const myPips = boardService.pipCount(board, color);
        const oppPips = boardService.pipCount(board, opponent);
        
        return {
            myPips,
            oppPips,
            pipDiff: oppPips - myPips, // مثبت = ما جلوتریم
            pipRatio: oppPips / (myPips || 1),
            effectivePips: this.calculateEffectivePips(board, color)
        };
    },

    extractBlotFeatures(board, color, opponent) {
        const myBlots = countBlots(board, color);
        const oppBlots = countBlots(board, opponent);
        
        // محاسبه ریسک تجمعی
        let totalRisk = 0;
        let riskyBlots = 0;
        
        for (let i = 1; i <= 24; i++) {
            const count = board[i];
            if ((color === 'white' && count === 1) || (color === 'black' && count === -1)) {
                const hitProb = getBlotHitProbability(board, i, color);
                const checkerValue = checkerValueByPosition(i, color);
                totalRisk += hitProb * checkerValue;
                riskyBlots++;
            }
        }
        
        return {
            myBlots,
            oppBlots,
            blotDiff: oppBlots - myBlots,
            totalRisk,
            averageRisk: riskyBlots > 0 ? totalRisk / riskyBlots : 0,
            riskyBlotsCount: riskyBlots
        };
    },

    extractClosedPointFeatures(board, color, opponent) {
        const myValue = getClosedPointsValue(board, color);
        const oppValue = getClosedPointsValue(board, opponent);
        
        return {
            myClosedValue: myValue,
            oppClosedValue: oppValue,
            closedDiff: myValue - oppValue,
            myClosedCount: this.countTotalClosedPoints(board, color),
            oppClosedCount: this.countTotalClosedPoints(board, opponent),
        };
    },

    extractPrimeFeatures(board, color, opponent) {
        const myPrimes = countPrimes(board, color);
        const oppPrimes = countPrimes(board, opponent);
        
        return {
            myPrimes,
            oppPrimes,
            primeDiff: myPrimes - oppPrimes,
            myMaxPrimeLength: this.calculateMaxPrimeLength(board, color),
            oppMaxPrimeLength: this.calculateMaxPrimeLength(board, opponent)
        };
    },

    extractAttackFeatures(board, color) {
        const opponent = color === 'white' ? 'black' : 'white';
        
        // محاسبه قدرت حمله
        let directHits = 0;
        let potentialHits = 0;
        
        for (let i = 1; i <= 24; i++) {
            if ((color === 'white' && board[i] === -1) || (color === 'black' && board[i] === 1)) {
                const hitValue = getHitValue(i, color);
                directHits += hitValue;
            }
        }
        
        // مهره‌های حریف روی bar
        const opponentOnBar = opponent === 'white' ? 
            (board[0] < 0 ? Math.abs(board[0]) : 0) : 
            (board[25] > 0 ? board[25] : 0);
        
        return {
            directHits,
            potentialHits,
            opponentOnBar,
            totalHitValue: directHits + (opponentOnBar * 2) // حریف روی bar ارزش مضاعف داره
        };
    },

    extractDefenseFeatures(board, color, opponent) {
        return {
            anchors: this.findAnchors(board, color),
            hasAdvancedAnchor: this.hasAdvancedAnchor(board, color),
            escapeRoutes: this.countEscapeRoutes(board, color),
            backCheckers: this.countBackCheckers(board, color)
        };
    },

    extractStructureFeatures(board, color) {
        return {
            stackingPenalty: calculateStackingPenalty(board, color),
            flexibility: this.calculateFlexibility(board, color),
            connectivity: this.calculateConnectivity(board, color),
            distribution: this.calculateDistribution(board, color)
        };
    },

    extractBearoffFeatures(board, color) {
        return {
            remainingCheckers: countRemainingCheckers(board, color),
            averageDistance: calculateAverageDistance(board, color),
            diceUtilization: calculateDiceUtilization(board, color),
            bearoffType: null // توسط caller پر میشه
        };
    },

    // ===== توابع کمکی =====
    
    calculateEffectivePips(board, color) {
        // محاسبه پیپ مؤثر با در نظر گرفتن اتلاف
        const rawPips = boardService.pipCount(board, color);
        const wastage = calculateStackingPenalty(board, color);
        return rawPips + Math.abs(wastage);
    },

    countTotalClosedPoints(board, color) {
        let count = 0;
        for (let i = 1; i <= 24; i++) {
            if ((color === 'white' && board[i] >= 2) || 
                (color === 'black' && board[i] <= -2)) {
                count++;
            }
        }
        return count;
    },

    countHomeClosedPoints(board, color) {
        let count = 0;
        if (color === 'white') {
            for (let i = 1; i <= 6; i++) {
                if (board[i] >= 2) count++
            } 
        } else {
            for (let i = 19; i <= 24; i++) {
                if (board[i] <= -2) count++
            }  
        }

        return count;
    },

    calculateMaxPrimeLength(board, color) {
        let maxLength = 0;
        let currentLength = 0;
        
        for (let i = 1; i <= 24; i++) {
            const isMyPoint = (color === 'white' && board[i] >= 2) || 
                             (color === 'black' && board[i] <= -2);
            
            if (isMyPoint) {
                currentLength++;
                maxLength = Math.max(maxLength, currentLength);
            } else {
                currentLength = 0;
            }
        }
        
        return maxLength;
    },

    findAnchors(board, color) {
        const anchors = [];
        for (let i = 1; i <= 24; i++) {
            if ((color === 'white' && board[i] >= 2) || 
                (color === 'black' && board[i] <= -2)) {
                anchors.push(i);
            }
        }
        return anchors;
    },

    hasAdvancedAnchor(board, color) {
        if (color === 'white') {
            return board[20] >= 2 || board[21] >= 2;
        } else {
            return board[4] <= -2 || board[5] <= -2;
        }
    },

    countEscapeRoutes(board, color) {
        let routes = 0;
        if (color === 'white') {
            // مهره‌های سفید پشت پرایم سیاه
            for (let i = 1; i <= 18; i++) {
                if (board[i] > 0) routes++;
            }
        } else {
            for (let i = 7; i <= 24; i++) {
                if (board[i] < 0) routes++;
            }
        }
        return routes;
    },

    countBackCheckers(board, color) {
        let count = 0;
        if (color === 'white') {
            for (let i = 1; i <= 6; i++) {
                if (board[i] > 0) count += board[i];
            }
        } else {
            for (let i = 19; i <= 24; i++) {
                if (board[i] < 0) count += Math.abs(board[i]);
            }
        }
        return count;
    },

    calculateFlexibility(board, color) {
        // تعداد نقاطی که فقط ۲ مهره دارن (قابل استفاده مجدد)
        let flexible = 0;
        for (let i = 1; i <= 24; i++) {
            if ((color === 'white' && board[i] === 2) || 
                (color === 'black' && board[i] === -2)) {
                flexible++;
            }
        }
        return flexible;
    },

    calculateConnectivity(board, color) {
        // محاسبه اتصال بین مهره‌ها
        let connectivity = 0;
        for (let i = 1; i <= 24; i++) {
            const count = board[i];
            const isMy = (color === 'white' && count > 0) || (color === 'black' && count < 0);
            
            if (isMy && i < 24) {
                const nextCount = board[i + 1];
                const nextIsMy = (color === 'white' && nextCount > 0) || 
                                (color === 'black' && nextCount < 0);
                if (nextIsMy) {
                    connectivity += Math.min(Math.abs(count), Math.abs(nextCount));
                }
            }
        }
        return connectivity;
    },

    calculateDistribution(board, color) {
        // محاسبه توزیع مهره‌ها (انحراف معیار)
        const positions = [];
        for (let i = 1; i <= 24; i++) {
            const count = board[i];
            const myCount = (color === 'white' ? Math.max(0, count) : Math.max(0, -count));
            for (let j = 0; j < myCount; j++) {
                positions.push(i);
            }
        }
        
        if (positions.length === 0) return 0;
        
        const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
        const variance = positions.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / positions.length;
        
        return Math.sqrt(variance);
    }
};