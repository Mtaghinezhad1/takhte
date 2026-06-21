export const AI_PROFILES = {
  1: {
    name: 'مبتدی',
    avatarKey: 'avatar_1',
    baseRating: 1150,
    description: 'تازه کار، اشتباهات اولیه دارد',
  },
  2: {
    name: 'تازه‌کار',
    avatarKey: 'avatar_2',
    baseRating: 1250,
    description: 'قوانین را بلد است اما هنوز ضعیف است',
  },
  3: {
    name: 'آموزش‌دیده',
    avatarKey: 'avatar_3',
    baseRating: 1350,
    description: 'با تمرینات پایه آشناست',
  },
  4: {
    name: 'نیمه‌حرفه‌ای',
    avatarKey: 'avatar_4',
    baseRating: 1450,
    description: 'تاکتیک‌های ساده را می‌فهمد',
  },
  5: {
    name: 'حرفه‌ای',
    avatarKey: 'avatar_5',
    baseRating: 1550,
    description: 'بازیکنی قابل قبول و کم‌اشتباه',
  },
  6: {
    name: 'استاد',
    avatarKey: 'avatar_6',
    baseRating: 1650,
    description: 'بازی موقعیتی خوبی دارد',
  },
  7: {
    name: 'خبره',
    avatarKey: 'avatar_7',
    baseRating: 1750,
    description: 'محاسبات ریسک را انجام می‌دهد',
  },
  8: {
    name: 'نخبه',
    avatarKey: 'avatar_8',
    baseRating: 1850,
    description: 'بازیکن قوی با استراتژی عمیق',
  },
  9: {
    name: 'افسانه‌ای',
    avatarKey: 'avatar_9',
    baseRating: 1950,
    description: 'فوق‌العاده، تقریباً شکست‌ناپذیر',
  },
  10: {
    name: 'بی‌نظیر',
    avatarKey: 'avatar_10',
    baseRating: 2050,
    description: 'نهایت قدرت AI، اشتباه نمی‌کند',
  },
};

export type AIProfile = {
  name: string;
  avatarKey: any; // یا ImageSourcePropType
  baseRating: number;
  description?: string;
};

export const getAIProfile = (level: number | string): AIProfile => {
  const key = Number(level);
  if (key >= 1 && key <= 10) {
    return AI_PROFILES[key];
  }
  return AI_PROFILES[10]; // پیش‌فرض قوی‌ترین سطح برای ورودی نامعتبر
};