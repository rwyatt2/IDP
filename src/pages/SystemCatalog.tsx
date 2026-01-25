import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApplications } from '@/hooks';
import { Button, SearchInput, Badge, StatusBadge, Card, AvatarGroup, Skeleton, Select } from '@/components/ui';
import {
  Grid3X3,
  List,
  GitBranch,
  Users,
  Server,
  Box,
  Database,
  Globe,
  Code,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { Application, ApplicationType, ServiceTier } from '@/types';

const typeIcons: Record<ApplicationType, React.ReactNode> = {
  service: <Server className="w-4 h-4" />,
  frontend: <Globe className="w-4 h-4" />,
  backend: <Database className="w-4 h-4" />,
  library: <Code className="w-4 h-4" />,
  infrastructure: <Layers className="w-4 h-4" />,
  'data-pipeline': <GitBranch className="w-4 h-4" />,
};

const tierColors: Record<ServiceTier, string> = {
  'tier-1': 'bg-danger-100 text-danger-700',
  'tier-2': 'bg-warning-100 text-warning-700',
  'tier-3': 'bg-blue-100 text-blue-700',
  'tier-4': 'bg-slate-100 text-slate-700',
};

function ApplicationCard({ app }: { app: Application }) {
  return (
    <Link to={`/discover/catalog/${app.id}`}>
      <Card variant="interactive" className="h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              {typeIcons[app.type]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{app.displayName}</h3>
              <p className="text-sm text-slate-500">{app.name}</p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>
        
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {app.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{app.team.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            <span>{app.language}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Badge className={tierColors[app.tier]} size="sm">
              {app.tier.replace('tier-', 'Tier ')}
            </Badge>
            {app.compliance.soc2 && (
              <Badge variant="success" size="sm">SOC2</Badge>
            )}
          </div>
          <AvatarGroup
            avatars={app.team.members.slice(0, 3).map((m) => ({ name: m.name, src: m.avatar }))}
            size="sm"
          />
        </div>
      </Card>
    </Link>
  );
}

function ApplicationRow({ app }: { app: Application }) {
  return (
    <Link
      to={`/discover/catalog/${app.id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-soft transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
        {typeIcons[app.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-slate-900 truncate">{app.displayName}</h3>
          <Badge className={tierColors[app.tier]} size="sm">
            {app.tier.replace('tier-', 'T')}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 truncate">{app.description}</p>
      </div>
      
      <div className="hidden md:flex items-center gap-8 flex-shrink-0">
        <div className="text-sm">
          <p className="text-slate-500">Team</p>
          <p className="font-medium text-slate-900">{app.team.name}</p>
        </div>
        <div className="text-sm">
          <p className="text-slate-500">Language</p>
          <p className="font-medium text-slate-900">{app.language}</p>
        </div>
        <div className="text-sm">
          <p className="text-slate-500">Uptime</p>
          <p className="font-medium text-slate-900">{app.metrics.uptime}%</p>
        </div>
      </div>
      
      <StatusBadge status={app.status} />
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </Link>
  );
}

export function SystemCatalog() {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useApplications();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter] = useState<ApplicationType | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<ServiceTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const stats = useMemo(() => {
    if (!applications) return null;
    return {
      total: applications.length,
      healthy: applications.filter((a) => a.status === 'healthy').length,
      degraded: applications.filter((a) => a.status === 'degraded').length,
      critical: applications.filter((a) => a.status === 'critical').length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    let result = applications;

    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter);
    }

    if (tierFilter !== 'all') {
      result = result.filter((a) => a.tier === tierFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.displayName.toLowerCase().includes(lower) ||
          a.description.toLowerCase().includes(lower) ||
          a.team.name.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [applications, typeFilter, tierFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Catalog</h1>
          <p className="text-slate-500 mt-1">
            Browse and manage all applications and services
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/build/create')}
          leftIcon={<Box className="w-4 h-4" />}
        >
          Register Application
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Services</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-success-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.healthy}</p>
              <p className="text-sm text-slate-500">Healthy</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-warning-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.degraded}</p>
              <p className="text-sm text-slate-500">Degraded</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-danger-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
              <p className="text-sm text-slate-500">Critical</p>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search applications..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as ApplicationType | 'all')}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'service', label: 'Service' },
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend', label: 'Backend' },
              { value: 'library', label: 'Library' },
              { value: 'infrastructure', label: 'Infrastructure' },
              { value: 'data-pipeline', label: 'Data Pipeline' },
            ]}
            className="w-36"
          />
          <Select
            value={tierFilter}
            onChange={(v) => setTierFilter(v as ServiceTier | 'all')}
            options={[
              { value: 'all', label: 'All Tiers' },
              { value: 'tier-1', label: 'Tier 1' },
              { value: 'tier-2', label: 'Tier 2' },
              { value: 'tier-3', label: 'Tier 3' },
              { value: 'tier-4', label: 'Tier 4' },
            ]}
            className="w-32"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'healthy', label: 'Healthy' },
              { value: 'degraded', label: 'Degraded' },
              { value: 'critical', label: 'Critical' },
            ]}
            className="w-32"
          />
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-48">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="rectangular" width={40} height={40} />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500">No applications found</p>
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
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredApplications.map((app) => (
            <ApplicationRow key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
