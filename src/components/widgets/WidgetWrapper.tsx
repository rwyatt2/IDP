import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
import { useDashboardStore } from '@/stores';
import type { WidgetSize } from '@/types';

interface WidgetWrapperProps {
  instanceId: string;
  title: string;
  size: WidgetSize;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export function WidgetWrapper({
  instanceId,
  title,
  size,
  children,
  isLoading,
  error,
}: WidgetWrapperProps) {
  const { removeWidget, updateWidgetSize } = useDashboardStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: instanceId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 lg:col-span-2',
    large: 'col-span-1 lg:col-span-3',
    full: 'col-span-full',
  };

  const toggleSize = () => {
    const sizes: WidgetSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(size);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    updateWidgetSize(instanceId, nextSize);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'card',
        sizeClasses[size],
        isDragging && 'opacity-50 ring-2 ring-primary-400 shadow-elevated z-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleSize}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {size === 'large' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => removeWidget(instanceId)}
            className="p-1 rounded text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-danger-600">
            <p>Failed to load widget</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
