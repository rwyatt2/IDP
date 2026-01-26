import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores';
import { availableWidgets } from '@/data/mock-data';
import { Drawer, Button, SearchInput, Badge, Input } from '@/components/ui';
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
  Sparkles,
  ChevronLeft,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import type { WidgetType, WidgetSize } from '@/types';

const widgetIcons: Record<WidgetType | 'custom', React.ReactNode> = {
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
  'custom': <Sparkles className="w-5 h-5" />,
};

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'library' | 'create';

interface CustomWidgetForm {
  title: string;
  description: string;
  size: WidgetSize;
  contentType: 'text' | 'embed' | 'metrics';
  content: string;
}

export function WidgetLibrary({ isOpen, onClose }: WidgetLibraryProps) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [customWidget, setCustomWidget] = useState<CustomWidgetForm>({
    title: '',
    description: '',
    size: 'medium',
    contentType: 'text',
    content: '',
  });
  
  const { widgets, addWidget, addCustomWidget } = useDashboardStore();

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

  const handleCreateWidget = () => {
    if (!customWidget.title.trim()) return;
    
    addCustomWidget({
      title: customWidget.title,
      description: customWidget.description,
      size: customWidget.size,
      config: {
        contentType: customWidget.contentType,
        content: customWidget.content,
      },
    });
    
    // Reset form and go back to library
    setCustomWidget({
      title: '',
      description: '',
      size: 'medium',
      contentType: 'text',
      content: '',
    });
    setViewMode('library');
  };

  const handleClose = () => {
    setViewMode('library');
    setSearch('');
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={viewMode === 'library' ? 'Widget Library' : 'Create Custom Widget'}
      description={viewMode === 'library' ? 'Add widgets to customize your dashboard' : 'Build your own widget with custom content'}
      size="lg"
      footer={
        viewMode === 'create' ? (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setViewMode('library')}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back to Library
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateWidget}
              disabled={!customWidget.title.trim()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Widget
            </Button>
          </div>
        ) : undefined
      }
    >
      {viewMode === 'library' ? (
        <>
          {/* Create Custom Widget Card */}
          <button
            onClick={() => setViewMode('create')}
            className="w-full mb-5 p-4 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent/60 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-text-primary flex items-center gap-2">
                  Create Custom Widget
                  <Badge variant="info" size="sm">New</Badge>
                </h4>
                <p className="text-sm text-text-tertiary mt-0.5">
                  Build your own widget with custom text, embeds, or metrics
                </p>
              </div>
              <Plus className="w-5 h-5 text-accent" />
            </div>
          </button>

          {/* Search */}
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search widgets..."
              onClear={() => setSearch('')}
            />
          </div>

          {/* Widget Grid */}
          <div className="space-y-3">
            {filteredWidgets.map((widget) => {
              const isAdded = activeWidgetIds.includes(widget.id);
              return (
                <div
                  key={widget.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200',
                    isAdded
                      ? 'border-accent/40 bg-accent/10'
                      : 'border-border-subtle bg-surface-raised hover:border-border-default hover:bg-surface'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                        isAdded
                          ? 'bg-accent/20 text-accent'
                          : 'bg-surface text-text-tertiary'
                      )}
                    >
                      {widgetIcons[widget.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text-primary">{widget.title}</h4>
                        <Badge variant={widget.size === 'small' ? 'neutral' : 'info'} size="sm">
                          {widget.size}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-tertiary line-clamp-2">
                        {widget.description}
                      </p>
                    </div>
                    <Button
                      variant={isAdded ? 'ghost' : 'secondary'}
                      size="sm"
                      className={cn(
                        'flex-shrink-0',
                        isAdded && 'text-success hover:bg-success/10'
                      )}
                      onClick={() => handleAddWidget(widget.id)}
                      disabled={isAdded}
                      leftIcon={isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    >
                      {isAdded ? 'Added' : 'Add'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-8 text-text-tertiary">
              No widgets found matching "{search}"
            </div>
          )}
        </>
      ) : (
        /* Create Widget Form */
        <div className="space-y-5">
          {/* Widget Preview */}
          <div className="p-4 rounded-xl border border-border-subtle bg-surface-raised">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary truncate">
                  {customWidget.title || 'Untitled Widget'}
                </h4>
                <p className="text-xs text-text-tertiary truncate">
                  {customWidget.description || 'No description'}
                </p>
              </div>
              <Badge variant="info" size="sm">{customWidget.size}</Badge>
            </div>
            <div className="h-20 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center text-text-disabled text-sm">
              {customWidget.contentType === 'text' && 'Text content preview'}
              {customWidget.contentType === 'embed' && 'Embedded content preview'}
              {customWidget.contentType === 'metrics' && 'Metrics display preview'}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Widget Title *
            </label>
            <Input
              value={customWidget.title}
              onChange={(e) => setCustomWidget({ ...customWidget, title: e.target.value })}
              placeholder="My Custom Widget"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <Input
              value={customWidget.description}
              onChange={(e) => setCustomWidget({ ...customWidget, description: e.target.value })}
              placeholder="Brief description of what this widget shows"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Widget Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'full'] as WidgetSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setCustomWidget({ ...customWidget, size })}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    customWidget.size === size
                      ? 'bg-accent text-white'
                      : 'bg-surface-raised border border-border-subtle text-text-secondary hover:border-border-default'
                  )}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'text', label: 'Text', icon: FileText },
                { id: 'embed', label: 'Embed', icon: LinkIcon },
                { id: 'metrics', label: 'Metrics', icon: BarChart3 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCustomWidget({ ...customWidget, contentType: id as 'text' | 'embed' | 'metrics' })}
                  className={cn(
                    'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    customWidget.contentType === id
                      ? 'bg-accent text-white'
                      : 'bg-surface-raised border border-border-subtle text-text-secondary hover:border-border-default'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {customWidget.contentType === 'text' && 'Content'}
              {customWidget.contentType === 'embed' && 'Embed URL'}
              {customWidget.contentType === 'metrics' && 'Metrics Query'}
            </label>
            <textarea
              value={customWidget.content}
              onChange={(e) => setCustomWidget({ ...customWidget, content: e.target.value })}
              placeholder={
                customWidget.contentType === 'text' ? 'Enter your widget content...' :
                customWidget.contentType === 'embed' ? 'https://example.com/embed' :
                'metrics.query.path'
              }
              className="input min-h-[100px] resize-none"
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
