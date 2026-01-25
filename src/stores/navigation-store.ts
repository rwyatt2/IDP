import { create } from 'zustand';
import type { Phase, Breadcrumb } from '@/types';

interface NavigationState {
  currentPhase: Phase;
  breadcrumbs: Breadcrumb[];
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  searchQuery: string;
  commandPaletteOpen: boolean;
  
  // Actions
  setPhase: (phase: Phase) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPhase: 'discover',
  breadcrumbs: [],
  sidebarCollapsed: false,
  searchOpen: false,
  searchQuery: '',
  commandPaletteOpen: false,

  setPhase: (phase) => set({ currentPhase: phase }),
  
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  openSearch: () => set({ searchOpen: true }),
  
  closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
}));
