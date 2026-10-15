import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';
import { create } from 'zustand';

const useRTLStore = create((set, get) => ({
  isRTL: false,
  initialized: false,

  // یک بار موقع بالا اومدن اپ صدا زده میشه
  initialize: () => {
    if (get().initialized) return;

    try {
      const locales = Localization.getLocales();
      const isRTLSystem = locales?.[0]?.textDirection === 'rtl';
      const isRTLManager = I18nManager.isRTL;
      set({
        isRTL: isRTLSystem || isRTLManager,
        initialized: true,
      });
    } catch (error) {
      console.error('Error detecting RTL:', error);
      set({ isRTL: I18nManager.isRTL, initialized: true });
    }
  },

  // اگه خواستی دستی هم تغییر بدی
  setIsRTL: (value) => set({ isRTL: value }),
}));

export default useRTLStore;