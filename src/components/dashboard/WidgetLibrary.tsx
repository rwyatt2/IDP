import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores';
import { availableWidgets } from '@/data/mock-data';
import { Modal, Button, SearchInput, Badge } from '@/components/ui';
import {
  LayoutGrid,
  Activity,
  Rocket,
  DollarSign,
  Clock,
  CheckSquare,
  Zap,
  Bell,
  BarChart3,
  Server,
  Plus,
  Check,
} from 'lucide-react';
import type { WidgetType } from '@/types';

const widgetIcons: Record<WidgetType, React.ReactNode> = {
  'my-applications': <LayoutGrid className="w-5 h-5" />,
  'on-call-schedule': <Clock className="w-5 h-5" />,
  'recent-deployments': <Rocket className="w-5 h-5" />,
  'cost-trends': <DollarSign className="w-5 h-5" />,
  'system-health': <Activity className="w-5 h-5" />,
  'team-projects': <Server className="w-5 h-5" />,
  'pending-approvals': <CheckSquare className="w-5 h-5" />,
  'performance-metrics': <BarChart3 className="w-5 h-5" />,
  'quick-actions': <Zap className="w-5 h-5" />,
  'recent-activity': <Activity className="w-5 h-5" />,
  'alerts': <Bell className="w-5 h-5" />,
  'resources': <Server className="w-5 h-5" />,
};

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WidgetLibrary({ isOpen, onClose }: WidgetLibraryProps) {
  const [search, setSearch] = useState('');
  const { widgets, addWidget } = useDashboardStore();

  const activeWidgetIds = widgets.map((w) => w.widgetId);

  const filteredWidgets = availableWidgets.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddWidget = (widgetId: string) => {
    const widget = availableWidgets.find((w) => w.id === widgetId);
    if (widget) {
      addWidget(widgetId, widget.size);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Widget Library"
      description="Add widgets to customize your dashboard"
      size="lg"
    >
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search widgets..."
          onClear={() => setSearch('')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
        {filteredWidgets.map((widget) => {
          const isAdded = activeWidgetIds.includes(widget.id);
          return (
            <div
              key={widget.id}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                isAdded
                  ? 'border-primary-200 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isAdded
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {widgetIcons[widget.type]}
                </div>
                <Badge variant={widget.size === 'small' ? 'neutral' : 'info'} size="sm">
                  {widget.size}
                </Badge>
              </div>
              <h4 className="font-medium text-slate-900 mb-1">{widget.title}</h4>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {widget.description}
              </p>
              <Button
                variant={isAdded ? 'ghost' : 'secondary'}
                size="sm"
                className="w-full"
                onClick={() => handleAddWidget(widget.id)}
                disabled={isAdded}
                leftIcon={isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              >
                {isAdded ? 'Added' : 'Add Widget'}
              </Button>
            </div>
          );
        })}
      </div>

      {filteredWidgets.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No widgets found matching "{search}"
        </div>
      )}
    </Modal>
  );
}
