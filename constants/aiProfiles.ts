export const AI_PROFILES = {
  1: {
    name: 'مبتدی',
    avatar: require('@/assets/avatar/1 (1).jpeg'),
    baseRating: 1549,
    description: 'تازه کار، اشتباهات اولیه دارد',
  },
  2: {
    name: 'تازه‌کار',
    avatar: require('@/assets/avatar/1 (2).jpeg'),
    baseRating: 1536,
    description: 'قوانین را بلد است اما هنوز ضعیف است',
  },
  3: {
    name: 'آموزش‌دیده',
    avatar: require('@/assets/avatar/1 (3).jpeg'),
    baseRating: 1477,
    description: 'با تمرینات پایه آشناست',
  },
  4: {
    name: 'نیمه‌حرفه‌ای',
    avatar: require('@/assets/avatar/1 (4).jpeg'),
    baseRating: 1478,
    description: 'تاکتیک‌های ساده را می‌فهمد',
  },
  5: {
    name: 'حرفه‌ای',
    avatar: require('@/assets/avatar/1 (5).jpeg'),
    baseRating: 1479,
    description: 'بازیکنی قابل قبول و کم‌اشتباه',
  },
  6: {
    name: 'استاد',
    avatar: require('@/assets/avatar/1 (6).jpeg'),
    baseRating: 1499,
    description: 'بازی موقعیتی خوبی دارد',
  },
  7: {
    name: 'خبره',
    avatar: require('@/assets/avatar/1 (7).jpeg'),
    baseRating: 1577,
    description: 'محاسبات ریسک را انجام می‌دهد',
  },
  8: {
    name: 'نخبه',
    avatar: require('@/assets/avatar/1 (8).jpeg'),
    baseRating: 1461,
    description: 'بازیکن قوی با استراتژی عمیق',
  },
  9: {
    name: 'افسانه‌ای',
    avatar: require('@/assets/avatar/1 (9).jpeg'),
    baseRating: 1481,
    description: 'فوق‌العاده، تقریباً شکست‌ناپذیر',
  },
  10: {
    name: 'بی‌نظیر',
    avatar: require('@/assets/avatar/1 (10).jpeg'),
    baseRating: 1463,
    description: 'نهایت قدرت AI، اشتباه نمی‌کند',
  },
};

export type AIProfile = {
  name: string;
  avatar: any; // یا ImageSourcePropType
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