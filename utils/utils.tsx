// تابع کمکی برای محاسبه نقطه مقصد
export const getTargetPoint = (fromPoint, diceNumber, currentTurn) => {
    if (currentTurn === 'white') {
        return fromPoint - diceNumber;
    } else { // black
        return fromPoint + diceNumber;
    }
};

export const increaseTargetValue = (sourceValue, targetValue, newBoard, targetPoint, prevBoard) => {
    if (sourceValue > 0) { // حرکت مهره سفید
        if (targetValue === -1) {
            // خوردن مهره سیاه تنها (blot)
            newBoard[targetPoint] = 1;
            newBoard[0] = newBoard[0] - 1;
        } else if (targetValue < 0) {
            // مقصد پر از مهره سیاه است - این حالت نباید رخ دهد چون isValidMove باید جلوگیری کند
            return prevBoard;
        } else {
            // مقصد خالی یا دارای مهره سفید
            newBoard[targetPoint] = targetValue + 1;
        }
    } else { // حرکت مهره سیاه
        if (targetValue === 1) {
            // خوردن مهره سفید تنها (blot)
            newBoard[targetPoint] = -1;
            newBoard[25] = newBoard[25] + 1;
        } else if (targetValue > 0) {
            // مقصد پر از مهره سفید است - این حالت نباید رخ دهد
            return prevBoard;
        } else {
            // مقصد خالی یا دارای مهره سیاه
            newBoard[targetPoint] = targetValue - 1;
        }
    }
}

// تابع بررسی حرکت از بار
export const canMoveFromBar = (board, fromPoint, diceNumber, currentTurn) => {
    const whiteBarCount = board[25];
    const blackBarCount = board[0];

    if (currentTurn === 'white' && whiteBarCount > 0) {
        // اگر مهره سفید در بار است، فقط می‌تواند از بار وارد بازی شود
        if (fromPoint !== 25) {
            return false; // باید ابتدا مهره را از بار وارد کند
        }

        const entryPoint = 25 - diceNumber;
        if (entryPoint < 1 || entryPoint > 24) return false;

        const targetValue = board[entryPoint];
        // بررسی اشغال بودن نقطه ورود توسط حریف
        if (targetValue < -1) return false; // نقطه توسط بیش از یک مهره حریف اشغال شده

        return true;
    }

    if (currentTurn === 'black' && blackBarCount < 0) {
        // اگر مهره سیاه در بار است، فقط می‌تواند از بار وارد بازی شود
        if (fromPoint !== 0) {
            return false; // باید ابتدا مهره را از بار وارد کند
        }

        const entryPoint = diceNumber;
        if (entryPoint < 1 || entryPoint > 24) return false;

        const targetValue = board[entryPoint];
        // بررسی اشغال بودن نقطه ورود توسط حریف
        if (targetValue > 1) return false; // نقطه توسط بیش از یک مهره حریف اشغال شده

        return true;
    }

};

// Helper to check if all checkers are in the home board for bear off
export const isInHomeBoard = (currentTurn, board) => {
    if (currentTurn === 'white') {
        // White checkers: points 1-6
        for (let i = 7; i <= 24; i++) {
            if (board[i] > 0) return false;
        }
        return true;
    } else { // turn === 'black'
        // Black checkers: points 19-24
        for (let i = 1; i <= 18; i++) {
            if (board[i] < 0) return false;
        }
        return true;
    }
};


// Helper to check if all checkers are in the home board for bear off
export const canBearOff = (currentTurn, board, fromPoint, diceNumber) => {
    if (isInHomeBoard(currentTurn, board)) {
        if (currentTurn === 'white') {
            if (fromPoint === diceNumber) {
                return true;
            }
            if (diceNumber > fromPoint) {
                for (let i = 6; i > fromPoint; i--) {
                    if (board[i] > 0) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } else {
            if (fromPoint === 25 - diceNumber) {
                return true;
            }
            if (25 - diceNumber < fromPoint) {
                for (let i = 19; i < fromPoint; i++) {
                    if (board[i] < 0) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }


    }
    return false;
};


export const isValidMove = (board, fromPoint, diceNumber, currentTurn) => {

    if (canMoveFromBar(board, fromPoint, diceNumber, currentTurn)) {
        return true;
    }

    // 1. بررسی معتبر بودن نقطه مبدا
    if (fromPoint < 1 || fromPoint > 24) {
        return false;
    }

    const sourceValue = board[fromPoint];

    // 2. بررسی وجود مهره در مبدا
    if (sourceValue === 0) {
        return false;
    }

    // 3. بررسی تعلق مهره به بازیکن فعلی
    if ((sourceValue > 0 && currentTurn !== 'white') ||
        (sourceValue < 0 && currentTurn !== 'black')) {
        return false;
    }

    // 4. اگر مهره ای در بار باشد، دیگر مهره ها نباید بتوانند جابجا شوند
    if ((board[25] != 0 && currentTurn == 'white') && (fromPoint != 25)) {
        return false;
    }
    if ((board[0] != 0 && currentTurn == 'black') && (fromPoint != 0)) {
        return false;
    }


    let targetPoint;
    targetPoint = getTargetPoint(fromPoint, diceNumber, currentTurn);

    //bear off
    // 5. بررسی خارج از تخته نبودن
    if (targetPoint < 1 || targetPoint > 24) {
        //bear off
        if (canBearOff(currentTurn, board, fromPoint, diceNumber)) {
            return true;
        }
        return false;
    }

    const targetValue = board[targetPoint];

    // 6. بررسی اشغال بودن نقطه مقصد توسط حریف
    // اگر در نقطه مقصد مهره حریف باشد و تعداد آن بیشتر از 1 باشد، حرکت مجاز نیست
    if ((targetValue < -1 && currentTurn == 'white') || (targetValue > 1 && currentTurn == 'black')) {
        return false; // نقطه توسط بیش از یک مهره حریف اشغال شده
    }
    return true;
};


export const makeMove = (board, fromPoint, diceNumber, currentTurn, prevBoard, currentWhiteBornOff, currentBlackBornOff) => {
    const newBoard = [...board];
    let newWhiteBornOff = currentWhiteBornOff;
    let newBlackBornOff = currentBlackBornOff;
  
    let targetPoint = getTargetPoint(fromPoint, diceNumber, currentTurn);
  
    const sourceValue = newBoard[fromPoint];
    const targetValue = newBoard[targetPoint];
  
    // کاهش مهره از مبدا
    if (sourceValue > 0) {
      newBoard[fromPoint] = sourceValue - 1;
    } else {
      newBoard[fromPoint] = sourceValue + 1;
    }
  
    if (targetPoint < 1 || targetPoint > 24) {
      // bear off
      if (currentTurn === 'white') {
        newWhiteBornOff += 1;
      } else {
        newBlackBornOff += 1;
      }
    } else {
      // مدیریت نقطه مقصد
      increaseTargetValue(sourceValue, targetValue, newBoard, targetPoint, prevBoard);
    }
    
    return { newBoard, newWhiteBornOff, newBlackBornOff };
  };

