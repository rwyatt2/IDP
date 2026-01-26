import { useState, useMemo } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Card, CardHeader, SearchInput, Badge, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  Cloud,
  Globe,
  Lock,
  Layers,
  Plus,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Zap,
  Box,
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'compute' | 'database' | 'storage' | 'cache' | 'cdn' | 'queue' | 'load-balancer';
  provider: 'aws' | 'gcp' | 'azure' | 'kubernetes';
  region: string;
  status: 'running' | 'stopped' | 'error' | 'provisioning';
  specs: string;
  cost: number;
  utilization: number;
  application?: string;
}

const mockResources: Resource[] = [
  { id: 'r1', name: 'api-gateway-prod', type: 'compute', provider: 'kubernetes', region: 'us-east-1', status: 'running', specs: '2 vCPU, 4GB RAM, 3 replicas', cost: 150, utilization: 45, application: 'API Gateway' },
  { id: 'r2', name: 'postgres-primary', type: 'database', provider: 'aws', region: 'us-east-1', status: 'running', specs: 'db.r5.large, 500GB', cost: 280, utilization: 62, application: 'API Gateway' },
  { id: 'r3', name: 'redis-cluster', type: 'cache', provider: 'aws', region: 'us-east-1', status: 'running', specs: 'cache.r5.large, 3 nodes', cost: 180, utilization: 38 },
  { id: 'r4', name: 'payment-service-prod', type: 'compute', provider: 'kubernetes', region: 'us-east-1', status: 'running', specs: '1 vCPU, 2GB RAM, 8 replicas', cost: 200, utilization: 71, application: 'Payment Service' },
  { id: 'r5', name: 'postgres-payments', type: 'database', provider: 'aws', region: 'us-east-1', status: 'running', specs: 'db.r5.xlarge, 1TB', cost: 450, utilization: 55, application: 'Payment Service' },
  { id: 'r6', name: 's3-assets', type: 'storage', provider: 'aws', region: 'us-east-1', status: 'running', specs: '2.5 TB stored', cost: 60, utilization: 0 },
  { id: 'r7', name: 'cloudfront-dist', type: 'cdn', provider: 'aws', region: 'global', status: 'running', specs: '150 TB/month', cost: 320, utilization: 0, application: 'User Dashboard' },
  { id: 'r8', name: 'auth-service-prod', type: 'compute', provider: 'kubernetes', region: 'us-east-1', status: 'running', specs: '1 vCPU, 1GB RAM, 6 replicas', cost: 120, utilization: 25, application: 'Authentication Service' },
  { id: 'r9', name: 'kafka-cluster', type: 'queue', provider: 'aws', region: 'us-east-1', status: 'running', specs: 'kafka.m5.large, 3 brokers', cost: 350, utilization: 42 },
  { id: 'r10', name: 'alb-main', type: 'load-balancer', provider: 'aws', region: 'us-east-1', status: 'running', specs: 'Application Load Balancer', cost: 25, utilization: 0 },
];

const typeIcons: Record<string, React.ReactNode> = {
  compute: <Server className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  storage: <HardDrive className="w-5 h-5" />,
  cache: <Zap className="w-5 h-5" />,
  cdn: <Globe className="w-5 h-5" />,
  queue: <Layers className="w-5 h-5" />,
  'load-balancer': <Activity className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  compute: 'bg-accent/10 text-accent',
  database: 'bg-info/10 text-info',
  storage: 'bg-success/10 text-success',
  cache: 'bg-warning/10 text-warning',
  cdn: 'bg-error/10 text-error',
  queue: 'bg-info/20 text-info',
  'load-balancer': 'bg-surface-raised text-text-secondary',
};

const providerColors: Record<string, string> = {
  aws: 'bg-warning/10 text-warning',
  gcp: 'bg-info/10 text-info',
  azure: 'bg-info/20 text-info',
  kubernetes: 'bg-accent/10 text-accent',
};

const statusIcons = {
  running: <CheckCircle className="w-4 h-4 text-success-text" />,
  stopped: <XCircle className="w-4 h-4 text-text-tertiary" />,
  error: <AlertTriangle className="w-4 h-4 text-error-text" />,
  provisioning: <RefreshCw className="w-4 h-4 text-accent-text animate-spin" />,
};

