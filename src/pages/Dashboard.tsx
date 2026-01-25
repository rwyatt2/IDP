import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useUserStore, useDashboardStore } from '@/stores';
import { availableWidgets } from '@/data/mock-data';
import { Button } from '@/components/ui';
import {
  WidgetWrapper,
  MyApplicationsWidget,
  RecentDeploymentsWidget,
  OnCallWidget,
  SystemHealthWidget,
  CostTrendsWidget,
  PendingApprovalsWidget,
  QuickActionsWidget,
  RecentActivityWidget,
  AlertsWidget,
} from '@/components/widgets';
import { WidgetLibrary } from '@/components/dashboard/WidgetLibrary';
import { Plus, RotateCcw, Sparkles } from 'lucide-react';
import type { WidgetType } from '@/types';

const widgetComponents: Record<WidgetType, React.ComponentType> = {
  'my-applications': MyApplicationsWidget,
  'on-call-schedule': OnCallWidget,
  'recent-deployments': RecentDeploymentsWidget,
  'cost-trends': CostTrendsWidget,
  'system-health': SystemHealthWidget,
  'team-projects': RecentActivityWidget,
  'pending-approvals': PendingApprovalsWidget,
  'performance-metrics': RecentActivityWidget,
  'quick-actions': QuickActionsWidget,
  'recent-activity': RecentActivityWidget,
  'alerts': AlertsWidget,
  'resources': SystemHealthWidget,
};

export function Dashboard() {
  const { user } = useUserStore();
  const { widgets, reorderWidgets, resetLayout } = useDashboardStore();
  const [libraryOpen, setLibraryOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderWidgets(active.id as string, over.id as string);
    }
  };

  const getWidgetTitle = (widgetId: string) => {
    const widget = availableWidgets.find((w) => w.id === widgetId);
    return widget?.title || widgetId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening across your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetLayout}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLibraryOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Widget
          </Button>
        </div>
      </div>

      {/* Widget Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {widgets.map((instance) => {
              const WidgetComponent = widgetComponents[instance.widgetId as WidgetType];
              if (!WidgetComponent) return null;

              return (
                <WidgetWrapper
                  key={instance.id}
                  instanceId={instance.id}
                  title={getWidgetTitle(instance.widgetId)}
                  size={instance.size}
                >
                  <WidgetComponent />
                </WidgetWrapper>
              );
            })}

            {/* Empty State / Add Widget Card */}
            {widgets.length === 0 && (
              <div className="col-span-full">
                <button
                  onClick={() => setLibraryOpen(true)}
                  className="w-full p-12 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Sparkles className="w-8 h-8 text-slate-400 group-hover:text-primary-600" />
                    </div>
                    <p className="font-medium text-slate-900">
                      Customize your dashboard
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Add widgets to create your personalized view
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Add Widget Button (when widgets exist) */}
            {widgets.length > 0 && widgets.length < 9 && (
              <button
                onClick={() => setLibraryOpen(true)}
                className="min-h-[200px] rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors flex items-center justify-center group"
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-slate-500 group-hover:text-primary-700">
                    Add Widget
                  </span>
                </div>
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Widget Library Modal */}
      <WidgetLibrary isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />
    </div>
  );
}
