// config/avatars.config.js
export const AVATAR_CONFIG = {
    defaultKey: 'avatar_1',
    paths: {
        avatar_1: require('@/assets/avatar/1101.jpeg'),
        avatar_2: require('@/assets/avatar/1102.jpeg'),
        avatar_3: require('@/assets/avatar/1103.jpeg'),
        avatar_4: require('@/assets/avatar/1104.jpeg'),
        avatar_5: require('@/assets/avatar/1105.jpeg'),
        avatar_6: require('@/assets/avatar/1106.jpeg'),
        avatar_7: require('@/assets/avatar/1107.jpeg'),
        avatar_8: require('@/assets/avatar/1108.jpeg'),
        avatar_9: require('@/assets/avatar/1109.jpeg'),
        avatar_10: require('@/assets/avatar/1110.jpeg'),
        avatar_11: require('@/assets/avatar/1111.jpeg'),
        avatar_12: require('@/assets/avatar/1112.jpeg'),
    },
    // می‌تونید requirements اضافه کنید
    requirements: {
        avatar_8: { minElo: 1500 },
        avatar_9: { minElo: 1800 },
        avatar_10: { minElo: 2000, minCoins: 500 },
    }
};

export const getAvatarByKey = (key) => {
    return AVATAR_CONFIG.paths[key] || AVATAR_CONFIG.paths[AVATAR_CONFIG.defaultKey];
};

export const getAllAvatars = () => {
    return Object.entries(AVATAR_CONFIG.paths).map(([key, source]) => ({
        key,
        source,
        requirements: AVATAR_CONFIG.requirements[key] || null
    }));
};

export const isAvatarUnlocked = (avatarKey, userElo, userCoins) => {
    const requirements = AVATAR_CONFIG.requirements[avatarKey];
    if (!requirements) return true; // بدون نیازمندی = آنلاک شده

    if (requirements.minElo && userElo < requirements.minElo) return false;
    if (requirements.minCoins && userCoins < requirements.minCoins) return false;

    return true;
};