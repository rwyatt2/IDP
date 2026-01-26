import { useState } from 'react';
import { cn, formatRelativeTime, formatDuration } from '@/lib/utils';
import { Card, SearchInput, Button, Select, Tabs, TabPanel } from '@/components/ui';
import {
  GitBranch,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Settings,
  RefreshCw,
  Terminal,
  Package,
  TestTube,
  Shield,
  Rocket,
  ArrowRight,
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  applicationId: string;
  applicationName: string;
  status: 'running' | 'succeeded' | 'failed' | 'pending' | 'cancelled';
  branch: string;
  commit: string;
  commitMessage: string;
  triggeredBy: string;
  triggeredAt: string;
  duration?: number;
  stages: PipelineStage[];
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'running' | 'succeeded' | 'failed' | 'pending' | 'skipped';
  duration?: number;
  icon: string;
}

const mockPipelines: Pipeline[] = [
  {
    id: 'pipe-1',
    name: 'Build & Deploy',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    status: 'running',
    branch: 'main',
    commit: 'abc1234',
    commitMessage: 'fix: rate limiting edge case',
    triggeredBy: 'Sarah Chen',
    triggeredAt: '2026-01-25T11:30:00Z',
    stages: [
      { id: 's1', name: 'Build', status: 'succeeded', duration: 120, icon: 'Package' },
      { id: 's2', name: 'Test', status: 'succeeded', duration: 180, icon: 'TestTube' },
      { id: 's3', name: 'Security Scan', status: 'running', icon: 'Shield' },
      { id: 's4', name: 'Deploy', status: 'pending', icon: 'Rocket' },
    ],
  },
  {
    id: 'pipe-2',
    name: 'Build & Deploy',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    status: 'succeeded',
    branch: 'feature/apple-pay',
    commit: 'def5678',
    commitMessage: 'feat: add Apple Pay support',
    triggeredBy: 'Alex Rivera',
    triggeredAt: '2026-01-25T10:00:00Z',
    duration: 540,
    stages: [
      { id: 's1', name: 'Build', status: 'succeeded', duration: 90, icon: 'Package' },
      { id: 's2', name: 'Test', status: 'succeeded', duration: 240, icon: 'TestTube' },
      { id: 's3', name: 'Security Scan', status: 'succeeded', duration: 60, icon: 'Shield' },
      { id: 's4', name: 'Deploy', status: 'succeeded', duration: 150, icon: 'Rocket' },
    ],
  },
  {
    id: 'pipe-3',
    name: 'Build & Deploy',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    status: 'failed',
    branch: 'main',
    commit: 'ghi9012',
    commitMessage: 'refactor: optimize bundle size',
    triggeredBy: 'Taylor Kim',
    triggeredAt: '2026-01-25T09:00:00Z',
    duration: 320,
    stages: [
      { id: 's1', name: 'Build', status: 'succeeded', duration: 60, icon: 'Package' },
      { id: 's2', name: 'Test', status: 'failed', duration: 260, icon: 'TestTube' },
      { id: 's3', name: 'Security Scan', status: 'skipped', icon: 'Shield' },
      { id: 's4', name: 'Deploy', status: 'skipped', icon: 'Rocket' },
    ],
  },
  {
    id: 'pipe-4',
    name: 'Build & Deploy',
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    status: 'succeeded',
    branch: 'hotfix/security-patch',
    commit: 'jkl3456',
    commitMessage: 'security: patch CVE-2026-1234',
    triggeredBy: 'Sarah Chen',
    triggeredAt: '2026-01-24T14:00:00Z',
    duration: 420,
    stages: [
      { id: 's1', name: 'Build', status: 'succeeded', duration: 80, icon: 'Package' },
      { id: 's2', name: 'Test', status: 'succeeded', duration: 200, icon: 'TestTube' },
      { id: 's3', name: 'Security Scan', status: 'succeeded', duration: 45, icon: 'Shield' },
      { id: 's4', name: 'Deploy', status: 'succeeded', duration: 95, icon: 'Rocket' },
    ],
  },
];

const stageIcons: Record<string, React.ReactNode> = {
  Package: <Package className="w-4 h-4" />,
  TestTube: <TestTube className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Rocket: <Rocket className="w-4 h-4" />,
};

const statusIcons = {
  running: <Loader2 className="w-5 h-5 text-accent-text animate-spin" />,
  succeeded: <CheckCircle className="w-5 h-5 text-success-text" />,
  failed: <XCircle className="w-5 h-5 text-error-text" />,
  pending: <Clock className="w-5 h-5 text-text-tertiary" />,
  cancelled: <XCircle className="w-5 h-5 text-text-tertiary" />,
  skipped: <ArrowRight className="w-5 h-5 text-text-tertiary" />,
};

