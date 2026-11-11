export const AI_LEVELS = {
  '1': {  // بسیار مبتدی - نویز بالا
    noise: 0.6,
  },
  '2': {  // مبتدی
    noise: 0.5,
  },
  '3': {  // آسان
    noise: 0.4,
  },
  '4': {  // متوسط رو به پایین
    noise: 0.3,
  },
  '5': {  // متوسط
    noise: 0.25,
  },
  '6': {  // متوسط رو به بالا
    noise: 0.2,
  },
  '7': {  // خوب
    noise: 0.15,
  },
  '8': {  // خیلی خوب
    noise: 0.1,
  },
  '9': {  // حرفه‌ای
    noise: 0.05,
  },
  '10': { // استاد - بدون نویز
    noise: 0,
  },
};

export const STRATEGIES = {
  BLITZ: 'BLITZ',
  PRIME: 'PRIME',
  RACE: 'RACE',
  HOLDING: 'HOLDING',
  BACKGAME: 'BACKGAME',
};

export const PHASES = {
  OPENING: 'OPENING',
  MIDDLEGAME: 'MIDDLEGAME',
  ENDGAME: 'ENDGAME'
};

export const STRATEGY_PHASE_WEIGHTS = {
  "BLITZ": {
    "OPENING": {
      "blots": -0.12150999782660388,
      "hits": -2.362481546571369,
      "closedPoints": 0.41365710636667613,
      "oppClosedPoint": 0.8886682898803246,
      "homeClosedDifference": 4.1521225761808305,
      "risk": -0.6026816477532488,
      "primes": 0.28422150582672195,
      "anchorStrength": 3.4001173724892473,
      "desperateEscape": 2.5190353180539207,
      "homeBoardStrength": -1.6853450246391712,
      "opponentOnBar": 1.092901784132022
    },
    "MIDDLEGAME": {
      "blots": 0.02166757963965471,
      "hits": -1.2183557656960067,
      "closedPoints": 4.348140650236052,
      "oppClosedPoint": 2.5793884188930387,
      "homeClosedDifference": 2.207412765330944,
      "risk": 0.05774669070293932,
      "primes": -5,
      "anchorStrength": -0.3624487637116185,
      "desperateEscape": -2.282736220357342,
      "homeBoardStrength": 4.919672887846281,
      "opponentOnBar": -3
    },
    "ENDGAME": {
      "blots": 1.079129014788735,
      "hits": 1.0007477375779195,
      "oppClosedPoint": 0.7918775451200653,
      "homeClosedDifference": -0.0348556841515468,
      "closedPoints": -0.261835015189381,
      "risk": 1.2370638590810759,
      "primes": -2.844975522374468,
      "anchorStrength": 1.7298857042206763,
      "desperateEscape": -0.5918951907811967,
      "bearoffEfficiency": 1.7572735953058434,
      "safety": 2.5723155447151194
    }
  },
  "PRIME": {
    "OPENING": {
      "blots": -0.6056745303479034,
      "hits": -2.28677557013306,
      "oppClosedPoint": 3.9631456173641944,
      "homeClosedDifference": -2.6475479613327475,
      "closedPoints": 3.85595751390919,
      "risk": -3,
      "primes": 3.796866764991226,
      "anchorStrength": -2.171653307259667,
      "desperateEscape": -1.2512702803717441,
      "flexibility": 0.2682415750011182,
      "blockingValue": 1.7753566981617777
    },
    "MIDDLEGAME": {
      "blots": 4.995194514094175,
      "hits": 0.17518067048639274,
      "oppClosedPoint": 2.8641741450773,
      "homeClosedDifference": -1.629404358290222,
      "closedPoints": -3,
      "risk": -3,
      "primes": 2.0683429246224945,
      "anchorStrength": -1.5765603158573744,
      "desperateEscape": -2.2483261681953275,
      "primeExtensionValue": 1.089766369944058,
      "blockingValue": 2.313835285320502
    },
    "ENDGAME": {
      "blots": -0.32743824798482385,
      "hits": 2.6564997764728546,
      "oppClosedPoint": -0.09062906080844413,
      "homeClosedDifference": -0.8489969926495391,
      "closedPoints": 2.081144569908985,
      "risk": 0.0996047930384163,
      "primes": 2.6281186270484866,
      "anchorStrength": -0.8632995539245341,
      "desperateEscape": -0.899463116125606,
      "bearoffPrep": 0.6259963524483626,
      "safetyInHome": 2.7217249892597946
    }
  },
  "HOLDING": {
    "OPENING": {
      "blots": 1.8971387359447387,
      "hits": -1.6777120906048566,
      "oppClosedPoint": 2.528917414096862,
      "homeClosedDifference": 4.42776324490884,
      "closedPoints": 1.6036145761491443,
      "risk": 2.347551216559315,
      "primes": 2.198430592173531,
      "anchorStrength": 1.5682637441280973,
      "escapePotential": 2.3539322005948566
    },
    "MIDDLEGAME": {
      "blots": 6.56461626913577,
      "hits": 3.979568167663789,
      "oppClosedPoint": 1.4089867238046012,
      "homeClosedDifference": 4.280469786118835,
      "closedPoints": 1.908384453063576,
      "risk": 3.741271788802811,
      "primes": 4.328870658704557,
      "anchorStrength": -3,
      "counterPlay": 3.4974394848246675
    },
    "ENDGAME": {
      "blots": 0.538748497959969,
      "hits": 0.49385224895421986,
      "oppClosedPoint": 0.40217786656420007,
      "homeClosedDifference": -0.8967296280229061,
      "closedPoints": 1.9621113333157554,
      "risk": 1.9919604410236689,
      "primes": 2.7424751760631154,
      "anchorStrength": -0.3016223072238747,
      "desperateEscape": -1.8084802321722409,
      "savingGammon": -1.0413659029306623
    }
  },
  "BACKGAME": {
    "MIDDLEGAME": {
      "blots": 4.540999424565655,
      "hits": 5,
      "oppClosedPoint": -2.878115062590845,
      "homeClosedDifference": 1.0956266119181333,
      "closedPoints": 1.9888692758569815,
      "risk": 3.6219174725609786,
      "primes": 2.648565895225316,
      "timingValue": 5.213373622898546,
      "anchorStrength": -0.15727812879616834,
      "anchorCount": -4.878886990162802,
      "hittingNumbers": -3
    },
    "ENDGAME": {
      "blots": -1.5238181022637785,
      "hits": 2.0290537076084854,
      "oppClosedPoint": 0.48900305144685924,
      "homeClosedDifference": -2.5302141417149056,
      "closedPoints": 0.26028657491457163,
      "risk": -0.5580855651724536,
      "primes": -3,
      "anchorStrength": -0.19512166057143412,
      "anchorCount": 0.7762645470876564,
      "hitAndContain": 5,
      "containmentValue": 0.4068513846040238
    }
  },
  "RACE": {
    "OPENING": {
      "blots": 2.478981739663958,
      "hits": 3.010740170416245,
      "closedPoints": -1.3052113771376552,
      "risk": 4.667086853939155,
      "primes": -3,
      "wastage": -2.9519125542641973,
      "contactAvoidance": 2.6572930006723205
    },
    "MIDDLEGAME": {
      "blots": 2.489091319699925,
      "hits": 2.4514165989719205,
      "closedPoints": 3.381871738141527,
      "risk": -2.4395998415229223,
      "primes": 2.228283431686264,
      "wastage": 3.3396092737671825,
      "gapControl": -3.225234203664348
    },
    "ENDGAME": {
      "blots": 0.29335584484137583,
      "hits": -1.3196220455371561,
      "closedPoints": -1.327074002295069,
      "risk": -1.2146423759519727,
      "primes": -0.20074003671887283,
      "bearoffEfficiency": 0.6889126107106173,
      "wastage": -2.2608697824610737
    }
  }
};

export const LEVEL_CONFIG = {
  '1': { depth: 0, difficulty: '1' },
  '2': { depth: 0, difficulty: '2' },
  '3': { depth: 0, difficulty: '3' },
  '4': { depth: 0, difficulty: '4' },
  '5': { depth: 0, difficulty: '5' },
  '6': { depth: 0, difficulty: '6' },
  '7': { depth: 0, difficulty: '7' },
  '8': { depth: 0, difficulty: '8' },
  '9': { depth: 0, difficulty: '9' },
  '10': { depth: 0, difficulty: '10' },
};






















