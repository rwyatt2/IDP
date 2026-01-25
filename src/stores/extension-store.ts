import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Extension } from '@/types';
import { extensions as mockExtensions } from '@/data/mock-data';

interface ExtensionState {
  extensions: Extension[];
  installedIds: string[];
  favoriteIds: string[];
  isLoading: boolean;
  
  // Actions
  installExtension: (id: string) => void;
  uninstallExtension: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getInstalledExtensions: () => Extension[];
  getFeaturedExtensions: () => Extension[];
  getExtensionsByPhase: (phase: string) => Extension[];
  getExtensionsByCategory: (category: string) => Extension[];
}

export const useExtensionStore = create<ExtensionState>()(
  persist(
    (set, get) => ({
      extensions: mockExtensions,
      installedIds: mockExtensions.filter((e) => e.installed).map((e) => e.id),
      favoriteIds: ['system-catalog', 'release-management', 'observability'],
      isLoading: false,

      installExtension: (id) =>
        set((state) => ({
          installedIds: [...state.installedIds, id],
          extensions: state.extensions.map((e) =>
            e.id === id ? { ...e, installed: true, downloads: e.downloads + 1 } : e
          ),
        })),

      uninstallExtension: (id) =>
        set((state) => ({
          installedIds: state.installedIds.filter((i) => i !== id),
          favoriteIds: state.favoriteIds.filter((i) => i !== id),
          extensions: state.extensions.map((e) =>
            e.id === id ? { ...e, installed: false } : e
          ),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((i) => i !== id)
            : [...state.favoriteIds, id],
        })),

      getInstalledExtensions: () => {
        const state = get();
        return state.extensions.filter((e) => state.installedIds.includes(e.id));
      },

      getFeaturedExtensions: () => {
        return get().extensions.filter((e) => e.featured);
      },

      getExtensionsByPhase: (phase) => {
        return get().extensions.filter((e) => e.phase === phase);
      },

      getExtensionsByCategory: (category) => {
        return get().extensions.filter((e) => e.category === category);
      },
    }),
    {
      name: 'extension-storage',
      partialize: (state) => ({
        installedIds: state.installedIds,
        favoriteIds: state.favoriteIds,
      }),
    }
  )
);
