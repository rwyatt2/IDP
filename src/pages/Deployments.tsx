import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime, formatDuration } from '@/lib/utils';
import { useDeployments } from '@/hooks';
import { Button, SearchInput, Badge, StatusBadge, Card, Tabs, TabPanel, Select, Skeleton } from '@/components/ui';
import {
  Rocket,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Play,
  GitCommit,
  User,
} from 'lucide-react';
import type { Deployment, DeploymentStatus } from '@/types';

const statusIcons: Record<DeploymentStatus, React.ReactNode> = {
  succeeded: <CheckCircle className="w-5 h-5 text-success-text" />,
  failed: <XCircle className="w-5 h-5 text-error-text" />,
  'in-progress': <Loader2 className="w-5 h-5 text-accent-text animate-spin" />,
  pending: <Clock className="w-5 h-5 text-text-disabled" />,
  'awaiting-approval': <AlertCircle className="w-5 h-5 text-warning-text" />,
  'rolled-back': <RotateCcw className="w-5 h-5 text-text-tertiary" />,
  cancelled: <XCircle className="w-5 h-5 text-text-disabled" />,
};

function DeploymentRow({ deployment }: { deployment: Deployment }) {
  return (
    <Link
      to={`/deploy/deployments/${deployment.id}`}
      className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border-subtle hover:border-border-default hover:bg-surface-raised transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="flex-shrink-0">
        {statusIcons[deployment.status]}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{deployment.applicationName}</span>
          <Badge variant="info" size="sm">{deployment.version}</Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-text-tertiary">
          <span className="capitalize">{deployment.environment}</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <GitCommit className="w-3 h-3" />
            <span>{deployment.commits.length} commit{deployment.commits.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-text-tertiary">
            <User className="w-3 h-3" />
            <span>{deployment.triggeredBy}</span>
          </div>
          <p className="text-xs text-text-disabled">{formatRelativeTime(deployment.triggeredAt)}</p>
        </div>
        {deployment.duration && (
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">
              {formatDuration(deployment.duration * 1000)}
            </p>
            <p className="text-xs text-text-disabled">Duration</p>
          </div>
        )}
      </div>
      
      <StatusBadge status={deployment.status} />
      <ChevronRight className="w-5 h-5 text-text-disabled group-hover:text-text-tertiary transition-colors" />
    </Link>
  );
}

export function Deployments() {
  const { data: deployments, isLoading } = useDeployments();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [envFilter, setEnvFilter] = useState('all');

  const tabs = useMemo(() => {
    if (!deployments) return [];
    return [
      { id: 'all', label: 'All', count: deployments.length },
      { id: 'in-progress', label: 'In Progress', count: deployments.filter((d) => d.status === 'in-progress').length },
      { id: 'awaiting-approval', label: 'Awaiting Approval', count: deployments.filter((d) => d.status === 'awaiting-approval').length },
      { id: 'succeeded', label: 'Succeeded', count: deployments.filter((d) => d.status === 'succeeded').length },
      { id: 'failed', label: 'Failed', count: deployments.filter((d) => d.status === 'failed').length },
    ];
  }, [deployments]);

  const filteredDeployments = useMemo(() => {
    if (!deployments) return [];
    let result = deployments;

    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter((d) => d.status === activeTab);
    }

    // Filter by environment
    if (envFilter !== 'all') {
      result = result.filter((d) => d.environment === envFilter);
    }

    // Filter by search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.applicationName.toLowerCase().includes(lower) ||
          d.version.toLowerCase().includes(lower) ||
          d.triggeredBy.toLowerCase().includes(lower)
      );
    }

    return result.sort(
      (a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
    );
  }, [deployments, activeTab, envFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Deployments</h1>
          <p className="text-text-tertiary mt-1">
            Track and manage deployments across all environments
          </p>
        </div>
        <Button variant="primary" leftIcon={<Play className="w-4 h-4" />}>
          New Deployment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search deployments..."
          />
        </div>
        <Select
          value={envFilter}
          onChange={setEnvFilter}
          options={[
            { value: 'all', label: 'All Environments' },
            { value: 'production', label: 'Production' },
            { value: 'staging', label: 'Staging' },
            { value: 'development', label: 'Development' },
          ]}
          className="w-44"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Deployments List */}
      <TabPanel>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4 bg-surface border-border-subtle">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDeployments.length === 0 ? (
          <Card className="text-center py-12 bg-surface border-border-subtle">
            <Rocket className="w-12 h-12 text-text-disabled mx-auto mb-4" />
            <p className="text-text-tertiary">No deployments found</p>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDeployments.map((deployment) => (
              <DeploymentRow key={deployment.id} deployment={deployment} />
            ))}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
