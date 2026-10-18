// ==================== services/ai/testAIEngine.ts ====================
import { getAvailableMoves } from '@/utils/availableMoves';
import { aiService } from '../ai/aiService';
import { boardService } from '../boardService';

/**
 * ورودی تست موتور تخته نرد
 * @param {Object} input
 * @param {number[]} input.board  - آرایه ۲۶ عضوی تخته
 * @param {number[]} input.dice   - تاس‌ها مثل [1, 3]
 * @param {'white'|'black'} input.turn
 * @param {Array<{from:number,to:number,die:number}>} input.bestMoves - حرکت‌های درست
 */
export function testAIEngine(input, difficulty = '10') {
    const { board, dice, turn, bestMoves } = input;

    console.log('\n════════════════════════════════════════');
    console.log('🧪 شروع تست موتور تخته نرد');
    console.log('════════════════════════════════════════');

    // ---------- ۱. ورودی ----------
    console.log('📥 ورودی:');
    console.log('  board :', board);
    console.log('  dice  :', dice);
    console.log('  turn  :', turn);
    console.log('  bestMoves (انتظار):', bestMoves);

    // ---------- ۲. گرفتن همه حرکات ممکن ----------
    const sequences = getAvailableMoves(board, dice, turn);
    console.log(`\n🎲 تعداد حالت‌های ممکن: ${sequences.length}`);

    if (sequences.length === 0) {
        console.warn('⚠️ هیچ حرکت ممکنی وجود ندارد!');
        return { match: false, reason: 'no_moves' };
    }

    // ---------- ۳. اجرای موتور AI ----------
    let aiResult;
    try {
        aiResult = aiService.executeBestMove(
            board,
            dice,
            sequences,
            turn,
            0,        // whiteBornOff
            0,        // blackBornOff
            difficulty
        );
    } catch (err) {
        console.error('❌ خطا در اجرای موتور AI:', err);
        return { match: false, reason: 'engine_error', error: err };
    }

    // ---------- ۴. محاسبه‌ی بورد مورد انتظار از bestMoves ----------
    let expectedBoard = [...board];
    let expectedWhiteBornOff = 0;
    let expectedBlackBornOff = 0;
    let expectedDice = [...dice];

    for (const mv of bestMoves) {
        try {
            const r = boardService.makeMove(
                expectedBoard,
                mv.from,
                mv.die,
                turn,
                expectedBoard,
                expectedWhiteBornOff,
                expectedBlackBornOff
            );
            expectedBoard = r.newBoard;
            expectedWhiteBornOff = r.newWhiteBornOff;
            expectedBlackBornOff = r.newBlackBornOff;

            const idx = expectedDice.indexOf(mv.die);
            if (idx !== -1) expectedDice.splice(idx, 1);
        } catch (err) {
            console.error('❌ خطا در اجرای bestMoves:', err);
        }
    }

    // ---------- ۵. مقایسه ----------
    const boardsEqual =
        JSON.stringify(aiResult.board) === JSON.stringify(expectedBoard);
    const diceEqual =
        JSON.stringify([...aiResult.remainingDice].sort()) ===
        JSON.stringify([...expectedDice].sort());

    const match = boardsEqual && diceEqual;

    // ---------- ۶. لاگ خروجی‌ها ----------
    console.log('\n📤 خروجی موتور AI:');
    console.log('  board بعد از حرکت :', aiResult.board);
    console.log('  remainingDice     :', aiResult.remainingDice);
    console.log('  turnComplete      :', aiResult.turnComplete);
    console.log('  strategyInfo      :', aiResult.strategyInfo);

    console.log('\n📤 بورد مورد انتظار (از bestMoves):');
    console.log('  board :', expectedBoard);
    console.log('  dice  :', expectedDice);

    console.log('\n🔍 نتیجه مقایسه:');
    console.log('  boardsEqual :', boardsEqual);
    console.log('  diceEqual   :', diceEqual);
    console.log(
        `  ${match ? '✅ MATCH — موتور درست بازی کرد' : '❌ MISMATCH — موتور اشتباه بازی کرد'}`
    );
    console.log('════════════════════════════════════════\n');

    return {
        match,
        boardsEqual,
        diceEqual,
        aiResult,
        expectedBoard,
        expectedDice,
    };
}