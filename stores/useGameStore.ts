import { getAIProfile } from '@/constants/aiProfiles';
import { aiService } from '@/services/aiService';
import { boardService } from '@/services/boardService';
import { gameService } from '@/services/gameService';
import storageService from '@/services/storageService';
import { create } from 'zustand';
import useUserStore from './useUserStore';


const useGameStore = create((set, get) => ({
  // State
  board: boardService.getInitialBoard(),
  currentTurn: 'white',
  movesCount: 0,
  allDice: [1, 1, 1, 1],
  dice: [1, 1, 1, 1],
  activeDice: 1,
  whiteBornOff: 0,
  blackBornOff: 0,
  historyStack: [],
  showContinue: false,
  isModalVisible: false,
  showForcedMoveModal: false,
  isAiThinking: false,
  gameScore: [0, 0],
  availableMoves: [],
  turnPhase: 'rolling',
  gameWinner: null,
  aiLevel: '3',
  aiLevelForWhite: '3',
  isRolling: false,
  isMatchEndModalVisible: false,
  matchEndWinner: null,
  aiProfile: null,
  targetScore: '3',
  finalWhiteElo: null,
  finalBlackElo: null,
  oldUserElo: null,
  oldAIElo: null,

  // Actions
  initializeGame: (gameMode, targetScore = '3', aiLevel = '3', aiLevelForWhite = '3') => {
    const initialBoard = boardService.getInitialBoardByGameMode(gameMode);
    const aiProfile = gameMode !== 'twoPlayer' ? getAIProfile(aiLevel) : null;

    set({
      board: [...initialBoard],
      gameMode,
      aiLevel,
      aiLevelForWhite,
      aiProfile,
      currentTurn: 'white',
      movesCount: 0,
      dice: [1, 1],
      activeDice: 1,
      whiteBornOff: 0,
      blackBornOff: 0,
      historyStack: [],
      showContinue: false,
      isModalVisible: false,
      showForcedMoveModal: false,
      isAiThinking: false,
      gameScore: [0, 0],
      availableMoves: [],
      turnPhase: 'rolling',
      gameWinner: null,
      isMatchEndModalVisible: false,
      matchEndWinner: null,
      targetScore,
      finalWhiteElo: null,
      finalBlackElo: null,
      oldUserElo: null,
      oldAIElo: null,
    });
  },

  rollDice: () => {
    const state = get();

    if (state.isMatchEndModalVisible) return;

    const newDice = gameService.generateDice();

    set({
      dice: newDice.allDice,
      allDice: newDice.allDice,
      activeDice: newDice.activeDie
    });

    if (!boardService.hasAnyMove(state.board, newDice.allDice, state.currentTurn)) {
      set({
        currentTurn: gameService.getNextTurn(state.currentTurn),
        movesCount: 0
      });
    }
  },

  isMatchCompleted: (newGameScore) => {
    const state = get();
    const [whiteScore, blackScore] = newGameScore;
    return whiteScore >= state.targetScore || blackScore >= state.targetScore;
  },

  endMatch: async (winner, newGameScore) => {

    const state = get();
    const opponentElo = state.aiProfile.baseRating;
    const currentUserElo = useUserStore.getState().elo; //before change

    const oldUserElo = currentUserElo;
    const oldAIElo = opponentElo;

    const { newUserElo, newOpponentElo } = await useUserStore.getState().updateEloAfterMatch(
      winner,
      'white',        // کاربر همیشه با سفید بازی می‌کند
      opponentElo,
      state.targetScore
    );

    set({
      gameScore: newGameScore,
      matchEndWinner: winner,
      finalWhiteElo: newUserElo,      // الو جدید کاربر (سفید)
      finalBlackElo: newOpponentElo,  // الو جدید هوش مصنوعی (سیاه)
      oldUserElo,
      oldAIElo,
      isMatchEndModalVisible: true,
      isModalVisible: false,
    });

    await storageService.removeActiveGame(state.gameMode);
  },

  endCurrentGame: (winner) => {
    const state = get();
    const newScore = gameService.calculateNewScore(state.gameScore, winner);

    if (gameService.isMatchCompleted(newScore, state.targetScore)) {
      get().endMatch(winner, newScore);
    } else {
      set({
        isModalVisible: true,
        gameWinner: winner,
        gameScore: newScore,
        showContinue: false,
      });
    }
  },

  // بازنشانی وضعیت پایان مسابقه (در زمان شروع بازی جدید)
  resetMatchEndState: async () => {
    const state = get();
    await storageService.removeActiveGame(state.gameMode);
    set({ isMatchEndModalVisible: false, matchEndWinner: null });
  },

  pushToHistory: () => {
    const state = get();
    const snapshot = {
      board: [...state.board],
      dice: [...state.dice],
      activeDice: state.activeDice,
      currentTurn: state.currentTurn,
      movesCount: state.movesCount,
      whiteBornOff: state.whiteBornOff,
      blackBornOff: state.blackBornOff,
    };
    set(state => ({ historyStack: [...state.historyStack, snapshot] }));
  },

  handlePointPress: (pointId) => {
    const state = get();

    if (state.showContinue || state.isAiThinking || state.isRolling || state.isMatchEndModalVisible) return;

    // تابع کمکی برای اجرای حرکت با یک تاس مشخص
    const executeMove = (diceValue) => {
      // ذخیره تاریخچه برای undo
      get().pushToHistory();

      const { newBoard, newWhiteBornOff, newBlackBornOff } = boardService.makeMove(
        state.board,
        pointId,
        diceValue,
        state.currentTurn,
        state.board,
        state.whiteBornOff,
        state.blackBornOff
      );

      const winner = gameService.checkWinner(newWhiteBornOff, newBlackBornOff);
      if (winner) {
        set({ board: newBoard, });
        get().endCurrentGame(winner);
        return; // مهم: ادامه نکند
      }

      // حذف تاس استفاده شده
      const indexToRemove = state.dice.indexOf(diceValue);
      const newDice = [...state.dice.slice(0, indexToRemove), ...state.dice.slice(indexToRemove + 1)];

      const newMovesCount = state.movesCount + 1;

      const updates = {
        whiteBornOff: newWhiteBornOff,
        blackBornOff: newBlackBornOff,
        dice: newDice,
        board: newBoard,
        movesCount: newMovesCount
      };

      // بررسی ادامه نوبت
      if (newDice.length > 0 && boardService.hasAnyMove(newBoard, newDice, state.currentTurn)) {
        updates.activeDice = newDice[0];
      } else {
        updates.showContinue = true;
      }

      set(updates);
    }

    // 1. ابتدا حرکت با تاس فعال بررسی می‌شود
    if (boardService.isValidMove(state.board, pointId, state.activeDice, state.currentTurn)) {
      executeMove(state.activeDice);
    }
    // 2. اگر حرکت با تاس فعال ممکن نبود، بررسی وضعیت بار و تاس جایگزین
    else if (state.dice.length === 2) {
      const barPoint = state.currentTurn === 'white' ? 25 : 0;

      if (state.board[barPoint] != 0) {
        const otherDice = state.dice[0] === state.activeDice ? state.dice[1] : state.dice[0];

        if (boardService.isValidMove(state.board, pointId, otherDice, state.currentTurn)) {
          // قبل از حرکت، تاس فعال را در store به‌روزرسانی کن
          set({ activeDice: otherDice });
          executeMove(otherDice);
        }
      }
    }
  },

  switchActiveDice: () => {
    const state = get();
    if (state.dice.length === 2) {
      set({
        activeDice: state.activeDice === state.dice[0] ? state.dice[1] : state.dice[0]
      });
    }
  },

  handleUndo: () => {
    const state = get();
    if (state.historyStack.length === 0 || state.movesCount === 0) return;

    const prev = state.historyStack[state.historyStack.length - 1];

    set({
      board: prev.board,
      dice: prev.dice,
      activeDice: prev.activeDice,
      currentTurn: prev.currentTurn,
      movesCount: prev.movesCount,
      whiteBornOff: prev.whiteBornOff,
      blackBornOff: prev.blackBornOff,
      showContinue: false,
      historyStack: state.historyStack.slice(0, -1), // حذف آخرین آیتم
    });
  },

  handleContinue: () => {
    const state = get();

    const winner = gameService.checkWinner(state.whiteBornOff, state.blackBornOff);

    const updates = {
      currentTurn: gameService.getNextTurn(state.currentTurn),
      movesCount: 0,
      showContinue: false,
      history: null,
      historyStack: [],
    };

    if (winner) {
      updates.isModalVisible = true;
      updates.gameScore = gameService.calculateNewScore(state.gameScore, winner);
    }

    set(updates);
  },

  handleTimeEnd: (loser) => {
    const state = get();
    if (state.isModalVisible || state.gameWinner) return;
    const winner = loser === 'black' ? 'white' : 'black';
    get().endCurrentGame(winner);
    set({ isAiThinking: false }); // فقط اگر نیاز باشد AI thinking غیرفعال شود
  },

  saveCurrentGameState: async () => {
    const state = get();

    if (!state.gameMode || state.isMatchEndModalVisible) return;

    const gameStateToSave = {
      board: state.board,
      currentTurn: state.currentTurn,
      allDice: state.allDice,
      dice: state.dice,
      aiProfile: state.aiProfile,
      whiteBornOff: state.whiteBornOff,
      blackBornOff: state.blackBornOff,
      gameScore: state.gameScore,
      gameWinner: state.gameWinner,
      aiLevel: state.aiLevel,
      targetScore: state.targetScore,
      gameMode: state.gameMode,
      isAiThinking: false, // همیشه false ذخیره شود
      isRolling: false // همیشه false ذخیره شود
    };

    await storageService.saveActiveGame(state.gameMode, gameStateToSave);
  },


  // در useGameStore اضافه کنید
  loadSavedGame: (savedState) => {
    set({
      board: savedState.board,
      currentTurn: savedState.currentTurn,
      allDice: savedState.allDice,
      dice: savedState.dice,
      whiteBornOff: savedState.whiteBornOff,
      blackBornOff: savedState.blackBornOff,
      gameScore: savedState.gameScore,
      gameWinner: savedState.gameWinner,
      aiLevel: savedState.aiLevel,
      aiProfile: savedState.aiProfile,
      targetScore: savedState.targetScore,
      gameMode: savedState.gameMode,
      isAiThinking: false,
      isRolling: false,
    });

    // حذف بازی ذخیره شده بعد از بارگذاری
    setTimeout(() => {
      storageService.removeActiveGame(savedState.gameMode);
    }, 100);
  },

  forfeitHand: () => {
    const state = get();
    if (state.isModalVisible || state.gameWinner) return;
    get().endCurrentGame('black');
  },

  forfeitMatch: () => {
    const state = get();

    // جلوگیری از اجرا در حالت‌های نامعتبر
    if (state.isModalVisible || state.gameWinner || state.isMatchEndModalVisible) return;

    const newScore = gameService.calculateNewScore(state.gameScore, 'black');
    get().endMatch('black', newScore);
  },

  closeResultModal: () => {
    const state = get();
    const winner = state.gameWinner;
    const newDice = gameService.generateDice();

    set({
      isModalVisible: false,
      board: boardService.getInitialBoardByGameMode(state.gameMode),
      currentTurn: winner || 'white',
      movesCount: 0,
      dice: newDice.allDice,
      allDice: newDice.allDice,
      activeDice: newDice.activeDie,
      whiteBornOff: 0,
      blackBornOff: 0,
      historyStack: [],
      showContinue: false,
      showForcedMoveModal: false,
      isAiThinking: false,
      gameWinner: null,
      availableMoves: [],
      turnPhase: 'rolling',
    });
  },

  closeInformModal: () => {
    const state = get();
    const winner = state.gameWinner;
    if (!winner) {
      set({ currentTurn: gameService.getNextTurn(state.currentTurn) })
    }
    set({ showForcedMoveModal: false });
  },

  playAIMove: (uniqueMoves, player = 'black', isForcedMove = false, difficulty = null) => {
    const state = get();
    const aiDifficulty = difficulty || state.aiLevel;

    if (state.isModalVisible || state.gameWinner || uniqueMoves.length === 0) return;


    const result = aiService.executeBestMove(
      state.board,
      state.dice,
      uniqueMoves,
      player,
      state.whiteBornOff,
      state.blackBornOff,
      aiDifficulty
    );

    const updates = {
      board: result.board,
      dice: result.remainingDice,
      whiteBornOff: result.whiteBornOff,
      blackBornOff: result.blackBornOff
    };

    const winner = gameService.checkWinner(result.whiteBornOff, result.blackBornOff);
    if (winner) {
      set({ board: result.board, });
      get().endCurrentGame(winner);
      return; // مهم: اینجا return کن که کدهای بعدی اجرا نشن
    }

    if (result.turnComplete) {
      if (isForcedMove) {
        set({ showForcedMoveModal: true });
      } else {
        updates.currentTurn = gameService.getNextTurn(state.currentTurn);
      }
      updates.movesCount = 0;
      updates.isAiThinking = false;
      updates.history = null;
    } else {
      updates.activeDice = result.remainingDice[0];
      updates.isAiThinking = false;
    }

    set(updates);
  },

  executeAIMove: () => {
    const state = get();
    if (state.dice.length === 0 || state.isAiThinking || state.gameWinner || state.isModalVisible || state.isMatchEndModalVisible) return;

    const uniqueMoves = boardService.getAvailableMoves(state.board, state.dice, state.currentTurn);
    set({ availableMoves: uniqueMoves });

    if (state.gameMode !== 'AIvsAI') {
      if (state.currentTurn === 'white' && uniqueMoves.length === 1 && !state.showContinue && !state.isModalVisible) {
        set({ isAiThinking: true });
        const forcedTimer = setTimeout(() => get().playAIMove(uniqueMoves, 'white', true, state.aiLevel), 1700);
        return () => clearTimeout(forcedTimer);
        //get().playAIMove(uniqueMoves, 'white', true, state.aiLevel);
      }
      else if (state.currentTurn === 'black') {
        set({ isAiThinking: true });
        const timer = setTimeout(() => get().playAIMove(uniqueMoves, 'black', false, state.aiLevel), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      if (state.currentTurn === 'white') {
        set({ isAiThinking: true });
        const timer = setTimeout(() => get().playAIMove(uniqueMoves, 'white', false, state.aiLevelForWhite), 10);
        return () => clearTimeout(timer);
      } else {
        set({ isAiThinking: true });
        const timer = setTimeout(() => get().playAIMove(uniqueMoves, 'black', false, state.aiLevel), 10);
        return () => clearTimeout(timer);
      }
    }








  }
}));

export default useGameStore;