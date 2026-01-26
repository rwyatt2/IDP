import { useParams, Link, useNavigate } from 'react-router-dom';
import { cn, formatDate, formatRelativeTime, formatCurrency, formatPercentage } from '@/lib/utils';
import { useApplication, useDeploymentsByApplication, useCostByApplication } from '@/hooks';
import { useInteractionStore } from '@/stores';
import {
  Button,
  Card,
  CardHeader,
  Badge,
  StatusBadge,
  AvatarGroup,
  Tabs,
  ProgressBar,
  Skeleton,
  useToast,
} from '@/components/ui';
import {
  ArrowLeft,
  Globe,
  Server,
  Users,
  Shield,
  Activity,
  Clock,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Database,
  Zap,
  ChevronRight,
  Star,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: app, isLoading } = useApplication(id || '');
  const { data: deployments } = useDeploymentsByApplication(id || '');
  const { data: costs } = useCostByApplication(id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const { favoriteApplications, toggleFavoriteApp, addRecentlyViewed, logAction } = useInteractionStore();
  const toast = useToast();

  const isFavorite = id ? favoriteApplications.includes(id) : false;

  // Track recently viewed
  useEffect(() => {
    if (app && id) {
      addRecentlyViewed('application', id, app.displayName);
    }
  }, [app, id, addRecentlyViewed]);

  const handleToggleFavorite = () => {
    if (!id || !app) return;
    toggleFavoriteApp(id);
    if (!isFavorite) {
      toast.success('Added to Favorites', `${app.displayName} is now in your favorites`);
    } else {
      toast.info('Removed from Favorites', `${app.displayName} removed from favorites`);
    }
  };

  const handleDeploy = () => {
    if (!app) return;
    logAction('Triggered deployment', app.displayName);
    toast.success('Deployment Triggered', `Deploying ${app.displayName} to staging...`);
    navigate('/deploy/deployments');
  };

  const handleViewLogs = () => {
    if (!app) return;
    logAction('Viewed logs', app.displayName);
    toast.info('Opening Logs', `Loading logs for ${app.displayName}...`);
  };

  const handleRestartService = () => {
    if (!app) return;
    logAction('Restarted service', app.displayName);
    toast.warning('Service Restarting', `${app.displayName} is restarting. This may take a moment.`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-32" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-text-tertiary">Application not found</p>
        <Link to="/discover/catalog" className="text-accent-text hover:text-accent-text/80 mt-2 inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deployments', label: 'Deployments', count: deployments?.length },
    { id: 'dependencies', label: 'Dependencies', count: app.dependencies.length },
    { id: 'metrics', label: 'Metrics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/discover/catalog"
        className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-surface-raised flex items-center justify-center text-text-secondary">
            <Server className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">{app.displayName}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-text-tertiary mt-1">{app.name}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={cn(
                app.tier === 'tier-1' && 'bg-error/10 text-error',
                app.tier === 'tier-2' && 'bg-warning/10 text-warning',
                app.tier === 'tier-3' && 'bg-info/10 text-info',
                app.tier === 'tier-4' && 'bg-surface-raised text-text-secondary',
              )}>
                {app.tier.replace('tier-', 'Tier ')}
              </Badge>
              <span className="text-sm text-text-tertiary">{app.type}</span>
              <span className="text-sm text-text-tertiary">·</span>
              <span className="text-sm text-text-tertiary">{app.language}</span>
              {app.framework && (
                <>
                  <span className="text-sm text-text-tertiary">·</span>
                  <span className="text-sm text-text-tertiary">{app.framework}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isFavorite
                ? 'text-warning bg-warning-subtle hover:bg-warning/20'
                : 'text-text-tertiary bg-surface-raised hover:text-warning hover:bg-surface-raised'
            )}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
          </button>
          <Button 
            variant="secondary" 
            leftIcon={<Terminal className="w-4 h-4" />}
            onClick={handleViewLogs}
          >
            Logs
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRestartService}
          >
            Restart
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Rocket className="w-4 h-4" />}
            onClick={handleDeploy}
          >
            Deploy
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary">{app.description}</p>
              </Card>

              {/* Metrics */}
              <Card padding="lg">
                <CardHeader title="Performance Metrics" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <div className="flex items-center gap-2 text-text-tertiary mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs">Requests/sec</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">
                      {app.metrics.requestsPerSecond.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <div className="flex items-center gap-2 text-text-tertiary mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">P99 Latency</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">
                      {app.metrics.latencyP99}ms
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <div className="flex items-center gap-2 text-text-tertiary mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Error Rate</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">
                      {app.metrics.errorRate}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-raised">
                    <div className="flex items-center gap-2 text-text-tertiary mb-1">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs">Uptime</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">
                      {app.metrics.uptime}%
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recent Deployments */}
              {deployments && deployments.length > 0 && (
                <Card padding="lg">
                  <CardHeader 
                    title="Recent Deployments" 
                    action={
                      <Link to={`/deploy/deployments?app=${app.id}`} className="text-sm text-accent-text hover:text-accent-text/80">
                        View all
                      </Link>
                    }
                  />
                  <div className="mt-4 space-y-3">
                    {deployments.slice(0, 3).map((deploy) => (
                      <div key={deploy.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-raised">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={deploy.status} />
                          <div>
                            <p className="font-medium text-text-primary">{deploy.version}</p>
                            <p className="text-sm text-text-tertiary">{deploy.environment}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-text-primary">{deploy.triggeredBy}</p>
                          <p className="text-text-tertiary">{formatRelativeTime(deploy.triggeredAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          {activeTab === 'dependencies' && (
            <Card padding="lg">
              <CardHeader title="Dependencies" description={`${app.dependencies.length} dependencies`} />
              <div className="mt-4 space-y-3">
                {app.dependencies.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        dep.type === 'service' && 'bg-accent/10 text-accent',
                        dep.type === 'database' && 'bg-info/10 text-info',
                        dep.type === 'cache' && 'bg-success/10 text-success',
                        dep.type === 'queue' && 'bg-warning/10 text-warning',
                        dep.type === 'external' && 'bg-surface-raised text-text-secondary',
                      )}>
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{dep.name}</p>
                        <p className="text-sm text-text-tertiary capitalize">{dep.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {dep.critical && (
                        <Badge variant="danger" size="sm">Critical</Badge>
                      )}
                      <StatusBadge status={dep.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card padding="lg">
            <CardHeader title="Team" />
            <div className="mt-4 space-y-4">
              <Link
                to={`/discover/teams/${app.team.id}`}
                className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-surface-raised transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent-text" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{app.team.name}</p>
                  <p className="text-sm text-text-tertiary">{app.team.members.length} members</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </Link>
              <div>
                <p className="text-sm font-medium text-text-tertiary mb-2">Owners</p>
                <AvatarGroup
                  avatars={app.team.members.filter((m) => app.owners.includes(m.id)).map((m) => ({ name: m.name, src: m.avatar }))}
                  size="md"
                />
              </div>
            </div>
          </Card>

          {/* Compliance */}
          <Card padding="lg">
            <CardHeader title="Compliance" />
            <div className="mt-4 flex flex-wrap gap-2">
              {app.compliance.soc2 && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  SOC2
                </Badge>
              )}
              {app.compliance.gdpr && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  GDPR
                </Badge>
              )}
              {app.compliance.hipaa && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  HIPAA
                </Badge>
              )}
              {app.compliance.pci && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  PCI
                </Badge>
              )}
            </div>
            {app.compliance.lastAudit && (
              <p className="text-sm text-text-tertiary mt-3">
                Last audit: {formatDate(app.compliance.lastAudit)}
              </p>
            )}
          </Card>

          {/* Costs */}
          {costs && (
            <Card padding="lg">
              <CardHeader 
                title="Costs" 
                action={
                  <Link to={`/manage/costs?app=${app.id}`} className="text-sm text-accent-text hover:text-accent-text/80">
                    Details
                  </Link>
                }
              />
              <div className="mt-4">
                <p className="text-3xl font-bold text-text-primary">
                  {formatCurrency(costs.currentMonth)}
                </p>
                <p className="text-sm text-text-tertiary">this month</p>
                {costs.budget && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-tertiary">Budget</span>
                      <span className="font-medium text-text-primary">
                        {formatPercentage(costs.budgetUtilization || 0)}
                      </span>
                    </div>
                    <ProgressBar
                      value={costs.budgetUtilization || 0}
                      variant={costs.budgetUtilization! > 90 ? 'danger' : costs.budgetUtilization! > 70 ? 'warning' : 'primary'}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Environments */}
          <Card padding="lg">
            <CardHeader title="Environments" />
            <div className="mt-4 space-y-2">
              {app.environment.map((env) => (
                <div key={env} className="flex items-center justify-between p-2 rounded-lg bg-surface-raised">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-text-tertiary" />
                    <span className="font-medium text-text-primary capitalize">{env}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
