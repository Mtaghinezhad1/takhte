import { updateUserAvatar, updateUserProfile } from '@/services/api/userApi';

export const userService = {
    calculateElo(myRating, opponentRating, isWin, matchLength = 5) {
        const sqrtN = Math.sqrt(matchLength);
        // const K = 4 * sqrtN;
        const K = 10 * sqrtN;
        const expected = 1 / (1 + Math.pow(10, ((opponentRating - myRating) * sqrtN) / 2000));
        const score = isWin ? 1 : 0;
        const delta = K * (score - expected);
        return Math.round(myRating + delta);
    },

    async updateProfile({ username, gender }) {
        const payload = {};

        if (username !== undefined) {
            const trimmed = String(username).trim();
            if (trimmed.length < 3) {
                throw new Error('نام کاربری باید حداقل ۳ کاراکتر باشد');
            }
            payload.username = trimmed;
        }

        if (gender !== undefined) {
            payload.gender = gender;
        }

        if (Object.keys(payload).length === 0) {
            return null; // چیزی برای آپدیت نیست
        }

        // فقط این‌جا سرویس، API رو صدا می‌زنه
        return await updateUserProfile(payload);
    },

    async updateAvatar(avatarKey) {
        if (!avatarKey || typeof avatarKey !== 'string') {
            throw new Error('آواتار معتبر نیست');
        }

        return await updateUserAvatar(avatarKey);
    },
}