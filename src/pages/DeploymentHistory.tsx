import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatDuration } from '@/lib/utils';
import { deployments, applications } from '@/data/mock-data';
import { Card, SearchInput, Badge, Button, Select } from '@/components/ui';
import {
  History,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RotateCcw,
  Download,
  ChevronRight,
  Calendar,
  User,
  GitCommit,
} from 'lucide-react';

export function DeploymentHistory() {
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');
  const [envFilter, setEnvFilter] = useState('all');

  const filteredDeployments = useMemo(() => {
    let result = [...deployments].sort(
      (a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
    );

    if (appFilter !== 'all') {
      result = result.filter((d) => d.applicationId === appFilter);
    }

    if (envFilter !== 'all') {
      result = result.filter((d) => d.environment === envFilter);
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.applicationName.toLowerCase().includes(lower) ||
          d.version.toLowerCase().includes(lower) ||
          d.triggeredBy.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [appFilter, envFilter, search]);

  const stats = useMemo(() => {
    const total = deployments.length;
    const succeeded = deployments.filter((d) => d.status === 'succeeded').length;
    const failed = deployments.filter((d) => d.status === 'failed').length;
    const avgDuration =
      deployments
        .filter((d) => d.duration)
        .reduce((sum, d) => sum + (d.duration || 0), 0) /
      deployments.filter((d) => d.duration).length;

    return { total, succeeded, failed, avgDuration, successRate: (succeeded / total) * 100 };
  }, []);

  const statusIcons = {
    succeeded: <CheckCircle className="w-4 h-4 text-success-500" />,
    failed: <XCircle className="w-4 h-4 text-danger-500" />,
    'in-progress': <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />,
    pending: <Clock className="w-4 h-4 text-slate-400" />,
    'awaiting-approval': <Clock className="w-4 h-4 text-warning-500" />,
    'rolled-back': <RotateCcw className="w-4 h-4 text-slate-500" />,
    cancelled: <XCircle className="w-4 h-4 text-slate-400" />,
  };

  // Group deployments by date
  const groupedDeployments = useMemo(() => {
    const groups: Record<string, typeof filteredDeployments> = {};
    filteredDeployments.forEach((d) => {
      const date = new Date(d.triggeredAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(d);
    });
    return groups;
  }, [filteredDeployments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deployment History</h1>
          <p className="text-slate-500 mt-1">
            View and analyze past deployments
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <History className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Deployments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.successRate.toFixed(0)}%</p>
              <p className="text-sm text-slate-500">Success Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.failed}</p>
              <p className="text-sm text-slate-500">Failed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatDuration(stats.avgDuration * 1000)}
              </p>
              <p className="text-sm text-slate-500">Avg Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search deployments..."
          />
        </div>
        <Select
          value={appFilter}
          onChange={setAppFilter}
          options={[
            { value: 'all', label: 'All Applications' },
            ...applications.map((a) => ({ value: a.id, label: a.displayName })),
          ]}
          className="w-48"
        />
        <Select
          value={envFilter}
          onChange={setEnvFilter}
          options={[
            { value: 'all', label: 'All Environments' },
            { value: 'production', label: 'Production' },
            { value: 'staging', label: 'Staging' },
            { value: 'development', label: 'Development' },
          ]}
          className="w-40"
        />
      </div>

      {/* Timeline */}
      {filteredDeployments.length === 0 ? (
        <Card className="text-center py-12">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-medium text-slate-900">No deployments found</p>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your filters
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDeployments).map(([date, deploys]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-900">{date}</h3>
                <Badge variant="neutral">{deploys.length}</Badge>
              </div>
              <div className="space-y-2 ml-8 border-l-2 border-slate-200 pl-6">
                {deploys.map((deployment) => (
                  <Link
                    key={deployment.id}
                    to={`/deploy/deployments/${deployment.id}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-soft transition-all relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        'absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white',
                        deployment.status === 'succeeded' && 'bg-success-500',
                        deployment.status === 'failed' && 'bg-danger-500',
                        deployment.status === 'in-progress' && 'bg-primary-500',
                        (deployment.status === 'pending' || deployment.status === 'awaiting-approval') && 'bg-warning-500',
                        (deployment.status === 'rolled-back' || deployment.status === 'cancelled') && 'bg-slate-400'
                      )}
                    />

                    <div className="flex-shrink-0">
                      {statusIcons[deployment.status]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {deployment.applicationName}
                        </span>
                        <Badge variant="info" size="sm">{deployment.version}</Badge>
                        <Badge variant="neutral" size="sm" className="capitalize">
                          {deployment.environment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {deployment.triggeredBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitCommit className="w-3.5 h-3.5" />
                          {deployment.commits.length} commit{deployment.commits.length !== 1 ? 's' : ''}
                        </div>
                        {deployment.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(deployment.duration * 1000)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-slate-500">
                      {new Date(deployment.triggeredAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
