import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import {
  AlertTriangle,
  Shield,
  Server,
  Lock,
  FileWarning,
  ChevronRight,
  Clock,
  TrendingDown,
} from 'lucide-react';

interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'operational' | 'compliance' | 'vendor';
  status: 'open' | 'mitigating' | 'monitoring';
  impact: string;
  dueDate?: string;
}

const risks: RiskItem[] = [
  {
    id: '1',
    title: 'Critical Dependency Update Required',
    description: 'Log4j vulnerability affecting 3 services',
    severity: 'critical',
    category: 'security',
    status: 'mitigating',
    impact: 'High - Customer data exposure risk',
    dueDate: '2 days',
  },
  {
    id: '2',
    title: 'SSL Certificate Expiring',
    description: 'api.company.com certificate expires in 14 days',
    severity: 'high',
    category: 'operational',
    status: 'open',
    impact: 'Medium - Service disruption risk',
    dueDate: '14 days',
  },
  {
    id: '3',
    title: 'SOC 2 Audit Finding',
    description: 'Access review process documentation incomplete',
    severity: 'medium',
    category: 'compliance',
    status: 'monitoring',
    impact: 'Medium - Compliance certification risk',
    dueDate: '30 days',
  },
  {
    id: '4',
    title: 'Vendor Contract Renewal',
    description: 'AWS contract renewal due for negotiation',
    severity: 'low',
    category: 'vendor',
    status: 'open',
    impact: 'Low - Cost optimization opportunity',
    dueDate: '60 days',
  },
];

const severityConfig = {
  critical: { color: 'text-error-text', bg: 'bg-error-subtle', border: 'border-error-border', icon: AlertTriangle },
  high: { color: 'text-warning-text', bg: 'bg-warning-subtle', border: 'border-warning-border', icon: AlertTriangle },
  medium: { color: 'text-info-text', bg: 'bg-info-subtle', border: 'border-info-border', icon: FileWarning },
  low: { color: 'text-text-secondary', bg: 'bg-surface-raised', border: 'border-border-subtle', icon: FileWarning },
};

const categoryIcons = {
  security: <Shield className="w-4 h-4" />,
  operational: <Server className="w-4 h-4" />,
  compliance: <Lock className="w-4 h-4" />,
  vendor: <FileWarning className="w-4 h-4" />,
};

const statusConfig = {
  open: { label: 'Open', color: 'error' as const },
  mitigating: { label: 'Mitigating', color: 'warning' as const },
  monitoring: { label: 'Monitoring', color: 'info' as const },
};

export function RiskOverviewWidget() {
  const criticalCount = risks.filter(r => r.severity === 'critical').length;
  const highCount = risks.filter(r => r.severity === 'high').length;

  return (
    <div>
      {/* Risk Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-error-subtle border border-error-border text-center">
          <p className="text-2xl font-bold text-error-text">{criticalCount}</p>
          <p className="text-xs text-error-text">Critical</p>
        </div>
        <div className="p-3 rounded-lg bg-warning-subtle border border-warning-border text-center">
          <p className="text-2xl font-bold text-warning-text">{highCount}</p>
          <p className="text-xs text-warning-text">High</p>
        </div>
        <div className="p-3 rounded-lg bg-info-subtle border border-info-border text-center">
          <p className="text-2xl font-bold text-info-text">{risks.filter(r => r.severity === 'medium').length}</p>
          <p className="text-xs text-info-text">Medium</p>
        </div>
        <div className="p-3 rounded-lg bg-surface-raised border border-border-subtle text-center">
          <p className="text-2xl font-bold text-text-secondary">{risks.filter(r => r.severity === 'low').length}</p>
          <p className="text-xs text-text-tertiary">Low</p>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-3">
        {risks.map((risk) => {
          const config = severityConfig[risk.severity];
          const StatusIcon = config.icon;
          
          return (
            <div
              key={risk.id}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                config.bg,
                config.border,
                'hover:brightness-110'
              )}
            >
              <div className="flex items-start gap-3">
                <span className={config.color}>
                  <StatusIcon className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn('font-medium text-sm', config.color)}>{risk.title}</h4>
                    <Badge 
                      variant={statusConfig[risk.status].color} 
                      size="sm"
                    >
                      {statusConfig[risk.status].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary mb-2">{risk.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-disabled">
                        {categoryIcons[risk.category]}
                      </span>
                      <span className="text-xs text-text-disabled">{risk.impact}</span>
                    </div>
                    {risk.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        Due in {risk.dueDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <TrendingDown className="w-4 h-4 text-success-text" />
          <span>Risk score improved 12% this month</span>
        </div>
        <Link 
          to="/executive/risk"
          className="flex items-center gap-1 text-sm text-accent-text hover:text-accent"
        >
          View full risk register
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
