import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import {
  Clock,
  Rocket,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface DORAMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: number;
  target: string;
  status: 'elite' | 'high' | 'medium' | 'low';
  description: string;
}

// Mock DORA metrics
const doraMetrics: DORAMetric[] = [
  {
    id: 'deployment-frequency',
    name: 'Deployment Frequency',
    value: '3.2',
    unit: 'per day',
    trend: 15,
    target: '> 1/day',
    status: 'elite',
    description: 'How often code is deployed to production',
  },
  {
    id: 'lead-time',
    name: 'Lead Time for Changes',
    value: '2.4',
    unit: 'hours',
    trend: -8,
    target: '< 1 day',
    status: 'elite',
    description: 'Time from commit to production',
  },
  {
    id: 'mttr',
    name: 'Mean Time to Recovery',
    value: '45',
    unit: 'minutes',
    trend: -12,
    target: '< 1 hour',
    status: 'elite',
    description: 'Time to restore service after incident',
  },
  {
    id: 'change-failure',
    name: 'Change Failure Rate',
    value: '5.5',
    unit: '%',
    trend: -2,
    target: '< 15%',
    status: 'elite',
    description: 'Percentage of deploys causing failures',
  },
];

const statusColors = {
  elite: { bg: 'bg-success-subtle', text: 'text-success-text', border: 'border-success-border' },
  high: { bg: 'bg-info-subtle', text: 'text-info-text', border: 'border-info-border' },
  medium: { bg: 'bg-warning-subtle', text: 'text-warning-text', border: 'border-warning-border' },
  low: { bg: 'bg-error-subtle', text: 'text-error-text', border: 'border-error-border' },
};

const statusLabels = {
  elite: 'Elite',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const metricIcons = {
  'deployment-frequency': <Rocket className="w-4 h-4" />,
  'lead-time': <Clock className="w-4 h-4" />,
  'mttr': <RotateCcw className="w-4 h-4" />,
  'change-failure': <AlertTriangle className="w-4 h-4" />,
};

export function TeamMetricsWidget() {
  // Calculate overall team performance
  const eliteCount = doraMetrics.filter(m => m.status === 'elite').length;

  return (
    <div>
      {/* Overall Performance Bar */}
      <div className="mb-6 p-4 rounded-lg bg-surface border border-border-subtle">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-secondary">Team Performance</span>
          <span className="text-xs text-text-tertiary">{eliteCount}/4 metrics at Elite level</span>
        </div>
        <div className="flex gap-1">
          {doraMetrics.map((metric) => (
            <div 
              key={metric.id}
              className={cn(
                'flex-1 h-2 rounded-full',
                statusColors[metric.status].bg
              )}
              title={`${metric.name}: ${statusLabels[metric.status]}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-text-disabled">Low</span>
          <span className="text-[10px] text-text-disabled">Elite</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {doraMetrics.map((metric) => (
          <div
            key={metric.id}
            className={cn(
              'p-4 rounded-lg border',
              statusColors[metric.status].bg,
              statusColors[metric.status].border
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <span className={cn('p-1.5 rounded', statusColors[metric.status].text, 'bg-white/10')}>
                {metricIcons[metric.id as keyof typeof metricIcons]}
              </span>
              <Badge variant={metric.status === 'elite' ? 'success' : metric.status === 'high' ? 'info' : 'warning'} size="sm">
                {statusLabels[metric.status]}
              </Badge>
            </div>
            
            <p className="text-xs text-text-tertiary mb-1">{metric.name}</p>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className={cn('text-2xl font-bold', statusColors[metric.status].text)}>
                {metric.value}
              </span>
              <span className="text-xs text-text-tertiary">{metric.unit}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-disabled">Target: {metric.target}</span>
              <div className={cn(
                'flex items-center gap-0.5 text-xs',
                metric.trend > 0 
                  ? (metric.id === 'change-failure' ? 'text-error-text' : 'text-success-text')
                  : (metric.id === 'change-failure' ? 'text-success-text' : 'text-error-text')
              )}>
                {metric.trend > 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(metric.trend)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      {/* Insight */}
      <div className="mt-4 p-3 rounded-lg bg-accent-subtle border border-accent-border">
        <p className="text-xs text-accent-text">
          <strong>Insight:</strong> Your team is performing at Elite level on 3/4 DORA metrics. 
          Consider focusing on reducing lead time to maintain this performance.
        </p>
      </div>
    </div>
  );
}
