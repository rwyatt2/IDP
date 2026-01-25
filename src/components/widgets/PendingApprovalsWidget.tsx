import { Link } from 'react-router-dom';
import { formatRelativeTime } from '@/lib/utils';
import { usePendingApprovals } from '@/hooks';
import { useInteractionStore } from '@/stores';
import { useToast } from '@/components/ui';
import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';

export function PendingApprovalsWidget() {
  const { data: approvals, isLoading } = usePendingApprovals();
  const { approveDeployment, rejectDeployment, getDeploymentApproval, logAction } = useInteractionStore();
  const toast = useToast();

  const handleApprove = (deploymentId: string, appName: string, version: string) => {
    approveDeployment(deploymentId);
    logAction('Approved deployment', `${appName} ${version}`);
    toast.success('Deployment Approved', `${appName} ${version} has been approved for deployment`);
  };

  const handleReject = (deploymentId: string, appName: string, version: string) => {
    rejectDeployment(deploymentId);
    logAction('Rejected deployment', `${appName} ${version}`);
    toast.warning('Deployment Rejected', `${appName} ${version} has been rejected`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 rounded-lg border border-slate-200">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Filter out already approved/rejected deployments
  const pendingApprovals = approvals?.filter((d) => !getDeploymentApproval(d.id)) || [];

  if (!pendingApprovals.length) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-success-500" />
        </div>
        <p className="font-medium text-slate-900">All Caught Up</p>
        <p className="text-sm text-slate-500 mt-1">No pending approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingApprovals.slice(0, 3).map((deployment) => (
        <div
          key={deployment.id}
          className="p-3 rounded-lg border border-slate-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-slate-900">
                {deployment.applicationName}
              </p>
              <p className="text-sm text-slate-500">
                {deployment.version} → {deployment.environment}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(deployment.triggeredAt)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>by {deployment.triggeredBy}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReject(deployment.id, deployment.applicationName, deployment.version)}
                className="text-danger-600 hover:bg-danger-50"
              >
                <XCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(deployment.id, deployment.applicationName, deployment.version)}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      ))}
      {pendingApprovals.length > 3 && (
        <Link
          to="/deploy/deployments?filter=pending"
          className="flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 pt-2"
        >
          View all {pendingApprovals.length} pending
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
