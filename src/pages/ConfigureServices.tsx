import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { applications } from '@/data/mock-data';
import { Card, CardHeader, SearchInput, Badge, StatusBadge, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  Server,
  Key,
  Lock,
  RefreshCw,
  Plus,
  ChevronRight,
  Check,
  Cpu,
  HardDrive,
  Network,
  Shield,
} from 'lucide-react';

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'secret';
  environment: string;
  lastModified: string;
  modifiedBy: string;
}

const mockConfigs: ConfigItem[] = [
  { id: '1', key: 'DATABASE_URL', value: '********', type: 'secret', environment: 'production', lastModified: '2026-01-20', modifiedBy: 'Sarah Chen' },
  { id: '2', key: 'API_RATE_LIMIT', value: '1000', type: 'number', environment: 'production', lastModified: '2026-01-18', modifiedBy: 'Mike Johnson' },
  { id: '3', key: 'ENABLE_CACHE', value: 'true', type: 'boolean', environment: 'production', lastModified: '2026-01-15', modifiedBy: 'Sarah Chen' },
  { id: '4', key: 'LOG_LEVEL', value: 'info', type: 'string', environment: 'production', lastModified: '2026-01-10', modifiedBy: 'Emily Wang' },
  { id: '5', key: 'REDIS_HOST', value: 'redis.internal', type: 'string', environment: 'production', lastModified: '2026-01-08', modifiedBy: 'Sarah Chen' },
];

const resourcePresets = [
  { id: 'small', name: 'Small', cpu: '0.5 vCPU', memory: '512 MB', price: '$25/mo' },
  { id: 'medium', name: 'Medium', cpu: '1 vCPU', memory: '1 GB', price: '$50/mo' },
  { id: 'large', name: 'Large', cpu: '2 vCPU', memory: '2 GB', price: '$100/mo' },
  { id: 'xlarge', name: 'X-Large', cpu: '4 vCPU', memory: '4 GB', price: '$200/mo' },
];

export function ConfigureServices() {
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(applications[0]?.id || '');
  const [activeTab, setActiveTab] = useState('environment');
  const [selectedEnv, setSelectedEnv] = useState('production');

  const selectedApplication = applications.find((a) => a.id === selectedApp);

  const tabs = [
    { id: 'environment', label: 'Environment Variables' },
    { id: 'resources', label: 'Resources' },
    { id: 'scaling', label: 'Scaling' },
    { id: 'security', label: 'Security' },
  ];

  const filteredConfigs = mockConfigs.filter((c) =>
    c.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configure Services</h1>
          <p className="text-slate-500 mt-1">
            Manage environment variables, resources, and service settings
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Configuration
        </Button>
      </div>

      {/* Application Selector */}
      <Card padding="lg">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="label">Select Application</label>
            <Select
              value={selectedApp}
              onChange={setSelectedApp}
              options={applications.map((a) => ({
                value: a.id,
                label: a.displayName,
              }))}
            />
          </div>
          <div className="flex-1">
            <label className="label">Environment</label>
            <Select
              value={selectedEnv}
              onChange={setSelectedEnv}
              options={[
                { value: 'development', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'production', label: 'Production' },
              ]}
            />
          </div>
        </div>
        {selectedApplication && (
          <div className="mt-4 p-4 rounded-lg bg-slate-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
              <Server className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{selectedApplication.displayName}</h3>
              <p className="text-sm text-slate-500">{selectedApplication.description}</p>
            </div>
            <StatusBadge status={selectedApplication.status} />
            <Link
              to={`/discover/catalog/${selectedApplication.id}`}
              className="text-primary-600 hover:text-primary-700"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <TabPanel>
        {activeTab === 'environment' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch('')}
                  placeholder="Search variables..."
                />
              </div>
              <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
                Sync
              </Button>
            </div>

            {/* Config Table */}
            <Card padding="none">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-4 font-medium text-slate-600">Key</th>
                    <th className="text-left p-4 font-medium text-slate-600">Value</th>
                    <th className="text-left p-4 font-medium text-slate-600">Type</th>
                    <th className="text-left p-4 font-medium text-slate-600">Modified</th>
                    <th className="text-right p-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfigs.map((config) => (
                    <tr key={config.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {config.type === 'secret' ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Key className="w-4 h-4 text-slate-400" />
                          )}
                          <code className="font-mono text-sm text-slate-900">{config.key}</code>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="font-mono text-sm text-slate-600">{config.value}</code>
                      </td>
                      <td className="p-4">
                        <Badge variant="neutral" size="sm">{config.type}</Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600">{config.lastModified}</p>
                        <p className="text-xs text-slate-400">{config.modifiedBy}</p>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <CardHeader
                title="Resource Allocation"
                description="Configure compute resources for your service"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                {resourcePresets.map((preset) => (
                  <button
                    key={preset.id}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-colors',
                      preset.id === 'medium'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{preset.name}</span>
                      {preset.id === 'medium' && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span>{preset.cpu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        <span>{preset.memory}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">{preset.price}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader
                title="Current Usage"
                description="Resource utilization over the last 24 hours"
              />
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">CPU Usage</span>
                    <span className="text-sm font-medium text-slate-900">45%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Memory Usage</span>
                    <span className="text-sm font-medium text-slate-900">62%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Network I/O</span>
                    <span className="text-sm font-medium text-slate-900">28%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-primary-500" style={{ width: '28%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'scaling' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <CardHeader
                title="Auto Scaling"
                description="Configure automatic scaling rules"
              />
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-success-50 border border-success-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-success-600" />
                    <span className="font-medium text-success-800">Auto Scaling Enabled</span>
                  </div>
                  <p className="text-sm text-success-700">
                    Your service will automatically scale based on demand
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">Minimum Instances</p>
                      <p className="text-sm text-slate-500">Always keep at least this many running</p>
                    </div>
                    <Badge variant="info">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">Maximum Instances</p>
                      <p className="text-sm text-slate-500">Scale up to this many under load</p>
                    </div>
                    <Badge variant="info">10</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">Target CPU</p>
                      <p className="text-sm text-slate-500">Scale when CPU exceeds this</p>
                    </div>
                    <Badge variant="info">70%</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader
                title="Current Scale"
                description="Active instances and their status"
              />
              <div className="mt-4">
                <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg">
                  <p className="text-4xl font-bold text-slate-900">3</p>
                  <p className="text-slate-500">Running Instances</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-success-50 border border-success-200 text-center"
                    >
                      <Server className="w-5 h-5 text-success-600 mx-auto mb-1" />
                      <p className="text-xs text-success-700">Instance {i}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <Card padding="lg">
              <CardHeader
                title="Security Settings"
                description="Configure security policies and access controls"
              />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">TLS/SSL Encryption</p>
                      <p className="text-sm text-slate-500">All traffic is encrypted in transit</p>
                    </div>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Secret Encryption</p>
                      <p className="text-sm text-slate-500">Secrets are encrypted at rest</p>
                    </div>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                      <Network className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Network Policy</p>
                      <p className="text-sm text-slate-500">Restrict network access to specific services</p>
                    </div>
                  </div>
                  <Badge variant="warning">Review</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
