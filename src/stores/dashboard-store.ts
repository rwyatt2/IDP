import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WidgetInstance, WidgetSize } from '@/types';
import { currentUser } from '@/data/mock-data';

interface CustomWidgetData {
  title: string;
  description: string;
  size: WidgetSize;
  config: Record<string, unknown>;
}

interface DashboardState {
  widgets: WidgetInstance[];
  customWidgets: Record<string, CustomWidgetData>;
  isEditing: boolean;
  draggedWidget: string | null;
  
  // Actions
  addWidget: (widgetId: string, size?: WidgetSize) => void;
  addCustomWidget: (data: CustomWidgetData) => void;
  removeWidget: (instanceId: string) => void;
  updateWidgetPosition: (instanceId: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (instanceId: string, size: WidgetSize) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  setEditing: (isEditing: boolean) => void;
  setDraggedWidget: (widgetId: string | null) => void;
  resetLayout: () => void;
  getCustomWidget: (widgetId: string) => CustomWidgetData | undefined;
}

const defaultWidgets = currentUser.preferences.dashboardLayout.widgets;

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      customWidgets: {},
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

      addCustomWidget: (data) => {
        const widgets = get().widgets;
        const customWidgets = get().customWidgets;
        const customWidgetId = `custom-${Date.now()}`;
        
        const newWidget: WidgetInstance = {
          id: `widget-${Date.now()}`,
          widgetId: customWidgetId,
          position: { x: widgets.length % 3, y: Math.floor(widgets.length / 3) },
          size: data.size,
        };
        
        set({
          widgets: [...widgets, newWidget],
          customWidgets: {
            ...customWidgets,
            [customWidgetId]: data,
          },
        });
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
      
      resetLayout: () => set({ widgets: defaultWidgets, customWidgets: {} }),
      
      getCustomWidget: (widgetId) => get().customWidgets[widgetId],
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ widgets: state.widgets, customWidgets: state.customWidgets }),
    }
  )
);
