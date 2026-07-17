// services/game/GameEngine.ts
export class GameEngine {
    private games: Map<string, any> = new Map();

    resetGame() {
        // ریست کردن وضعیت بازی
    }

    createGame(player1: string, player2: string): string {
        const gameId = Date.now().toString();
        this.games.set(gameId, {
            board: this.createInitialBoard(),
            currentTurn: 'white',
            dice: [1, 2], // نمونه
            players: [player1, player2],
            gameOver: false,
            winner: null,
        });
        return gameId;
    }

    createInitialBoard() {
        const board: any = {};
        for (let i = 0; i < 26; i++) board[i] = 0;
        board[1] = 2;
        board[12] = 5;
        board[17] = 3;
        board[19] = 5;
        board[24] = -2;
        board[13] = -5;
        board[8] = -3;
        board[6] = -5;
        return board;
    }

    getBoard(gameId: string) {
        const game = this.games.get(gameId);
        return game ? game.board : null;
    }

    getCurrentTurn(gameId: string) {
        const game = this.games.get(gameId);
        return game ? game.currentTurn : null;
    }

    getDice(gameId: string) {
        const game = this.games.get(gameId);
        return game ? game.dice : null;
    }

    getLegalMoves(gameId: string) {
        // پیاده‌سازی حرکات قانونی
        return [];
    }

    applyMoves(gameId: string, moves: any) {
        // پیاده‌سازی اعمال حرکات
        return true;
    }

    nextTurn(gameId: string) {
        const game = this.games.get(gameId);
        if (game) {
            game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
            game.dice = this.rollDice();
        }
    }

    rollDice() {
        return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    }

    getGameResult(gameId: string) {
        const game = this.games.get(gameId);
        if (!game) return { isGameOver: false, winner: null };
        
        // بررسی پایان بازی
        const board = game.board;
        const whiteOff = board[25] || 0;
        const blackOff = board[0] || 0;
        
        if (whiteOff >= 15) {
            return { isGameOver: true, winner: 'white' };
        }
        if (blackOff >= 15) {
            return { isGameOver: true, winner: 'black' };
        }
        
        return { isGameOver: false, winner: null };
    }
}