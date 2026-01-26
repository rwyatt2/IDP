import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import {
  DollarSign,
  Zap,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface StrategicKPI {
  id: string;
  name: string;
  value: string;
  change: number;
  changeLabel: string;
  status: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

const strategicKPIs: StrategicKPI[] = [
  {
    id: 'technology-roi',
    name: 'Technology ROI',
    value: '3.2x',
    change: 0.4,
    changeLabel: 'vs last quarter',
    status: 'positive',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Return on technology investments',
  },
  {
    id: 'engineering-efficiency',
    name: 'Engineering Efficiency',
    value: '87%',
    change: 5,
    changeLabel: 'vs industry avg',
    status: 'positive',
    icon: <Zap className="w-5 h-5" />,
    description: 'Team productivity index',
  },
  {
    id: 'platform-adoption',
    name: 'Platform Adoption',
    value: '94%',
    change: 8,
    changeLabel: 'YoY growth',
    status: 'positive',
    icon: <Users className="w-5 h-5" />,
    description: 'Developer engagement rate',
  },
  {
    id: 'innovation-index',
    name: 'Innovation Index',
    value: '72',
    change: -3,
    changeLabel: 'vs last quarter',
    status: 'negative',
    icon: <Target className="w-5 h-5" />,
    description: 'New feature delivery rate',
  },
];

export function StrategicKPIsWidget() {
  return (
    <div>
      {/* Executive Summary */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-surface to-surface-raised border border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-text-primary">Technology Health Score</h4>
            <p className="text-sm text-text-tertiary">Overall platform performance</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-success-text">A</span>
              <span className="text-lg text-text-tertiary">/ A+</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-success-text">
              <ArrowUpRight className="w-4 h-4" />
              Improved from B+
            </div>
          </div>
        </div>
        
        {/* Health indicators */}
        <div className="flex gap-2">
          {['Security', 'Performance', 'Reliability', 'Cost'].map((area, i) => (
            <div key={area} className="flex-1 text-center">
              <div className={cn(
                'h-1.5 rounded-full mb-1',
                i < 3 ? 'bg-success' : 'bg-warning'
              )} />
              <span className="text-xs text-text-tertiary">{area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {strategicKPIs.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 rounded-lg bg-surface border border-border-subtle hover:border-border-default transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-tertiary">{kpi.icon}</span>
              <Badge 
                variant={kpi.status === 'positive' ? 'success' : kpi.status === 'negative' ? 'error' : 'default'}
                size="sm"
              >
                {kpi.status === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(kpi.change)}{typeof kpi.change === 'number' && kpi.change % 1 === 0 ? '%' : ''}
              </Badge>
            </div>
            
            <p className="text-xs text-text-tertiary mb-1">{kpi.name}</p>
            <p className="text-2xl font-bold text-text-primary mb-1">{kpi.value}</p>
            <p className="text-xs text-text-disabled">{kpi.changeLabel}</p>
          </div>
        ))}
      </div>

      {/* Business Impact Correlation */}
      <div className="mt-6 p-4 rounded-lg bg-surface border border-border-subtle">
        <h4 className="text-sm font-semibold text-text-secondary mb-4">Business Impact Correlation</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded bg-canvas">
            <p className="text-xs text-text-tertiary mb-1">Customer Satisfaction</p>
            <p className="text-xl font-bold text-success-text">+12%</p>
            <p className="text-xs text-text-disabled">since platform adoption</p>
          </div>
          <div className="text-center p-3 rounded bg-canvas">
            <p className="text-xs text-text-tertiary mb-1">Time to Market</p>
            <p className="text-xl font-bold text-success-text">-45%</p>
            <p className="text-xs text-text-disabled">faster feature delivery</p>
          </div>
          <div className="text-center p-3 rounded bg-canvas">
            <p className="text-xs text-text-tertiary mb-1">Incident Impact</p>
            <p className="text-xl font-bold text-success-text">-67%</p>
            <p className="text-xs text-text-disabled">reduced customer impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}
