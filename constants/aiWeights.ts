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
  BEAROFF: 'BEAROFF'
};

export const PHASES = {
  OPENING: 'OPENING',
  MIDDLEGAME: 'MIDDLEGAME',
  ENDGAME: 'ENDGAME'
};

export const STRATEGY_PHASE_WEIGHTS = {
  "BLITZ": {
    "OPENING": {
      "pipCount": 3.3330502291933954,
      "blots": 2.179057113175946,
      "hits": -2.7566325542471852,
      "closedPoints": 0.9959364393795707,
      "oppClosedPoint": 0.47557860349823156,
      "homeClosedDifference": 1.7008718414994193,
      "risk": 0.885643894902355,
      "primes": -2.6283670565748176,
      "anchorStrength": 2.7946040307416093,
      "desperateEscape": 0.529783795609122,
      "homeBoardStrength": 0.77144354875415,
      "opponentOnBar": 0.05319177646194029
    },
    "MIDDLEGAME": {
      "pipCount": 0.34177927287062504,
      "blots": -1.5990076857376065,
      "hits": 1.1952702037641303,
      "closedPoints": 1.6626565118665753,
      "oppClosedPoint": 0.3858515802922543,
      "homeClosedDifference": -0.02353173215699711,
      "risk": -0.32589567303468947,
      "primes": -0.7274796990151091,
      "anchorStrength": 2.202365603914768,
      "desperateEscape": -0.08620221480803855,
      "homeBoardStrength": 1.1679591567173757,
      "opponentOnBar": -2.466573855059055
    },
    "ENDGAME": {
      "pipCount": 0.5989766254832021,
      "blots": 1.1869736005092086,
      "hits": 1.0007477375779195,
      "oppClosedPoint": 0.5,
      "homeClosedDifference": -0.0348556841515468,
      "closedPoints": -0.2084144953024969,
      "risk": 1.2370638590810759,
      "primes": -2.551434862903178,
      "anchorStrength": 1.7298857042206763,
      "desperateEscape": -0.7950614561090078,
      "bearoffEfficiency": 1.7297080490945742,
      "safety": 2.434307504221984
    }
  },
  "PRIME": {
    "OPENING": {
      "pipCount": 1.6230400047988962,
      "blots": -0.005532904661879251,
      "hits": -0.3492864774790385,
      "oppClosedPoint": 0.6448142303414616,
      "homeClosedDifference": 2.214073819884862,
      "closedPoints": 2.052509742723196,
      "risk": -2.3165490866764435,
      "primes": 0.9152991447447334,
      "anchorStrength": -1.175805983827505,
      "desperateEscape": -0.5377481170704443,
      "flexibility": -0.13041282416602507,
      "blockingValue": -0.2150945625395097
    },
    "MIDDLEGAME": {
      "pipCount": 0.2735973149218949,
      "blots": 5,
      "hits": 1.255720922954279,
      "oppClosedPoint": 0.5,
      "homeClosedDifference": 0.2941472900804398,
      "closedPoints": -0.9673490784713559,
      "risk": -2.6245752377843017,
      "primes": -0.6037012138317632,
      "anchorStrength": 0.39331520535607156,
      "desperateEscape": 0.5534113757675662,
      "primeExtensionValue": 0.8113538439033903,
      "blockingValue": 1.5299542717993762
    },
    "ENDGAME": {
      "pipCount": 0.937043622431559,
      "blots": -0.054125079020058586,
      "hits": 2.894892033820502,
      "oppClosedPoint": 0.18905024504796797,
      "homeClosedDifference": -0.5980413122901969,
      "closedPoints": 2.0231746350722144,
      "risk": 0.0996047930384163,
      "primes": 2.6946754035978837,
      "anchorStrength": -0.9286801911258576,
      "desperateEscape": -0.899463116125606,
      "bearoffPrep": 0.6259963524483626,
      "safetyInHome": 2.645079928787693
    }
  },
  "HOLDING": {
    "OPENING": {
      "pipCount": -1.0922387970438079,
      "blots": 1.2517542968309006,
      "hits": -2.081757616774204,
      "oppClosedPoint": 0.5,
      "homeClosedDifference": 1.655856067567231,
      "closedPoints": 0.21062002557629989,
      "risk": 1.966139111680743,
      "primes": 0.80170031202294,
      "anchorStrength": 2.196256300848535,
      "escapePotential": 1.3282951344541025
    },
    "MIDDLEGAME": {
      "pipCount": -3,
      "blots": 4.190947476330709,
      "hits": 4.066762791799154,
      "oppClosedPoint": 0.5,
      "homeClosedDifference": 1.7054957359374092,
      "closedPoints": 2.4434375130032095,
      "risk": 1.869138238533183,
      "primes": 1.0152947481294428,
      "anchorStrength": -2.400358327273482,
      "counterPlay": 0.8097258448324665
    },
    "ENDGAME": {
      "pipCount": 0.029713236231443438,
      "blots": 0.538748497959969,
      "hits": 0.49385224895421986,
      "oppClosedPoint": 0.20899762765347024,
      "homeClosedDifference": -0.8967296280229061,
      "closedPoints": 1.9621113333157554,
      "risk": 1.9919604410236689,
      "primes": 3.0130015318867116,
      "anchorStrength": -0.3328894221645224,
      "desperateEscape": -1.721418105950122,
      "savingGammon": -1.0928141388929538
    }
  },
  "BACKGAME": {
    "MIDDLEGAME": {
      "pipCount": -1.512918478200392,
      "blots": 3.522881659091256,
      "hits": 2.4356860646444147,
      "oppClosedPoint": 0.6710809411751947,
      "homeClosedDifference": 1.816601030880968,
      "closedPoints": 0.026218470912978936,
      "risk": 0.3308981485349649,
      "primes": 0.5524391461942737,
      "timingValue": 1.7278492533093643,
      "anchorStrength": -1.866530792604589,
      "anchorCount": -0.6818307550156664,
      "hittingNumbers": -2.0293536420788714
    },
    "ENDGAME": {
      "pipCount": 2.763382425619311,
      "blots": -1.679099100101387,
      "hits": 1.7916726192975188,
      "oppClosedPoint": 0.8849155510997947,
      "homeClosedDifference": -2.5302141417149056,
      "closedPoints": 0.11199880894688341,
      "risk": -0.44544320652401354,
      "primes": -3,
      "anchorStrength": -0.29828530376254114,
      "anchorCount": 0.5536052753834483,
      "hitAndContain": 5,
      "containmentValue": 0.4068513846040238
    }
  },
  "RACE": {
    "OPENING": {
      "pipCount": 1.5958159730807853,
      "blots": 2.3168478030529034,
      "hits": 1.796822620678132,
      "closedPoints": -2.8909279277353264,
      "risk": 3.9959443302547935,
      "primes": -0.49551636247268716,
      "wastage": -0.4039248336317445,
      "contactAvoidance": -0.6243589247423005
    },
    "MIDDLEGAME": {
      "pipCount": 4.163787201449711,
      "blots": 3.6786973363443054,
      "hits": -1.0906216651429081,
      "closedPoints": 0.4534787647999795,
      "risk": -1.3732008757119476,
      "primes": 1.5800731831113441,
      "wastage": 3.804476071949107,
      "gapControl": -2.351419879400949
    },
    "ENDGAME": {
      "pipCount": 2.715646222996521,
      "blots": -0.0022889655165805323,
      "hits": -1.3196220455371561,
      "closedPoints": -1.2275287995848634,
      "risk": -1.2146423759519727,
      "primes": -0.1813615362746338,
      "bearoffEfficiency": 0.6485489605552825,
      "wastage": -2.232756738311315
    }
  },
  "BEAROFF": {
    "ENDGAME": {
      "pipCount": 0.9693753731980376,
      "blots": -1.5760315523962714,
      "hits": 1.8116870564991365,
      "closedPoints": -1.6479703557607772,
      "risk": -1.7133013665024395,
      "primes": 2.2756657269855323,
      "bearoffEfficiency": 1.6852785012299458,
      "diceUtilization": 3.8014133179226692,
      "averageDistance": 2.1416450628182058,
      "safety": 2.5137905415440676
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



