import storageService from '@/services/storageService';
import { create } from 'zustand';

const useTourStore = create((set, get) => ({
  // ========== وضعیت اولیه ==========
  tours: {
    home: { completed: false, currentStep: 0 },
    pregame: { completed: false, currentStep: 0 },
    game: { completed: false, currentStep: 0 },
  },
  
  activeTour: null,
  isTourVisible: false,
  isLoading: true,
  error: null,
  
  settings: {
    enabled: true,
    showOnFirstLaunch: true,
  },

  // ========== متدهای ذخیره‌سازی ==========
  
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const savedData = await storageService.loadToursStatus();
      
      if (savedData && savedData.tours) {
        set({ 
          tours: savedData.tours,
          settings: savedData.settings || get().settings,
        });
      }
    } catch (error) {
      console.error('Error initializing tours:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveToStorage: async () => {
    try {
      const state = get();
      await storageService.saveToursStatus({
        tours: state.tours,
        settings: state.settings,
      });
      return true;
    } catch (error) {
      console.error('Error saving tours:', error);
      set({ error: error.message });
      return false;
    }
  },

  // ========== متدهای مدیریت تور ==========
  
  initializeTour: (tourId) => {
    const tour = get().tours[tourId];
    if (!tour) {
      console.warn(`Tour ${tourId} not found`);
      return;
    }
    
    if (tour.completed) {
      set({ activeTour: null, isTourVisible: false });
      return;
    }
    
    set({ 
      activeTour: tourId, 
      isTourVisible: true,
    });
  },

  completeTour: async (tourId) => {
    try {
      const state = get();
      const newState = {
        ...state,
        tours: {
          ...state.tours,
          [tourId]: { 
            completed: true,
            currentStep: 0 
          },
        },
        activeTour: null,
        isTourVisible: false,
      };
      
      // ابتدا ذخیره کن
      const saved = await storageService.saveToursStatus({
        tours: newState.tours,
        settings: newState.settings,
      });
      
      if (saved) {
        set(newState);
      } else {
        throw new Error('Failed to save tour completion');
      }
    } catch (error) {
      console.error('Error completing tour:', error);
      set({ error: error.message });
    }
  },

  nextStep: (tourId) => {
    set((state) => ({
      tours: {
        ...state.tours,
        [tourId]: {
          ...state.tours[tourId],
          currentStep: state.tours[tourId].currentStep + 1,
        },
      },
    }));
  },

  previousStep: (tourId) => {
    set((state) => ({
      tours: {
        ...state.tours,
        [tourId]: {
          ...state.tours[tourId],
          currentStep: Math.max(0, state.tours[tourId].currentStep - 1),
        },
      },
    }));
  },

  closeTour: () => {
    set({ isTourVisible: false });
  },

  resetTour: async (tourId) => {
    try {
      set((state) => ({
        tours: {
          ...state.tours,
          [tourId]: { 
            completed: false, 
            currentStep: 0 
          },
        },
      }));
      await get().saveToStorage();
    } catch (error) {
      console.error('Error resetting tour:', error);
      set({ error: error.message });
    }
  },

  resetAllTours: async () => {
    try {
      set({
        tours: {
          home: { completed: false, currentStep: 0 },
          pregame: { completed: false, currentStep: 0 },
          game: { completed: false, currentStep: 0 },
        },
        activeTour: null,
        isTourVisible: false,
      });
      await get().saveToStorage();
    } catch (error) {
      console.error('Error resetting all tours:', error);
      set({ error: error.message });
    }
  },

  // ========== متدهای کمکی ==========
  
  isTourCompleted: (tourId) => {
    return get().tours[tourId]?.completed || false;
  },

  getCurrentStep: (tourId) => {
    return get().tours[tourId]?.currentStep || 0;
  },

  getTourStatus: (tourId) => {
    return get().tours[tourId] || { completed: false, currentStep: 0 };
  },

  clearError: () => {
    set({ error: null });
  },
}));

// مقداردهی اولیه خودکار
useTourStore.getState().initialize();

export default useTourStore;