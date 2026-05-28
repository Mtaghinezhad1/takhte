export const userService = {
    calculateElo(myRating, opponentRating, isWin, matchLength = 5) {
        const sqrtN = Math.sqrt(matchLength);
        const K = 4 * sqrtN;
        const expected = 1 / (1 + Math.pow(10, ((opponentRating - myRating) * sqrtN) / 2000));
        const score = isWin ? 1 : 0;
        const delta = K * (score - expected);
        return Math.round(myRating + delta);
    }
}