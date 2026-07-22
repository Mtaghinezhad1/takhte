// ==================== services/ai/strategyEngine.js ====================
import { PHASES, STRATEGIES } from '@/constants/aiWeights';
import { detectGamePhase } from '@/utils/computerAI';
import { boardService } from '../boardService';
import { featureExtractor } from './featureExtractor';

export const strategyEngine = {
    determineStrategy(board, currentTurn) {
        const features = this.extractStrategicFeatures(board, currentTurn);
        const phase = detectGamePhase(board, currentTurn);

        // حالت‌های خاص که استراتژی رو اورراید می‌کنن
        const override = this.checkStrategicOverrides(features);
        if (override) {
            return { ...override, phase };
        }

        // امتیازدهی به هر استراتژی
        const scores = this.scoreStrategies(features, phase);

        // انتخاب بهترین استراتژی
        const winningStrategy = Object.entries(scores)
            .sort(([, a], [, b]) => b - a)[0];

        console.log(winningStrategy[0], scores);
        return {
            strategy: winningStrategy[0],
            confidence: winningStrategy[1],
            scores,
            phase
        };
    },

    extractStrategicFeatures(board, currentTurn) {
        const opponent = currentTurn === 'white' ? 'black' : 'white';
        const myPips = boardService.pipCount(board, currentTurn);
        const oppPips = boardService.pipCount(board, opponent);

        // شمارش نقاط بسته
        const myClosedPoints = featureExtractor.countTotalClosedPoints(board, currentTurn);
        const oppClosedPoints = featureExtractor.countTotalClosedPoints(board, opponent);

        // شمارش نقاط بسته
        const myHomeClosedPoints = featureExtractor.countHomeClosedPoints(board, currentTurn);
        const oppHomeClosedPoints = featureExtractor.countHomeClosedPoints(board, opponent);

        // بررسی مهره‌های روی bar
        const opponentOnBar = currentTurn === 'white' ?
            (board[0] < 0 ? Math.abs(board[0]) : 0) :
            (board[25] > 0 ? board[25] : 0);

        // محاسبه طول پرایم
        const myPrimeLength = this.calculatePrimeLength(board, currentTurn);
        const oppPrimeLength = this.calculatePrimeLength(board, opponent);

        // بررسی لنگرهای پیشرفته
        const iHaveAdvancedAnchor = this.hasAdvancedAnchor(board, currentTurn);

        // شمارش بلات‌های حریف در خانه ما
        const opponentBlotsInOurHome = this.countOpponentBlotsInHome(board, currentTurn);

        // بررسی بسته شدن کامل
        const amIClosedOut = oppClosedPoints >= 6;

        // محاسبه تایمینگ
        const timing = this.calculateTiming(board, currentTurn, myPips, oppPips);

        return {
            myPips,
            oppPips,
            pipDiff: myPips - oppPips,
            myClosedPoints,
            oppClosedPoints,
            myHomeClosedPoints,
            oppHomeClosedPoints,
            opponentOnBar,
            myPrimeLength,
            oppPrimeLength,
            iHaveAdvancedAnchor,
            opponentBlotsInOurHome,
            amIClosedOut,
            timing
        };
    },

    checkStrategicOverrides(features) {
        // بسته شدن کامل = فقط زنده بمان
        if (features.amIClosedOut) {
            return {
                strategy: STRATEGIES.HOLDING,
                confidence: 1.0,
                scores: { HOLDING: 1.0 }
            };
        }

        // Close out = بلیتز مطلق
        if (features.opponentOnBar >= 2 && features.myClosedPoints >= 4) {
            return {
                strategy: STRATEGIES.BLITZ,
                confidence: 1.0,
                scores: { BLITZ: 1.0 }
            };
        }

        // پرایم ۶ تایی = پرایم خالص
        if (features.myPrimeLength >= 6) {
            return {
                strategy: STRATEGIES.PRIME,
                confidence: 0.95,
                scores: { PRIME: 0.95 }
            };
        }

        return null;
    },

    scoreStrategies(features, phase) {
        const scores = {
            [STRATEGIES.BLITZ]: 0,
            [STRATEGIES.PRIME]: 0,
            [STRATEGIES.RACE]: 0,
            [STRATEGIES.HOLDING]: 0,
            [STRATEGIES.BACKGAME]: 0
        };

        // لایه ۱: تخته داخلی (وزن ۳۵٪)
        if (features.myHomeClosedPoints >= 4) {
            scores.BLITZ += 0.30;
            scores.HOLDING -= 0.10;
        }
        else if (features.myHomeClosedPoints >= 3) {
            scores.BLITZ += 0.20;
            scores.HOLDING -= 0.10;
        }
        else if (features.myHomeClosedPoints <= 1) {
            scores.RACE += 0.10;
            scores.HOLDING += 0.15;
        }

        // لایه ۲: پرایم (وزن ۲۵٪)
        if (features.myPrimeLength >= 5) {
            scores.PRIME += 0.25;
            scores.RACE -= 0.05;
        }
        else if (features.myPrimeLength >= 4) {
            scores.PRIME += 0.05;
        }
        
        if (features.oppPrimeLength >= 4 && features.pipDiff < 0) {
            scores.BACKGAME += 0.10;
            scores.RACE -= 0.15;
        }

        // لایه ۳: تماس و بلات‌ها (وزن ۲۰٪)
        if (features.opponentBlotsInOurHome >= 2 && features.myHomeClosedPoints >= 2) {
            scores.BLITZ += 0.15;
        }
        if (features.opponentOnBar >= 1 && features.myHomeClosedPoints >= 2) {
            scores.BLITZ += 0.05;
        }

        if (features.iHaveAdvancedAnchor && features.pipDiff < -10) {
            scores.HOLDING += 0.15;
            scores.BLITZ -= 0.05;
        }

        // لایه ۴: پیپ کانت (وزن ۱۵٪)
        const pipDiff = features.pipDiff;
        if (pipDiff > 30) {
            scores.RACE += 0.08;
            scores.PRIME += 0.05;
        } else if (pipDiff > 15) {
            scores.RACE += 0.05;
            scores.PRIME += 0.03;
        } else if (pipDiff < -30) {
            scores.HOLDING += 0.08;
            scores.BACKGAME += 0.07;
        } else if (pipDiff < -15) {
            scores.HOLDING += 0.05;
            scores.BACKGAME += 0.03;
        }

        // لایه ۵: فاز بازی (وزن ۵٪)
        if (phase === PHASES.OPENING) {
            scores.RACE += 0.02;
            scores.PRIME += 0.02;
        } else if (phase === PHASES.ENDGAME) {
            scores.RACE += 0.03;
            scores.BLITZ -= 0.02;
        }

        return scores;
    },

    calculatePrimeLength(board, color) {
        let maxPrime = 0;
        let currentPrime = 0;

        for (let i = 1; i <= 24; i++) {
            const isMyPoint = (color === 'white' && board[i] >= 2) ||
                (color === 'black' && board[i] <= -2);

            if (isMyPoint) {
                currentPrime++;
                maxPrime = Math.max(maxPrime, currentPrime);
            } else {
                currentPrime = 0;
            }
        }

        return maxPrime;
    },

    hasAdvancedAnchor(board, color) {
        if (color === 'white') {
            return (board[20] >= 2 || board[21] >= 2);
        } else {
            return (board[4] <= -2 || board[5] <= -2);
        }
    },

    countOpponentBlotsInHome(board, currentTurn) {
        let count = 0;
        const homeStart = currentTurn === 'white' ? 19 : 1;
        const homeEnd = currentTurn === 'white' ? 24 : 6;

        for (let i = homeStart; i <= homeEnd; i++) {
            if ((currentTurn === 'white' && board[i] === -1) ||
                (currentTurn === 'black' && board[i] === 1)) {
                count++;
            }
        }
        return count;
    },

    calculateTiming(board, currentTurn, myPips, oppPips) {
        const remainingMoves = Math.ceil(myPips / 8); // تخمین حرکات باقی‌مانده
        const opponentRemaining = Math.ceil(oppPips / 8);

        if (remainingMoves < opponentRemaining - 5) {
            return 'CRITICAL'; // تایمینگ بحرانی
        } else if (remainingMoves < opponentRemaining) {
            return 'AHEAD';
        } else {
            return 'BEHIND';
        }
    }
};