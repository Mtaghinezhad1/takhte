export const gameService = {
  getNextTurn(currentTurn) {
    return currentTurn === 'white' ? 'black' : 'white';
  },

  checkWinner(whiteBornOff, blackBornOff) {
    if (whiteBornOff === 15) return 'white';
    if (blackBornOff === 15) return 'black';
    return null;
  },

  checkMars(winner, whiteBornOff, blackBornOff) {
    if (winner === 'white' && blackBornOff === 0) return true;
    if (winner === 'black' && whiteBornOff === 0) return true;
    return false;
  },

  isMatchCompleted: (newGameScore, targetScore) => {
    const [whiteScore, blackScore] = newGameScore;
    return whiteScore >= targetScore || blackScore >= targetScore;
  },

  calculateNewScore(gameScore, winner, isMars = false) {
    const newScore = [...gameScore];
    const points = isMars ? 2 : 1; // مارس = ۲ امتیاز
    if (winner === 'white') {
      newScore[0] += points;
    } else if (winner === 'black') {
      newScore[1] += points;
    }
    return newScore;
  },

  generateDice() {
    // const dice1 = 1;
    // const dice2 = 2;
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