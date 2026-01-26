import { useState } from 'react';
import { cn } from '@/lib/utils';
import { applications } from '@/data/mock-data';
import { Card, CardHeader, Badge, StatusBadge, Button, Tabs, TabPanel } from '@/components/ui';
import {
  Globe,
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  Plus,
  Lock,
  RefreshCw,
  ExternalLink,
  Cloud,
} from 'lucide-react';

interface Environment {
  id: string;
  name: string;
  displayName: string;
  status: 'healthy' | 'degraded' | 'down';
  region: string;
  url: string;
  services: number;
  healthyServices: number;
  lastDeployment: string;
  locked: boolean;
  type: 'production' | 'staging' | 'development' | 'sandbox';
}

const mockEnvironments: Environment[] = [
  {
    id: 'env-1',
    name: 'production',
    displayName: 'Production',
    status: 'healthy',
    region: 'us-east-1',
    url: 'https://app.company.com',
    services: 6,
    healthyServices: 5,
    lastDeployment: '2026-01-25T10:45:00Z',
    locked: false,
    type: 'production',
  },
  {
    id: 'env-2',
    name: 'staging',
    displayName: 'Staging',
    status: 'healthy',
    region: 'us-east-1',
    url: 'https://staging.company.com',
    services: 6,
    healthyServices: 6,
    lastDeployment: '2026-01-25T11:00:00Z',
    locked: false,
    type: 'staging',
  },
  {
    id: 'env-3',
    name: 'development',
    displayName: 'Development',
    status: 'degraded',
    region: 'us-east-1',
    url: 'https://dev.company.com',
    services: 6,
    healthyServices: 4,
    lastDeployment: '2026-01-25T09:30:00Z',
    locked: false,
    type: 'development',
  },
  {
    id: 'env-4',
    name: 'sandbox',
    displayName: 'Sandbox',
    status: 'healthy',
    region: 'us-west-2',
    url: 'https://sandbox.company.com',
    services: 3,
    healthyServices: 3,
    lastDeployment: '2026-01-24T15:00:00Z',
    locked: false,
    type: 'sandbox',
  },
];

const typeColors: Record<string, string> = {
  production: 'bg-error-subtle text-error-text',
  staging: 'bg-warning-subtle text-warning-text',
  development: 'bg-info-subtle text-info-text',
  sandbox: 'bg-surface-overlay text-text-secondary',
};

const statusIcons = {
  healthy: <CheckCircle className="w-5 h-5 text-success-text" />,
  degraded: <AlertTriangle className="w-5 h-5 text-warning-text" />,
  down: <XCircle className="w-5 h-5 text-error-text" />,
};

function EnvironmentCard({ env }: { env: Environment }) {
  return (
    <Card variant="hover" padding="none" className="overflow-hidden">
      <div className={cn('h-1', 
        env.status === 'healthy' && 'bg-success',
        env.status === 'degraded' && 'bg-warning',
        env.status === 'down' && 'bg-error'
      )} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              typeColors[env.type]
            )}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">{env.displayName}</h3>
                {env.locked && <Lock className="w-4 h-4 text-text-tertiary" />}
              </div>
              <p className="text-sm text-text-secondary">{env.region}</p>
            </div>
          </div>
          {statusIcons[env.status]}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-surface-raised">
            <p className="text-2xl font-bold text-text-primary">
              {env.healthyServices}/{env.services}
            </p>
            <p className="text-sm text-text-secondary">Services Healthy</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-raised">
            <p className="text-sm font-medium text-text-primary truncate">{env.url}</p>
            <p className="text-sm text-text-secondary">Environment URL</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <Badge className={typeColors[env.type]} size="sm">
            {env.type}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
              Open
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
              Configure
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Environments() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Services' },
    { id: 'variables', label: 'Variables' },
    { id: 'secrets', label: 'Secrets' },
  ];

  const healthyEnvs = mockEnvironments.filter((e) => e.status === 'healthy').length;
  const totalServices = mockEnvironments.reduce((sum, e) => sum + e.services, 0);
  const healthyServices = mockEnvironments.reduce((sum, e) => sum + e.healthyServices, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Environments</h1>
          <p className="text-text-secondary mt-1">
            Manage deployment environments and configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Sync All
          </Button>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            New Environment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
              <Globe className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{mockEnvironments.length}</p>
              <p className="text-sm text-text-secondary">Environments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{healthyEnvs}</p>
              <p className="text-sm text-text-secondary">Healthy</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Server className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{healthyServices}/{totalServices}</p>
              <p className="text-sm text-text-secondary">Services</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-subtle flex items-center justify-center">
              <Cloud className="w-5 h-5 text-info-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">2</p>
              <p className="text-sm text-text-secondary">Regions</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEnvironments.map((env) => (
              <EnvironmentCard key={env.id} env={env} />
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <Card padding="none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default bg-surface-raised">
                  <th className="text-left p-4 font-medium text-text-secondary">Service</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Production</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Staging</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Development</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-border-subtle last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-text-tertiary" />
                        <span className="font-medium text-text-primary">{app.displayName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {app.environment.includes('production') ? (
                        <StatusBadge status={app.status} />
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {app.environment.includes('staging') ? (
                        <StatusBadge status="healthy" />
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {app.environment.includes('development') ? (
                        <StatusBadge status="healthy" />
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'variables' && (
          <Card padding="lg">
            <CardHeader
              title="Environment Variables"
              description="Shared variables across environments"
              action={<Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Variable</Button>}
            />
            <div className="mt-4 space-y-3">
              {[
                { key: 'NODE_ENV', production: 'production', staging: 'staging', development: 'development' },
                { key: 'LOG_LEVEL', production: 'warn', staging: 'info', development: 'debug' },
                { key: 'API_TIMEOUT', production: '30000', staging: '30000', development: '60000' },
                { key: 'CACHE_TTL', production: '3600', staging: '300', development: '60' },
              ].map((variable) => (
                <div key={variable.key} className="flex items-center gap-4 p-3 rounded-lg border border-border-default">
                  <code className="font-mono text-sm font-medium text-text-primary w-32">
                    {variable.key}
                  </code>
                  <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-tertiary">prod:</span>{' '}
                      <code className="text-text-secondary">{variable.production}</code>
                    </div>
                    <div>
                      <span className="text-text-tertiary">staging:</span>{' '}
                      <code className="text-text-secondary">{variable.staging}</code>
                    </div>
                    <div>
                      <span className="text-text-tertiary">dev:</span>{' '}
                      <code className="text-text-secondary">{variable.development}</code>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'secrets' && (
          <Card padding="lg">
            <CardHeader
              title="Secrets"
              description="Encrypted secrets per environment"
              action={<Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Secret</Button>}
            />
            <div className="mt-4 space-y-3">
              {[
                { key: 'DATABASE_URL', environments: ['production', 'staging', 'development'] },
                { key: 'API_KEY', environments: ['production', 'staging'] },
                { key: 'JWT_SECRET', environments: ['production', 'staging', 'development'] },
                { key: 'STRIPE_SECRET', environments: ['production'] },
              ].map((secret) => (
                <div key={secret.key} className="flex items-center gap-4 p-3 rounded-lg border border-border-default">
                  <Lock className="w-4 h-4 text-text-tertiary" />
                  <code className="font-mono text-sm font-medium text-text-primary flex-1">
                    {secret.key}
                  </code>
                  <div className="flex items-center gap-2">
                    {secret.environments.map((env) => (
                      <Badge key={env} className={typeColors[env]} size="sm">
                        {env}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">Rotate</Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </TabPanel>
    </div>
  );
}
