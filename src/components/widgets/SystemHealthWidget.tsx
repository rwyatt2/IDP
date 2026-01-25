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
          <p className="text-2xl font-bold text-slate-900">
            {health.healthy}/{health.total}
          </p>
          <p className="text-sm text-slate-500">Services Healthy</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-success-50 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-success-600" />
            <span className="font-semibold text-success-700">{health.healthy}</span>
          </div>
          <p className="text-xs text-success-600">Healthy</p>
        </div>
        <div className="p-2 rounded-lg bg-warning-50 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning-600" />
            <span className="font-semibold text-warning-700">{health.degraded}</span>
          </div>
          <p className="text-xs text-warning-600">Degraded</p>
        </div>
        <div className="p-2 rounded-lg bg-danger-50 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-danger-600" />
            <span className="font-semibold text-danger-700">{health.critical}</span>
          </div>
          <p className="text-xs text-danger-600">Critical</p>
        </div>
      </div>

      {/* Active Incidents */}
      {health.activeIncidents > 0 && (
        <Link
          to="/manage/incidents"
          className="flex items-center justify-between p-2 rounded-lg bg-danger-50 border border-danger-200 hover:bg-danger-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger-600" />
            <span className="text-sm font-medium text-danger-700">
              {health.activeIncidents} active incident{health.activeIncidents > 1 ? 's' : ''}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-danger-600" />
        </Link>
      )}
    </div>
  );
}
