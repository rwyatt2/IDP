import { useEffect, useCallback } from 'react';
import { useDevPanelStore } from '@/stores/dev-panel-store';
import { usePersonaStore } from '@/stores';
import type { PersonaType } from '@/types/persona';

export function useDevPanelShortcuts() {
  const {
    isOpen,
    activeTour,
    togglePanel,
    closePanel,
    nextStep,
    previousStep,
    restartTour,
    skipTour,
  } = useDevPanelStore();

  const { setPersona } = usePersonaStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd/Ctrl + Shift + D: Toggle panel
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'd') {
        event.preventDefault();
        togglePanel();
        return;
      }

      // Don't process other shortcuts if typing in an input
      if (isInput) return;

      // Escape: Close panel or exit tour
      if (event.key === 'Escape') {
        if (activeTour) {
          skipTour();
        } else if (isOpen) {
          closePanel();
        }
        return;
      }

      // Tour navigation (only when tour is active)
      if (activeTour) {
        switch (event.key) {
          case 'ArrowRight':
            event.preventDefault();
            nextStep();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            previousStep();
            break;
          case 'r':
          case 'R':
            event.preventDefault();
            restartTour();
            break;
          case 's':
          case 'S':
            event.preventDefault();
            nextStep(); // Skip current step = go to next
            break;
        }
        return;
      }

      // Quick persona selection (only when panel is open and no tour active)
      if (isOpen && !activeTour) {
        const personaMap: Record<string, PersonaType> = {
          '1': 'developer',
          '2': 'tech-lead',
          '3': 'engineering-manager',
          '4': 'executive',
        };

        if (personaMap[event.key]) {
          event.preventDefault();
          setPersona(personaMap[event.key]);
        }
      }
    },
    [isOpen, activeTour, togglePanel, closePanel, nextStep, previousStep, restartTour, skipTour, setPersona]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Check for demo mode via URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      useDevPanelStore.getState().setDemoMode(true);
    }
  }, []);
}
