import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { applications } from '@/data/mock-data';
import { Card, SearchInput, Badge, StatusBadge, Select, Button } from '@/components/ui';
import {
  Network,
  Database,
  Server,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Download,
} from 'lucide-react';
import type { Application, Dependency } from '@/types';

const typeColors: Record<string, string> = {
  service: 'bg-accent/10 text-accent border-accent/20',
  database: 'bg-info/10 text-info border-info/20',
  cache: 'bg-success/10 text-success border-success/20',
  queue: 'bg-warning/10 text-warning border-warning/20',
  external: 'bg-surface-raised text-text-secondary border-border-default',
};

interface DependencyNode {
  app: Application;
  dependencies: Dependency[];
  dependents: Application[];
}

export function Dependencies() {
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const dependencyData = useMemo(() => {
    const data: Record<string, DependencyNode> = {};
    
    applications.forEach((app) => {
      data[app.id] = {
        app,
        dependencies: app.dependencies,
        dependents: applications.filter((a) =>
          a.dependencies.some((d) => d.name === app.name || d.name === app.displayName)
        ),
      };
    });
    
    return data;
  }, []);

  const filteredApps = useMemo(() => {
    let result = applications;
    
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.displayName.toLowerCase().includes(lower)
      );
    }
    
    return result;
  }, [search]);

  const selectedNode = selectedApp ? dependencyData[selectedApp] : null;

  const allDependencies = useMemo(() => {
    const deps: Array<{ source: Application; dependency: Dependency }> = [];
    applications.forEach((app) => {
      app.dependencies.forEach((dep) => {
        deps.push({ source: app, dependency: dep });
      });
    });
    
    if (typeFilter !== 'all') {
      return deps.filter((d) => d.dependency.type === typeFilter);
    }
    
    return deps;
  }, [typeFilter]);

  const criticalDependencies = allDependencies.filter((d) => d.dependency.critical);
  const unhealthyDependencies = allDependencies.filter((d) => d.dependency.status !== 'healthy');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dependencies</h1>
          <p className="text-text-tertiary mt-1">
            Visualize and understand service dependencies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
              <Network className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{allDependencies.length}</p>
              <p className="text-sm text-text-tertiary">Total Dependencies</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-subtle flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{criticalDependencies.length}</p>
              <p className="text-sm text-text-tertiary">Critical</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-subtle flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{unhealthyDependencies.length}</p>
              <p className="text-sm text-text-tertiary">Unhealthy</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {allDependencies.length - unhealthyDependencies.length}
              </p>
              <p className="text-sm text-text-tertiary">Healthy</p>
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
            placeholder="Search applications..."
          />
        </div>
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'service', label: 'Services' },
            { value: 'database', label: 'Databases' },
            { value: 'cache', label: 'Caches' },
            { value: 'queue', label: 'Queues' },
            { value: 'external', label: 'External' },
          ]}
          className="w-40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application List */}
        <div className="lg:col-span-1">
          <Card padding="none" className="overflow-hidden">
            <div className="p-4 border-b border-border-default bg-surface-raised">
              <h3 className="font-semibold text-text-primary">Applications</h3>
              <p className="text-sm text-text-tertiary">{filteredApps.length} services</p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id === selectedApp ? '' : app.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left border-b border-border-subtle last:border-0 transition-colors',
                    selectedApp === app.id
                      ? 'bg-accent-subtle'
                      : 'hover:bg-surface-raised'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-text-secondary">
                    <Server className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{app.displayName}</p>
                    <p className="text-sm text-text-tertiary">
                      {app.dependencies.length} dependencies
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Dependency Details */}
        <div className="lg:col-span-2">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Selected App Info */}
              <Card padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-raised flex items-center justify-center text-text-secondary">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">
                        {selectedNode.app.displayName}
                      </h2>
                      <p className="text-text-tertiary">{selectedNode.app.team.name}</p>
                    </div>
                  </div>
                  <Link
                    to={`/discover/catalog/${selectedNode.app.id}`}
                    className="text-accent-text hover:text-accent text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
                <p className="text-text-secondary">{selectedNode.app.description}</p>
              </Card>

              {/* Dependencies */}
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-4">
                  Dependencies ({selectedNode.dependencies.length})
                </h3>
                {selectedNode.dependencies.length === 0 ? (
                  <p className="text-text-tertiary text-center py-4">No dependencies</p>
                ) : (
                  <div className="space-y-3">
                    {selectedNode.dependencies.map((dep) => (
                      <div
                        key={dep.id}
                        className={cn(
                          'flex items-center gap-4 p-3 rounded-lg border',
                          typeColors[dep.type]
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                          <Database className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{dep.name}</p>
                            {dep.critical && (
                              <Badge variant="danger" size="sm">Critical</Badge>
                            )}
                          </div>
                          <p className="text-sm opacity-75 capitalize">{dep.type}</p>
                        </div>
                        <StatusBadge status={dep.status} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Dependents */}
              <Card padding="lg">
                <h3 className="font-semibold text-text-primary mb-4">
                  Dependent Services ({selectedNode.dependents.length})
                </h3>
                {selectedNode.dependents.length === 0 ? (
                  <p className="text-text-tertiary text-center py-4">No services depend on this</p>
                ) : (
                  <div className="space-y-2">
                    {selectedNode.dependents.map((dep) => (
                      <Link
                        key={dep.id}
                        to={`/discover/catalog/${dep.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised hover:bg-surface-overlay transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-text-tertiary" />
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{dep.displayName}</p>
                          <p className="text-sm text-text-tertiary">{dep.team.name}</p>
                        </div>
                        <StatusBadge status={dep.status} />
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center text-center p-12">
              <div>
                <Network className="w-16 h-16 text-text-disabled mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary">Select an Application</h3>
                <p className="text-text-tertiary mt-1">
                  Choose an application from the list to view its dependencies
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
