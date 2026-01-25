import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@/lib/utils';
import { useRecentDeployments } from '@/hooks';
import { ChevronRight, Rocket, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { StatusBadge, Skeleton } from '@/components/ui';

const statusIcons = {
  succeeded: <CheckCircle className="w-4 h-4 text-success-500" />,
  failed: <XCircle className="w-4 h-4 text-danger-500" />,
  'in-progress': <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />,
  pending: <Clock className="w-4 h-4 text-slate-400" />,
  'awaiting-approval': <Clock className="w-4 h-4 text-warning-500" />,
};

export function RecentDeploymentsWidget() {
  const { data: deployments, isLoading } = useRecentDeployments(5);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!deployments?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">No recent deployments</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deployments.map((deployment) => (
        <Link
          key={deployment.id}
          to={`/deploy/deployments/${deployment.id}`}
          className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            {statusIcons[deployment.status as keyof typeof statusIcons] || (
              <Rocket className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 truncate">
                {deployment.applicationName}
              </span>
              <span className="text-sm text-slate-500">{deployment.version}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{deployment.environment}</span>
              <span>·</span>
              <span>{formatRelativeTime(deployment.triggeredAt)}</span>
            </div>
          </div>
          <StatusBadge status={deployment.status} />
        </Link>
      ))}
      <Link
        to="/deploy/deployments"
        className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 pt-2"
      >
        View all deployments
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
