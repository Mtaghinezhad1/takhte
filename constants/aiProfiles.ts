export const AI_PROFILES = {
  1: {
    name: 'تازه‌کار',
    avatar: require('@/assets/avatar/1 (1).jpeg'),
    baseRating: 800,
    description: 'مبتدی که تازه قوانین را یاد گرفته',
  },
  2: {
    name: 'آموزش‌دیده',
    avatar: require('@/assets/avatar/1 (13).jpeg'),
    baseRating: 1000,
  },
  3: {
    name: 'حرفه‌ای',
    avatar: require('@/assets/avatar/1 (15).jpeg'),
    baseRating: 1300,
  },
  4: {
    name: 'حرفه‌ای',
    avatar: require('@/assets/avatar/1 (1).jpg'),
    baseRating: 1300,
  },
  // ... تا سطح 10
};

export type AIProfile = {
  name: string;
  avatar: any; // یا ImageSourcePropType
  baseRating: number;
  description?: string;
};

export const getAIProfile = (level: number | string): AIProfile => {
  const key = Number(level);
  return AI_PROFILES[key] || AI_PROFILES[3]; // پیش‌فرض سطح ۳
};