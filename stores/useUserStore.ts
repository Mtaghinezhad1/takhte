import { userService } from '@/services/userService';
import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  username: 'بازیکن مهمان',
  avatar: require('@/assets/avatar/1 (6).jpeg'),
  elo: 1480,
  coins: 0,

  setUsername: (name) => set({ username: name }),
  setAvatar: (imgUrl) => set({ avatar: imgUrl }),
  setCoins: (amount) => set({ coins: amount }),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  deductCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),

  // به‌روزرسانی ELO کاربر و حریف بعد از مسابقه
  updateEloAfterMatch: (winner, userColor, opponentElo, matchLength = 5) => {
    const { elo: userElo } = get();
    const isWin = (userColor === winner);

    const newUserElo = userService.calculateElo(userElo, opponentElo, isWin, matchLength);
    const newOpponentElo = userService.calculateElo(opponentElo, userElo, !isWin, matchLength);

    set({ elo: newUserElo });

    return { newUserElo, newOpponentElo };
  },

  resetUser: () => set({
    username: 'بازیکن مهمان',
    avatar: null,
    elo: 1500,
    coins: 0,
  }),
}));

export default useUserStore;