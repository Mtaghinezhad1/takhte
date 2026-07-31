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
            "pipCount": 2.4070936423635754,
            "blots": 2.1257482427352525,
            "hits": -1.2084360382859705,
            "closedPoints": 0.5879993735702445,
            "risk": 1.2180183227715429,
            "primes": -0.5381988073652768,
            "homeBoardStrength": 1.8,
            "opponentOnBar": 1.3045387213962396
        },
        "MIDDLEGAME": {
            "pipCount": 2.1233672776354457,
            "blots": 0.036058681763706746,
            "hits": 0.9035612918962529,
            "closedPoints": 1.5033444961192646,
            "risk": 1.6931661020709936,
            "primes": -1.1142524845440849,
            "homeBoardStrength": 1.1827720034712634,
            "opponentOnBar": -0.13569280213128065
        },
        "ENDGAME": {
            "pipCount": 1.9416367807401773,
            "blots": 1.3826651756676318,
            "hits": 0.8937353387096886,
            "closedPoints": 0.7954103442258424,
            "risk": 0.5085542474041225,
            "primes": -0.33399365124858754,
            "bearoffEfficiency": 0.8900081195968026,
            "safety": 1.7225863541760922
        }
    },
    "PRIME": {
        "OPENING": {
            "pipCount": 0.4291763243824258,
            "blots": -0.05632010907895524,
            "hits": 1.0172062551712155,
            "closedPoints": 1.2,
            "risk": -0.5542257665900043,
            "primes": 2.5626463384638667,
            "flexibility": -0.36040973196216475,
            "blockingValue": 0.6
        },
        "MIDDLEGAME": {
            "pipCount": 0.09435915558682684,
            "blots": 1.1610314378536217,
            "hits": 1.6331480283660567,
            "closedPoints": 1.3,
            "risk": 0.019578992918923954,
            "primes": 0.8336045065575457,
            "primeExtensionValue": 1.6569857393861946,
            "blockingValue": 2.322130139038264
        },
        "ENDGAME": {
            "pipCount": 0.8575869147621215,
            "blots": 1.0115902274489246,
            "hits": 1.1548461762333215,
            "closedPoints": 1.006338287722765,
            "risk": 0.7377401426075945,
            "primes": 2.6930552403342833,
            "bearoffPrep": 1.7909116469315274,
            "safetyInHome": 2.1678454213444542
        }
    },
    "RACE": {
        "OPENING": {
            "pipCount": 1.5318280480902144,
            "blots": 1.4230198646284926,
            "hits": 0.2,
            "closedPoints": 0.10471601678940068,
            "risk": 1.0894117273246828,
            "primes": 0.7371073330317992,
            "wastage": -0.7051862738806153,
            "contactAvoidance": 0.3920430681654762
        },
        "MIDDLEGAME": {
            "pipCount": 5,
            "blots": 1.434133364072509,
            "hits": -0.7495308294014718,
            "closedPoints": 0.3,
            "risk": 0.1,
            "primes": -0.03251293391912374,
            "wastage": 1.4231523107250146,
            "gapControl": -0.33550871956497064
        },
        "ENDGAME": {
            "pipCount": 2.7052060944399297,
            "blots": 0.1,
            "hits": 0.1,
            "closedPoints": -1.5995418939382648,
            "risk": -0.42708902074316624,
            "primes": -0.23366911957462466,
            "bearoffEfficiency": 2,
            "wastage": -1
        }
    },
    "HOLDING": {
        "OPENING": {
            "pipCount": 0.5805052368116298,
            "blots": 0.5428614940250078,
            "hits": 1.8551605988954607,
            "closedPoints": 1.2744631510733035,
            "risk": 0.9543741343009421,
            "primes": 0.6,
            "anchorStrength": 1.5,
            "escapePotential": 1.7411924870046211
        },
        "MIDDLEGAME": {
            "pipCount": 0.5,
            "blots": 2.09992841253559,
            "hits": 2.061294745982023,
            "closedPoints": 2.1439266296639143,
            "risk": 1.5764405266416048,
            "primes": 2.280117373693048,
            "anchorStrength": 0.4804954740765929,
            "counterPlay": 0.3353591498642229
        },
        "ENDGAME": {
            "pipCount": -1.3755051188232592,
            "blots": 0.8,
            "hits": 0.6935493209628395,
            "closedPoints": 1.7868868402278664,
            "risk": 0.4613474348762292,
            "primes": 2.0858859571092063,
            "desperateEscape": 0.9628929684902051,
            "savingGammon": 0.2854948139417609
        }
    },
    "BACKGAME": {
        "MIDDLEGAME": {
            "pipCount": 0.3,
            "blots": 2.2813268771185276,
            "hits": 3.8030180093350303,
            "closedPoints": 1.2678539315528004,
            "risk": 0.9,
            "primes": 1.4234551503610202,
            "timingValue": 2.8408604853370747,
            "anchorCount": 0.4579301639839891,
            "hittingNumbers": -1.4403406160239172
        },
        "ENDGAME": {
            "pipCount": -0.5584867136124037,
            "blots": 1.2603909004970522,
            "hits": 0.06650339630998325,
            "closedPoints": 0.3611846170323213,
            "risk": -0.09736707291069657,
            "primes": -0.09435448771005445,
            "hitAndContain": 4.033054242921292,
            "containmentValue": -1.0716866866341026
        }
    },
    "BEAROFF": {
        "ENDGAME": {
            "pipCount": 1.8919569219337329,
            "blots": -1.6828037859769975,
            "hits": 0.3,
            "closedPoints": 2.7494267929892233,
            "risk": 0.7057053730873446,
            "primes": -0.14433181541000822,
            "bearoffEfficiency": 1.8999304488052902,
            "diceUtilization": 2.1217446270901,
            "averageDistance": -1,
            "safety": 1.865367551813923
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



