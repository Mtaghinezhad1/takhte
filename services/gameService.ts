export const gameService = {
  getNextTurn(currentTurn) {
    return currentTurn === 'white' ? 'black' : 'white';
  },

  checkWinner(whiteBornOff, blackBornOff) {
    if (whiteBornOff === 15) return 'white';
    if (blackBornOff === 15) return 'black';
    return null;
  },

  isMatchCompleted: (newGameScore, targetScore) => {
    const [whiteScore, blackScore] = newGameScore;
    return whiteScore >= targetScore || blackScore >= targetScore;
  },

  calculateNewScore(gameScore, winner) {
    const newScore = [...gameScore];
    if (winner === 'white') {
      newScore[0] += 1;
    } else if (winner === 'black') {
      newScore[1] += 1;
    }
    return newScore;
  },

  generateDice() {
    // const dice1 = 5;
    // const dice2 = 6;
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    if (dice1 === dice2) {
      return {
        allDice: [dice1, dice1, dice1, dice1],
        activeDie: dice1
      };
    }

    return {
      allDice: [dice1, dice2],
      activeDie: Math.max(dice1, dice2)
    };
  }
}