export function Infrastructure() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('resources');

  const tabs = [
    { id: 'resources', label: 'Resources', count: mockResources.length },
    { id: 'clusters', label: 'Clusters' },
    { id: 'networking', label: 'Networking' },
  ];

  const filteredResources = useMemo(() => {
    let result = mockResources;
    
    if (typeFilter !== 'all') {
      result = result.filter((r) => r.type === typeFilter);
    }
    
    if (providerFilter !== 'all') {
      result = result.filter((r) => r.provider === providerFilter);
    }
    
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.application?.toLowerCase().includes(lower)
      );
    }
    
    return result;
  }, [typeFilter, providerFilter, search]);

  const totalCost = mockResources.reduce((sum, r) => sum + r.cost, 0);
  const runningCount = mockResources.filter((r) => r.status === 'running').length;
  const avgUtilization = Math.round(
    mockResources.filter((r) => r.utilization > 0).reduce((sum, r) => sum + r.utilization, 0) /
      mockResources.filter((r) => r.utilization > 0).length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Infrastructure</h1>
          <p className="text-text-secondary mt-1">
            Manage cloud resources and infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Sync
          </Button>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Provision Resource
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
              <Box className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{mockResources.length}</p>
              <p className="text-sm text-text-secondary">Total Resources</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{runningCount}</p>
              <p className="text-sm text-text-secondary">Running</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Cpu className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{avgUtilization}%</p>
              <p className="text-sm text-text-secondary">Avg Utilization</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <Cloud className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalCost)}</p>
              <p className="text-sm text-text-secondary">Monthly Cost</p>
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
            placeholder="Search resources..."
          />
        </div>
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'compute', label: 'Compute' },
            { value: 'database', label: 'Database' },
            { value: 'storage', label: 'Storage' },
            { value: 'cache', label: 'Cache' },
            { value: 'cdn', label: 'CDN' },
            { value: 'queue', label: 'Queue' },
            { value: 'load-balancer', label: 'Load Balancer' },
          ]}
          className="w-40"
        />
        <Select
          value={providerFilter}
          onChange={setProviderFilter}
          options={[
            { value: 'all', label: 'All Providers' },
            { value: 'aws', label: 'AWS' },
            { value: 'gcp', label: 'GCP' },
            { value: 'azure', label: 'Azure' },
            { value: 'kubernetes', label: 'Kubernetes' },
          ]}
          className="w-40"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'resources' && (
          <div className="space-y-3">
            {filteredResources.length === 0 ? (
              <Card className="text-center py-12">
                <Server className="w-12 h-12 text-text-disabled mx-auto mb-4" />
                <p className="font-medium text-text-primary">No resources found</p>
                <p className="text-sm text-text-secondary mt-1">
                  Try adjusting your filters
                </p>
              </Card>
            ) : (
              filteredResources.map((resource) => (
                <Card key={resource.id} variant="hover" padding="none">
                  <div className="flex items-center gap-4 p-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', typeColors[resource.type])}>
                      {typeIcons[resource.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-text-primary">{resource.name}</h3>
                        {statusIcons[resource.status]}
                      </div>
                      <p className="text-sm text-text-secondary">{resource.specs}</p>
                      {resource.application && (
                        <p className="text-sm text-text-tertiary mt-0.5">
                          Used by: {resource.application}
                        </p>
                      )}
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <Badge className={providerColors[resource.provider]} size="sm">
                          {resource.provider.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-text-tertiary mt-1">{resource.region}</p>
                      </div>
                      {resource.utilization > 0 && (
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-text-secondary">Usage</span>
                            <span className={cn(
                              'font-medium',
                              resource.utilization > 80 ? 'text-error-text' :
                              resource.utilization > 60 ? 'text-warning-text' : 'text-text-primary'
                            )}>
                              {resource.utilization}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-overlay">
                            <div
                              className={cn(
                                'h-1.5 rounded-full',
                                resource.utilization > 80 ? 'bg-error' :
                                resource.utilization > 60 ? 'bg-warning' : 'bg-accent'
                              )}
                              style={{ width: `${resource.utilization}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{formatCurrency(resource.cost)}</p>
                        <p className="text-xs text-text-tertiary">/month</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'clusters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center">
                  <Layers className="w-6 h-6 text-accent-text" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Production Cluster</h3>
                  <p className="text-sm text-text-secondary">Kubernetes v1.28</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success-text" />
                  <span className="text-sm text-success-text">Healthy</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-surface-raised">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">12</p>
                  <p className="text-sm text-text-secondary">Nodes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">48</p>
                  <p className="text-sm text-text-secondary">Pods</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">85%</p>
                  <p className="text-sm text-text-secondary">Capacity</p>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-subtle flex items-center justify-center">
                  <Layers className="w-6 h-6 text-accent-text" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Staging Cluster</h3>
                  <p className="text-sm text-text-secondary">Kubernetes v1.28</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success-text" />
                  <span className="text-sm text-success-text">Healthy</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-surface-raised">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">4</p>
                  <p className="text-sm text-text-secondary">Nodes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">18</p>
                  <p className="text-sm text-text-secondary">Pods</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">42%</p>
                  <p className="text-sm text-text-secondary">Capacity</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'networking' && (
          <div className="space-y-4">
            <Card padding="lg">
              <CardHeader title="VPCs" description="Virtual Private Clouds" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-default">
                  <Globe className="w-6 h-6 text-text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Production VPC</p>
                    <p className="text-sm text-text-secondary">10.0.0.0/16 · us-east-1</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-default">
                  <Globe className="w-6 h-6 text-text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Staging VPC</p>
                    <p className="text-sm text-text-secondary">10.1.0.0/16 · us-east-1</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <CardHeader title="Security Groups" description="Network access controls" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-default">
                  <Lock className="w-6 h-6 text-text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">api-gateway-sg</p>
                    <p className="text-sm text-text-secondary">HTTP/HTTPS from ALB only</p>
                  </div>
                  <span className="text-sm text-text-tertiary">5 rules</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-default">
                  <Lock className="w-6 h-6 text-text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">database-sg</p>
                    <p className="text-sm text-text-secondary">PostgreSQL from app subnets</p>
                  </div>
                  <span className="text-sm text-text-tertiary">3 rules</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
