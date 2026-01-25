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
  running: <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />,
  succeeded: <CheckCircle className="w-5 h-5 text-success-500" />,
  failed: <XCircle className="w-5 h-5 text-danger-500" />,
  pending: <Clock className="w-5 h-5 text-slate-400" />,
  cancelled: <XCircle className="w-5 h-5 text-slate-400" />,
  skipped: <ArrowRight className="w-5 h-5 text-slate-400" />,
};

function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {statusIcons[pipeline.status]}
            <div>
              <h3 className="font-semibold text-slate-900">{pipeline.applicationName}</h3>
              <p className="text-sm text-slate-500">{pipeline.name}</p>
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
        <div className="flex items-center gap-4 text-sm text-slate-500">
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
        <p className="text-sm text-slate-600 mt-2 truncate">{pipeline.commitMessage}</p>
      </div>

      {/* Stages */}
      <div className="p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          {pipeline.stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  stage.status === 'succeeded' && 'bg-success-100 text-success-700',
                  stage.status === 'failed' && 'bg-danger-100 text-danger-700',
                  stage.status === 'running' && 'bg-primary-100 text-primary-700',
                  stage.status === 'pending' && 'bg-slate-200 text-slate-600',
                  stage.status === 'skipped' && 'bg-slate-100 text-slate-400'
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
                <ArrowRight className="w-4 h-4 text-slate-300 mx-2" />
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
          <h1 className="text-2xl font-bold text-slate-900">Pipelines</h1>
          <p className="text-slate-500 mt-1">
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
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {mockPipelines.filter((p) => p.status === 'running').length}
              </p>
              <p className="text-sm text-slate-500">Running</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {mockPipelines.filter((p) => p.status === 'succeeded').length}
              </p>
              <p className="text-sm text-slate-500">Succeeded</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {mockPipelines.filter((p) => p.status === 'failed').length}
              </p>
              <p className="text-sm text-slate-500">Failed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">~8m</p>
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
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{template} Pipeline</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">
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
                <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-medium text-slate-900">No pipelines found</p>
                <p className="text-sm text-slate-500 mt-1">
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