function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {statusIcons[pipeline.status]}
            <div>
              <h3 className="font-semibold text-text-primary">{pipeline.applicationName}</h3>
              <p className="text-sm text-text-secondary">{pipeline.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pipeline.status === 'running' && (
              <Button variant="ghost" size="sm" leftIcon={<Pause className="w-4 h-4" />}>
                Cancel
              </Button>
            )}
            {pipeline.status === 'failed' && (
              <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
                Retry
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <GitBranch className="w-4 h-4" />
            <span>{pipeline.branch}</span>
          </div>
          <span className="font-mono text-xs">{pipeline.commit}</span>
          <span>·</span>
          <span>{pipeline.triggeredBy}</span>
          <span>·</span>
          <span>{formatRelativeTime(pipeline.triggeredAt)}</span>
          {pipeline.duration && (
            <>
              <span>·</span>
              <span>{formatDuration(pipeline.duration * 1000)}</span>
            </>
          )}
        </div>
        <p className="text-sm text-text-secondary mt-2 truncate">{pipeline.commitMessage}</p>
      </div>

      {/* Stages */}
      <div className="p-4 bg-surface-raised">
        <div className="flex items-center justify-between">
          {pipeline.stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  stage.status === 'succeeded' && 'bg-success-subtle text-success-text',
                  stage.status === 'failed' && 'bg-error-subtle text-error-text',
                  stage.status === 'running' && 'bg-accent-subtle text-accent-text',
                  stage.status === 'pending' && 'bg-surface-overlay text-text-secondary',
                  stage.status === 'skipped' && 'bg-surface-raised text-text-tertiary'
                )}
              >
                {stage.status === 'running' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  stageIcons[stage.icon]
                )}
                <span className="text-sm font-medium">{stage.name}</span>
                {stage.duration && (
                  <span className="text-xs opacity-75">
                    {formatDuration(stage.duration * 1000)}
                  </span>
                )}
              </div>
              {index < pipeline.stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-text-disabled mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function Pipelines() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('recent');

  const tabs = [
    { id: 'recent', label: 'Recent Runs', count: mockPipelines.length },
    { id: 'running', label: 'Running', count: mockPipelines.filter((p) => p.status === 'running').length },
    { id: 'templates', label: 'Templates' },
  ];

  const filteredPipelines = mockPipelines.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const lower = search.toLowerCase();
      return (
        p.applicationName.toLowerCase().includes(lower) ||
        p.branch.toLowerCase().includes(lower) ||
        p.commitMessage.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pipelines</h1>
          <p className="text-text-secondary mt-1">
            Build, test, and deploy your applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<Settings className="w-4 h-4" />}>
            Configure
          </Button>
          <Button variant="primary" leftIcon={<Play className="w-4 h-4" />}>
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-accent-text animate-spin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {mockPipelines.filter((p) => p.status === 'running').length}
              </p>
              <p className="text-sm text-text-secondary">Running</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {mockPipelines.filter((p) => p.status === 'succeeded').length}
              </p>
              <p className="text-sm text-text-secondary">Succeeded</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-subtle flex items-center justify-center">
              <XCircle className="w-5 h-5 text-error-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {mockPipelines.filter((p) => p.status === 'failed').length}
              </p>
              <p className="text-sm text-text-secondary">Failed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
              <Clock className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">~8m</p>
              <p className="text-sm text-text-secondary">Avg Duration</p>
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
            placeholder="Search pipelines..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'running', label: 'Running' },
            { value: 'succeeded', label: 'Succeeded' },
            { value: 'failed', label: 'Failed' },
          ]}
          className="w-40"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'templates' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Node.js', 'Python', 'Go', 'Java', 'React', 'Docker'].map((template) => (
              <Card key={template} variant="hover" className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-text-secondary" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{template} Pipeline</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Standard CI/CD pipeline template for {template} applications
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPipelines.length === 0 ? (
              <Card className="text-center py-12">
                <GitBranch className="w-12 h-12 text-text-disabled mx-auto mb-4" />
                <p className="font-medium text-text-primary">No pipelines found</p>
                <p className="text-sm text-text-secondary mt-1">
                  {search ? 'Try adjusting your search' : 'Run a pipeline to see it here'}
                </p>
              </Card>
            ) : (
              filteredPipelines.map((pipeline) => (
                <PipelineCard key={pipeline.id} pipeline={pipeline} />
              ))
            )}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
