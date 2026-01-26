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
  succeeded: <CheckCircle className="w-6 h-6 text-success-text" />,
  failed: <XCircle className="w-6 h-6 text-error-text" />,
  'in-progress': <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />,
  pending: <Clock className="w-6 h-6 text-text-tertiary" />,
  'awaiting-approval': <AlertCircle className="w-6 h-6 text-warning-text" />,
  'rolled-back': <RotateCcw className="w-6 h-6 text-text-secondary" />,
  cancelled: <XCircle className="w-6 h-6 text-text-tertiary" />,
};

export function DeploymentDetail() {
  const { id } = useParams();
  const deployment = deployments.find((d) => d.id === id);

  if (!deployment) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Deployment not found</p>
        <Link to="/deploy/deployments" className="text-accent-text hover:text-accent-text mt-2 inline-block">
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
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deployments
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-surface-raised flex items-center justify-center">
            {statusIcons[deployment.status]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">
                {deployment.applicationName}
              </h1>
              <Badge variant="info">{deployment.version}</Badge>
              <StatusBadge status={deployment.status} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
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
                  <div className="w-8 h-8 rounded-full bg-success-subtle flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success-text" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Deployment triggered</p>
                    <p className="text-sm text-text-secondary">{formatDateTime(deployment.triggeredAt)}</p>
                  </div>
                </div>
                {deployment.approvals.length > 0 && deployment.approvals[0].status === 'approved' && (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-success-subtle flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success-text" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        Approved by {deployment.approvals[0].approver}
                      </p>
                      {deployment.approvals[0].timestamp && (
                        <p className="text-sm text-text-secondary">
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
                      deployment.status === 'succeeded' ? 'bg-success-subtle' : 'bg-error-subtle'
                    )}>
                      {deployment.status === 'succeeded' ? (
                        <CheckCircle className="w-4 h-4 text-success-text" />
                      ) : (
                        <XCircle className="w-4 h-4 text-error-text" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        Deployment {deployment.status}
                      </p>
                      <p className="text-sm text-text-secondary">
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
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised"
                >
                  <GitCommit className="w-5 h-5 text-text-tertiary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary">{commit.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                      <code className="font-mono text-xs bg-surface-overlay px-1.5 py-0.5 rounded">
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
            <div className="mt-4 bg-surface-overlay rounded-lg p-4 max-h-80 overflow-auto">
              <pre className="text-sm font-mono">
                {mockLogs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-text-tertiary">{log.time}</span>
                    <span className={cn(
                      log.level === 'info' && 'text-text-secondary',
                      log.level === 'success' && 'text-success-text',
                      log.level === 'error' && 'text-error-text',
                      log.level === 'warning' && 'text-warning-text'
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
                <span className="text-sm text-text-secondary">Application</span>
                <Link
                  to={`/discover/catalog/${deployment.applicationId}`}
                  className="text-sm font-medium text-accent-text hover:text-accent-text"
                >
                  {deployment.applicationName}
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Version</span>
                <Badge variant="info">{deployment.version}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Environment</span>
                <span className="text-sm font-medium text-text-primary capitalize">
                  {deployment.environment}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Triggered by</span>
                <div className="flex items-center gap-2">
                  <Avatar name={deployment.triggeredBy} size="sm" />
                  <span className="text-sm font-medium text-text-primary">
                    {deployment.triggeredBy}
                  </span>
                </div>
              </div>
              {deployment.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Duration</span>
                  <span className="text-sm font-medium text-text-primary">
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
                  className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle"
                >
                  <Package className="w-5 h-5 text-text-tertiary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {artifact.name}
                    </p>
                    <p className="text-xs text-text-secondary">
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
                      approval.status === 'approved' && 'bg-success-subtle',
                      approval.status === 'rejected' && 'bg-error-subtle',
                      approval.status === 'pending' && 'bg-surface-raised'
                    )}
                  >
                    <Avatar name={approval.approver} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{approval.approver}</p>
                      <p className="text-xs text-text-secondary capitalize">{approval.status}</p>
                    </div>
                    {approval.status === 'approved' && (
                      <CheckCircle className="w-5 h-5 text-success-text" />
                    )}
                    {approval.status === 'rejected' && (
                      <XCircle className="w-5 h-5 text-error-text" />
                    )}
                    {approval.status === 'pending' && (
                      <Clock className="w-5 h-5 text-text-tertiary" />
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
