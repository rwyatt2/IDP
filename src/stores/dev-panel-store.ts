import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DevPanelState, PersonaTour } from '@/types/dev-panel';
import { PERSONA_TOURS, DEMO_SCENARIOS } from '@/types/dev-panel';
import { usePersonaStore } from './persona-store';

interface DevPanelStore extends DevPanelState {
  // Panel actions
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  toggleMinimize: () => void;
  
  // Tour actions
  startTour: (tourId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  restartTour: () => void;
  completeTour: () => void;
  goToStep: (index: number) => void;
  
  // Demo mode
  setDemoMode: (enabled: boolean) => void;
  loadScenario: (scenarioId: string) => void;
  clearScenario: () => void;
  
  // Getters
  getCurrentStep: () => PersonaTour['steps'][0] | null;
  getTourProgress: () => { current: number; total: number };
  getCompletedToursCount: () => number;
  isTourCompleted: (tourId: string) => boolean;
}

export const useDevPanelStore = create<DevPanelStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      isMinimized: false,
      activeTour: null,
      currentStepIndex: 0,
      tourCompleted: false,
      demoMode: false,
      activeScenario: null,
      completedTours: [],
      tourProgress: {},
      tourStartTimes: {},
      stepViewTimes: {},

      // Panel actions
      togglePanel: () => {
        const { isOpen, closePanel, openPanel } = get();
        if (isOpen) {
          closePanel();
        } else {
          openPanel();
        }
      },

      openPanel: () => {
        set({ isOpen: true, isMinimized: false });
      },

      closePanel: () => {
        const { activeTour, currentStepIndex, tourProgress } = get();
        
        // Save progress if tour is active
        if (activeTour) {
          set({
            isOpen: false,
            tourProgress: {
              ...tourProgress,
              [activeTour.id]: currentStepIndex,
            },
          });
        } else {
          set({ isOpen: false });
        }
      },

      toggleMinimize: () => {
        set((state) => ({ isMinimized: !state.isMinimized }));
      },

      // Tour actions
      startTour: (tourId: string) => {
        const tour = PERSONA_TOURS.find((t) => t.id === tourId);
        if (!tour) return;

        // Switch to the persona for this tour
        usePersonaStore.getState().setPersona(tour.persona);

        // Get saved progress - but reset if tour was completed or out of bounds
        const savedProgress = get().tourProgress[tourId] || 0;
        const startIndex = savedProgress >= tour.steps.length ? 0 : savedProgress;

        set({
          activeTour: tour,
          currentStepIndex: startIndex,
          tourCompleted: false,
          isMinimized: false, // Keep panel open but it will close automatically
          isOpen: false, // Close the dev panel to show the tour
          tourStartTimes: {
            ...get().tourStartTimes,
            [tourId]: Date.now(),
          },
          stepViewTimes: {
            ...get().stepViewTimes,
            [tourId]: [],
          },
        });
      },

      nextStep: () => {
        const { activeTour, currentStepIndex, completeTour, stepViewTimes } = get();
        if (!activeTour) return;

        // Record step view time
        const tourTimes = stepViewTimes[activeTour.id] || [];
        tourTimes[currentStepIndex] = Date.now();

        if (currentStepIndex < activeTour.steps.length - 1) {
          set({
            currentStepIndex: currentStepIndex + 1,
            stepViewTimes: {
              ...stepViewTimes,
              [activeTour.id]: tourTimes,
            },
          });
        } else {
          completeTour();
        }
      },

      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1 });
        }
      },

      skipTour: () => {
        set({
          activeTour: null,
          currentStepIndex: 0,
          tourCompleted: false,
          isMinimized: false,
        });
      },

      restartTour: () => {
        const { activeTour, tourProgress } = get();
        if (!activeTour) return;

        set({
          currentStepIndex: 0,
          tourCompleted: false,
          tourProgress: {
            ...tourProgress,
            [activeTour.id]: 0,
          },
        });
      },

      completeTour: () => {
        const { activeTour, completedTours, tourProgress } = get();
        if (!activeTour) return;

        const newCompletedTours = completedTours.includes(activeTour.id)
          ? completedTours
          : [...completedTours, activeTour.id];

        set({
          tourCompleted: true,
          completedTours: newCompletedTours,
          tourProgress: {
            ...tourProgress,
            [activeTour.id]: activeTour.steps.length,
          },
        });
      },

      goToStep: (index: number) => {
        const { activeTour } = get();
        if (!activeTour) return;

        if (index >= 0 && index < activeTour.steps.length) {
          set({ currentStepIndex: index });
        }
      },

      // Demo mode
      setDemoMode: (enabled: boolean) => {
        set({ demoMode: enabled });
        if (!enabled) {
          set({ activeScenario: null });
        }
      },

      loadScenario: (scenarioId: string) => {
        const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
        if (scenario) {
          set({ activeScenario: scenario, demoMode: true });
        }
      },

      clearScenario: () => {
        set({ activeScenario: null });
      },

      // Getters
      getCurrentStep: () => {
        const { activeTour, currentStepIndex } = get();
        if (!activeTour) return null;
        return activeTour.steps[currentStepIndex] || null;
      },

      getTourProgress: () => {
        const { activeTour, currentStepIndex } = get();
        if (!activeTour) return { current: 0, total: 0 };
        return {
          current: currentStepIndex + 1,
          total: activeTour.steps.length,
        };
      },

      getCompletedToursCount: () => {
        return get().completedTours.length;
      },

      isTourCompleted: (tourId: string) => {
        return get().completedTours.includes(tourId);
      },
    }),
    {
      name: 'dev-panel-storage',
      partialize: (state) => ({
        completedTours: state.completedTours,
        tourProgress: state.tourProgress,
      }),
    }
  )
);

// Hook for accessing current tour step with navigation
export function useTourNavigation() {
  const store = useDevPanelStore();
  const currentStep = store.getCurrentStep();
  const progress = store.getTourProgress();

  return {
    currentStep,
    progress,
    activeTour: store.activeTour,
    tourCompleted: store.tourCompleted,
    isFirstStep: store.currentStepIndex === 0,
    isLastStep: store.activeTour
      ? store.currentStepIndex === store.activeTour.steps.length - 1
      : false,
    next: store.nextStep,
    previous: store.previousStep,
    skip: store.skipTour,
    restart: store.restartTour,
    goTo: store.goToStep,
  };
}
