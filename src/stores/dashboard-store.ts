import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WidgetInstance, WidgetSize } from '@/types';
import { currentUser } from '@/data/mock-data';

interface DashboardState {
  widgets: WidgetInstance[];
  isEditing: boolean;
  draggedWidget: string | null;
  
  // Actions
  addWidget: (widgetId: string, size?: WidgetSize) => void;
  removeWidget: (instanceId: string) => void;
  updateWidgetPosition: (instanceId: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (instanceId: string, size: WidgetSize) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  setEditing: (isEditing: boolean) => void;
  setDraggedWidget: (widgetId: string | null) => void;
  resetLayout: () => void;
}

const defaultWidgets = currentUser.preferences.dashboardLayout.widgets;

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      isEditing: false,
      draggedWidget: null,

      addWidget: (widgetId, size = 'medium') => {
        const widgets = get().widgets;
        const newWidget: WidgetInstance = {
          id: `widget-${Date.now()}`,
          widgetId,
          position: { x: widgets.length % 3, y: Math.floor(widgets.length / 3) },
          size,
        };
        set({ widgets: [...widgets, newWidget] });
      },

      removeWidget: (instanceId) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== instanceId),
        })),

      updateWidgetPosition: (instanceId, position) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === instanceId ? { ...w, position } : w
          ),
        })),

      updateWidgetSize: (instanceId, size) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === instanceId ? { ...w, size } : w
          ),
        })),

      reorderWidgets: (activeId, overId) => {
        const widgets = get().widgets;
        const activeIndex = widgets.findIndex((w) => w.id === activeId);
        const overIndex = widgets.findIndex((w) => w.id === overId);
        
        if (activeIndex === -1 || overIndex === -1) return;
        
        const newWidgets = [...widgets];
        const [removed] = newWidgets.splice(activeIndex, 1);
        newWidgets.splice(overIndex, 0, removed);
        
        set({ widgets: newWidgets });
      },

      setEditing: (isEditing) => set({ isEditing }),
      
      setDraggedWidget: (widgetId) => set({ draggedWidget: widgetId }),
      
      resetLayout: () => set({ widgets: defaultWidgets }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ widgets: state.widgets }),
    }
  )
);
