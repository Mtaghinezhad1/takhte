export const homeTourSteps = [
  {
    id: 'welcome',
    title: '👋 خوش آمدید!',
    content: 'به بازی تخته نرد خوش آمدید. بیایید با بخش‌های مختلف آشنا شویم.',
    target: 'profile',
    tooltipBackgroundColor: '#1a4b6e',
  },
  {
    id: 'gameCards',
    title: '🎯 کارت‌های بازی',
    content: 'برای شروع بازی، روی یکی از کارت‌های بازی کلیک کنید.',
    target: 'gameCard',
    tooltipBackgroundColor: '#7c3aed',
  },
  {
    id: 'profile',
    title: '📊 پروفایل شما',
    content: 'در این بخش آمار و اطلاعات کاربری شما نمایش داده می‌شود.',
    target: 'profileStats',
    tooltipBackgroundColor: '#1d5cdd',
  },
];

export const preGameTourSteps = [
  {
    id: 'settings',
    title: '⚙️ تنظیمات بازی',
    content: 'در این صفحه می‌توانید تنظیمات بازی را انجام دهید.',
    target: 'title',
    tooltipBackgroundColor: '#1a4b6e',
  },
  {
    id: 'score',
    title: '🎯 امتیاز مورد نیاز',
    content: 'با این اسلایدر، تعداد امتیاز مورد نیاز برای بردن را تنظیم کنید. (اعداد فرد ۱ تا ۱۵)',
    target: 'slider',
    tooltipBackgroundColor: '#1a4b6e',
  },
  {
    id: 'difficulty',
    title: '🤖 سطح سختی',
    content: 'سطح سختی هوش مصنوعی را تنظیم کنید. هرچه عدد بیشتر، هوش مصنوعی قوی‌تر.',
    target: 'difficultySlider',
    tooltipBackgroundColor: '#ea580c',
  },
  {
    id: 'start',
    title: '🚀 شروع بازی',
    content: 'وقتی تنظیمات را انجام دادید، روی دکمه "شروع بازی" کلیک کنید.',
    target: 'startButton',
    tooltipBackgroundColor: '#4CAF50',
  },
];

export const gameTourSteps = [
  {
    id: 'dice', // تاس‌ها
    title: '🎲 تاس‌ها',
    content: 'برای حرکت، روی تاس مورد نظر کلیک کنید. تاس‌های روشن قابل استفاده هستند.',
    target: 'dice',
    tooltipBackgroundColor: '#e74c3c',
  },
  {
    id: 'rightBarButton', // اشاره به دکمه داخل rightbar
    title: '⚙️ منوی بازی',
    content: 'برای دسترسی به تنظیمات و خروج از بازی، روی این دکمه کلیک کنید.',
    target: 'rightBarButton',
    tooltipBackgroundColor: '#3e7ced',
  },
];