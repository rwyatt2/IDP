import { Link } from 'react-router-dom';
import { useSystemHealth } from '@/hooks';
import { AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { CircularProgress, Skeleton } from '@/components/ui';

export function SystemHealthWidget() {
  const { data: health, isLoading } = useSystemHealth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Skeleton variant="circular" width={96} height={96} />
      </div>
    );
  }

  if (!health) return null;

  const healthPercentage = Math.round(health.overallHealth * 100);
  
  const getHealthVariant = () => {
    if (healthPercentage >= 90) return 'success';
    if (healthPercentage >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-4">
      {/* Overall Health */}
      <div className="flex items-center gap-4">
        <CircularProgress
          value={healthPercentage}
          size={80}
          strokeWidth={8}
          variant={getHealthVariant()}
          showLabel
        />
        <div>
          <p className="text-2xl font-bold text-text-primary">
            {health.healthy}/{health.total}
          </p>
          <p className="text-sm text-text-tertiary">Services Healthy</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-success-subtle text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-success-text" />
            <span className="font-semibold text-success-text">{health.healthy}</span>
          </div>
          <p className="text-xs text-success-text">Healthy</p>
        </div>
        <div className="p-2 rounded-lg bg-warning-subtle text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning-text" />
            <span className="font-semibold text-warning-text">{health.degraded}</span>
          </div>
          <p className="text-xs text-warning-text">Degraded</p>
        </div>
        <div className="p-2 rounded-lg bg-error-subtle text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-error-text" />
            <span className="font-semibold text-error-text">{health.critical}</span>
          </div>
          <p className="text-xs text-error-text">Critical</p>
        </div>
      </div>

      {/* Active Incidents */}
      {health.activeIncidents > 0 && (
        <Link
          to="/manage/incidents"
          className="flex items-center justify-between p-2 rounded-lg bg-error-subtle border border-error hover:bg-error-subtle/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-error-text" />
            <span className="text-sm font-medium text-error-text">
              {health.activeIncidents} active incident{health.activeIncidents > 1 ? 's' : ''}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-error-text" />
        </Link>
      )}
    </div>
  );
}
