import { useParams, Link } from 'react-router-dom';
import { cn, formatRelativeTime, formatDateTime, formatDuration } from '@/lib/utils';
import { deployments } from '@/data/mock-data';
import { Card, CardHeader, Badge, StatusBadge, Button, Avatar } from '@/components/ui';
import {
  ArrowLeft,
  GitCommit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  Package,
  Play,
  Pause,
} from 'lucide-react';

const mockLogs = [
  { time: '10:30:00', level: 'info', message: 'Starting deployment of api-gateway:v2.14.3' },
  { time: '10:30:02', level: 'info', message: 'Pulling image from registry...' },
  { time: '10:30:15', level: 'info', message: 'Image pulled successfully' },
  { time: '10:30:16', level: 'info', message: 'Creating new deployment revision...' },
  { time: '10:30:18', level: 'info', message: 'Scaling up new pods (0/3)' },
  { time: '10:32:00', level: 'info', message: 'Scaling up new pods (1/3)' },
  { time: '10:34:00', level: 'info', message: 'Scaling up new pods (2/3)' },
  { time: '10:36:00', level: 'info', message: 'Scaling up new pods (3/3)' },
  { time: '10:36:05', level: 'info', message: 'Health checks passing' },
  { time: '10:36:10', level: 'info', message: 'Scaling down old pods...' },
  { time: '10:40:00', level: 'info', message: 'Old pods terminated' },
  { time: '10:40:02', level: 'success', message: 'Deployment completed successfully' },
];

const statusIcons = {
  succeeded: <CheckCircle className="w-6 h-6 text-success-500" />,
  failed: <XCircle className="w-6 h-6 text-danger-500" />,
  'in-progress': <div className="w-6 h-6 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />,
  pending: <Clock className="w-6 h-6 text-slate-400" />,
  'awaiting-approval': <AlertCircle className="w-6 h-6 text-warning-500" />,
  'rolled-back': <RotateCcw className="w-6 h-6 text-slate-500" />,
  cancelled: <XCircle className="w-6 h-6 text-slate-400" />,
};

export function DeploymentDetail() {
  const { id } = useParams();
  const deployment = deployments.find((d) => d.id === id);

  if (!deployment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Deployment not found</p>
        <Link to="/deploy/deployments" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          Back to Deployments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/deploy/deployments"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deployments
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
            {statusIcons[deployment.status]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {deployment.applicationName}
              </h1>
              <Badge variant="info">{deployment.version}</Badge>
              <StatusBadge status={deployment.status} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="capitalize">{deployment.environment}</span>
              <span>·</span>
              <span>Triggered by {deployment.triggeredBy}</span>
              <span>·</span>
              <span>{formatDateTime(deployment.triggeredAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deployment.status === 'awaiting-approval' && (
            <>
              <Button variant="secondary" leftIcon={<XCircle className="w-4 h-4" />}>
                Reject
              </Button>
              <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />}>
                Approve
              </Button>
            </>
          )}
          {deployment.status === 'in-progress' && (
            <Button variant="danger" leftIcon={<Pause className="w-4 h-4" />}>
              Cancel
            </Button>
          )}
          {deployment.canRollback && deployment.status === 'succeeded' && (
            <Button variant="secondary" leftIcon={<RotateCcw className="w-4 h-4" />}>
              Rollback
            </Button>
          )}
          {deployment.status === 'failed' && (
            <Button variant="primary" leftIcon={<Play className="w-4 h-4" />}>
              Retry
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card padding="lg">
            <CardHeader title="Deployment Timeline" />
            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Deployment triggered</p>
                    <p className="text-sm text-slate-500">{formatDateTime(deployment.triggeredAt)}</p>
                  </div>
                </div>
                {deployment.approvals.length > 0 && deployment.approvals[0].status === 'approved' && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        Approved by {deployment.approvals[0].approver}
                      </p>
                      {deployment.approvals[0].timestamp && (
                        <p className="text-sm text-slate-500">
                          {formatDateTime(deployment.approvals[0].timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {deployment.completedAt && (
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      deployment.status === 'succeeded' ? 'bg-success-100' : 'bg-danger-100'
                    )}>
                      {deployment.status === 'succeeded' ? (
                        <CheckCircle className="w-4 h-4 text-success-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        Deployment {deployment.status}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDateTime(deployment.completedAt)}
                        {deployment.duration && ` · Duration: ${formatDuration(deployment.duration * 1000)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Commits */}
          <Card padding="lg">
            <CardHeader 
              title="Commits" 
              description={`${deployment.commits.length} commit${deployment.commits.length !== 1 ? 's' : ''} in this release`}
            />
            <div className="mt-4 space-y-3">
              {deployment.commits.map((commit) => (
                <div
                  key={commit.sha}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
                >
                  <GitCommit className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900">{commit.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <code className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded">
                        {commit.sha}
                      </code>
                      <span>{commit.author}</span>
                      <span>·</span>
                      <span>{formatRelativeTime(commit.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Logs */}
          <Card padding="lg">
            <CardHeader 
              title="Deployment Logs" 
              action={
                <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                  Full Logs
                </Button>
              }
            />
            <div className="mt-4 bg-slate-900 rounded-lg p-4 max-h-80 overflow-auto">
              <pre className="text-sm font-mono">
                {mockLogs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={cn(
                      log.level === 'info' && 'text-slate-300',
                      log.level === 'success' && 'text-success-400',
                      log.level === 'error' && 'text-danger-400',
                      log.level === 'warning' && 'text-warning-400'
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deployment Info */}
          <Card padding="lg">
            <CardHeader title="Details" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Application</span>
                <Link
                  to={`/discover/catalog/${deployment.applicationId}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {deployment.applicationName}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Version</span>
                <Badge variant="info">{deployment.version}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Environment</span>
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {deployment.environment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Triggered by</span>
                <div className="flex items-center gap-2">
                  <Avatar name={deployment.triggeredBy} size="sm" />
                  <span className="text-sm font-medium text-slate-900">
                    {deployment.triggeredBy}
                  </span>
                </div>
              </div>
              {deployment.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Duration</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatDuration(deployment.duration * 1000)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Artifacts */}
          <Card padding="lg">
            <CardHeader title="Artifacts" />
            <div className="mt-4 space-y-3">
              {deployment.artifacts.map((artifact) => (
                <div
                  key={artifact.name}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200"
                >
                  <Package className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {artifact.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {artifact.type} · {(artifact.size / 1000000).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Approvals */}
          {deployment.approvals.length > 0 && (
            <Card padding="lg">
              <CardHeader title="Approvals" />
              <div className="mt-4 space-y-3">
                {deployment.approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg',
                      approval.status === 'approved' && 'bg-success-50',
                      approval.status === 'rejected' && 'bg-danger-50',
                      approval.status === 'pending' && 'bg-slate-50'
                    )}
                  >
                    <Avatar name={approval.approver} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{approval.approver}</p>
                      <p className="text-xs text-slate-500 capitalize">{approval.status}</p>
                    </div>
                    {approval.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-success-600" />
                    )}
                    {approval.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-danger-600" />
                    )}
                    {approval.status === 'pending' && (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
