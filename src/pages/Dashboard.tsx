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
import { useUserStore, useDashboardStore, usePersona } from '@/stores';
import { availableWidgets } from '@/data/mock-data';
import { Button, Badge } from '@/components/ui';
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
  TeamOverviewWidget,
  TeamMetricsWidget,
  StrategicKPIsWidget,
  RiskOverviewWidget,
  OrgHealthWidget,
} from '@/components/widgets';
import { WidgetLibrary } from '@/components/dashboard/WidgetLibrary';
import { Plus, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Extended widget components including persona-specific widgets
const widgetComponents: Record<string, React.ComponentType> = {
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
  // Persona-specific widgets
  'team-overview': TeamOverviewWidget,
  'team-metrics': TeamMetricsWidget,
  'strategic-kpis': StrategicKPIsWidget,
  'risk-overview': RiskOverviewWidget,
  'org-health': OrgHealthWidget,
};

// Persona-specific welcome messages
const personaWelcome = {
  developer: {
    greeting: 'Ready to ship?',
    subtitle: "Here's what needs your attention today",
    icon: <Zap className="w-5 h-5" />,
    color: 'text-blue-400',
  },
  'tech-lead': {
    greeting: 'Team Status',
    subtitle: 'Your team at a glance',
    icon: <Target className="w-5 h-5" />,
    color: 'text-violet-400',
  },
  'engineering-manager': {
    greeting: 'Organization Overview',
    subtitle: 'Cross-team visibility and metrics',
    icon: <Target className="w-5 h-5" />,
    color: 'text-emerald-400',
  },
  executive: {
    greeting: 'Executive Summary',
    subtitle: 'Strategic technology insights',
    icon: <Target className="w-5 h-5" />,
    color: 'text-amber-400',
  },
};

// Jobs to be done quick links for each persona
const personaQuickLinks = {
  developer: [
    { label: 'Create App', path: '/build/create', shortcut: 'C' },
    { label: 'View Deployments', path: '/deploy/deployments', shortcut: 'D' },
    { label: 'Search APIs', path: '/discover/api-docs', shortcut: 'S' },
    { label: 'View Incidents', path: '/manage/incidents', shortcut: 'I' },
  ],
  'tech-lead': [
    { label: 'Review Approvals', path: '/deploy/releases?filter=pending', shortcut: 'A' },
    { label: 'Team Health', path: '/manage/observability', shortcut: 'H' },
    { label: 'Dependencies', path: '/discover/dependencies', shortcut: 'G' },
    { label: 'On-Call Schedule', path: '/manage/incidents?tab=on-call', shortcut: 'O' },
  ],
  'engineering-manager': [
    { label: 'DORA Metrics', path: '/manage/analytics', shortcut: 'M' },
    { label: 'Cost Report', path: '/manage/costs', shortcut: 'C' },
    { label: 'Compliance', path: '/manage/analytics?tab=compliance', shortcut: 'S' },
    { label: 'Capacity', path: '/manage/analytics?tab=capacity', shortcut: 'P' },
  ],
  executive: [
    { label: 'Risk Report', path: '/executive/risk', shortcut: 'R' },
    { label: 'ROI Metrics', path: '/executive/roi', shortcut: 'I' },
    { label: 'Board Report', path: '/executive/reports', shortcut: 'B' },
    { label: 'Strategy', path: '/executive/strategy', shortcut: 'S' },
  ],
};

export function Dashboard() {
  const { user } = useUserStore();
  const { widgets, reorderWidgets, resetLayout } = useDashboardStore();
  const { persona, personaType } = usePersona();
  const [libraryOpen, setLibraryOpen] = useState(false);

  const welcome = personaWelcome[personaType];
  const quickLinks = personaQuickLinks[personaType];

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
      {/* Persona-Aware Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-surface border border-border-subtle',
            welcome.color
          )}>
            {welcome.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">
                {welcome.greeting}, {user?.name.split(' ')[0]}
              </h1>
              <Badge variant="accent" size="sm">{persona.name}</Badge>
            </div>
            <p className="text-text-tertiary mt-1">
              {welcome.subtitle}
            </p>
          </div>
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

      {/* Jobs-to-be-Done Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map((link) => (
          <a
            key={link.path}
            href={link.path}
            className={cn(
              'group flex items-center justify-between p-3 rounded-lg',
              'bg-surface border border-border-subtle',
              'hover:border-border-default hover:bg-surface-raised',
              'transition-all duration-fast'
            )}
          >
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
              {link.label}
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-canvas border border-border-subtle text-[10px] text-text-disabled font-mono">
              {link.shortcut}
            </kbd>
          </a>
        ))}
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
              const WidgetComponent = widgetComponents[instance.widgetId];
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
                  className="w-full p-12 rounded-xl border-2 border-dashed border-border-default hover:border-accent-border hover:bg-accent-subtle transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-surface group-hover:bg-accent-subtle flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Sparkles className="w-8 h-8 text-text-disabled group-hover:text-accent" />
                    </div>
                    <p className="font-medium text-text-primary">
                      Customize your dashboard
                    </p>
                    <p className="text-sm text-text-tertiary mt-1">
                      Add widgets to create your {persona.name.toLowerCase()} view
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Add Widget Button (when widgets exist) */}
            {widgets.length > 0 && widgets.length < 9 && (
              <button
                onClick={() => setLibraryOpen(true)}
                className="min-h-[200px] rounded-xl border-2 border-dashed border-border-default hover:border-accent-border hover:bg-accent-subtle transition-colors flex items-center justify-center group"
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-text-disabled group-hover:text-accent mx-auto mb-2" />
                  <span className="text-sm font-medium text-text-tertiary group-hover:text-accent-text">
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
