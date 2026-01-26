import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { applications } from '@/data/mock-data';
import { Card, SearchInput, Badge, Button, Select, Tabs, TabPanel, AvatarGroup } from '@/components/ui';
import {
  GitPullRequest,
  Rocket,
  Plus,
  GitCommit,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
  Users,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface Release {
  id: string;
  version: string;
  applicationId: string;
  applicationName: string;
  status: 'draft' | 'pending' | 'approved' | 'deployed' | 'rolled-back';
  createdBy: string;
  createdAt: string;
  deployedAt?: string;
  commits: number;
  changelog: string;
  approvers: string[];
  environments: { name: string; status: string }[];
}

const mockReleases: Release[] = [
  {
    id: 'rel-1',
    version: 'v2.14.3',
    applicationId: 'app-1',
    applicationName: 'API Gateway',
    status: 'deployed',
    createdBy: 'Sarah Chen',
    createdAt: '2026-01-25T08:00:00Z',
    deployedAt: '2026-01-25T10:45:00Z',
    commits: 3,
    changelog: 'Fixed rate limiting edge case and updated dependencies',
    approvers: ['Alex Rivera'],
    environments: [
      { name: 'staging', status: 'deployed' },
      { name: 'production', status: 'deployed' },
    ],
  },
  {
    id: 'rel-2',
    version: 'v4.2.0',
    applicationId: 'app-3',
    applicationName: 'User Dashboard',
    status: 'pending',
    createdBy: 'Taylor Kim',
    createdAt: '2026-01-25T07:00:00Z',
    commits: 8,
    changelog: 'Redesigned settings page with improved accessibility',
    approvers: [],
    environments: [
      { name: 'staging', status: 'deployed' },
      { name: 'production', status: 'pending' },
    ],
  },
  {
    id: 'rel-3',
    version: 'v3.8.1',
    applicationId: 'app-2',
    applicationName: 'Payment Service',
    status: 'approved',
    createdBy: 'Alex Rivera',
    createdAt: '2026-01-24T15:00:00Z',
    commits: 5,
    changelog: 'Added Apple Pay support and improved error handling',
    approvers: ['Sarah Chen', 'Jordan Lee'],
    environments: [
      { name: 'staging', status: 'deployed' },
      { name: 'production', status: 'ready' },
    ],
  },
  {
    id: 'rel-4',
    version: 'v5.1.2',
    applicationId: 'app-6',
    applicationName: 'Authentication Service',
    status: 'deployed',
    createdBy: 'Sarah Chen',
    createdAt: '2026-01-24T06:00:00Z',
    deployedAt: '2026-01-24T08:12:00Z',
    commits: 1,
    changelog: 'Security patch for CVE-2026-1234',
    approvers: ['Mike Johnson', 'Alex Rivera'],
    environments: [
      { name: 'staging', status: 'deployed' },
      { name: 'production', status: 'deployed' },
    ],
  },
  {
    id: 'rel-5',
    version: 'v1.12.0',
    applicationId: 'app-4',
    applicationName: 'Notification Service',
    status: 'rolled-back',
    createdBy: 'Emily Wang',
    createdAt: '2026-01-24T12:00:00Z',
    deployedAt: '2026-01-24T14:15:00Z',
    commits: 4,
    changelog: 'Batch notification support',
    approvers: ['Sarah Chen'],
    environments: [
      { name: 'staging', status: 'deployed' },
      { name: 'production', status: 'rolled-back' },
    ],
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  draft: { icon: <GitPullRequest className="w-4 h-4" />, color: 'bg-surface-raised text-text-secondary', label: 'Draft' },
  pending: { icon: <Clock className="w-4 h-4" />, color: 'bg-warning-subtle text-warning-text', label: 'Pending Approval' },
  approved: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-success-subtle text-success-text', label: 'Approved' },
  deployed: { icon: <Rocket className="w-4 h-4" />, color: 'bg-accent-subtle text-accent-text', label: 'Deployed' },
  'rolled-back': { icon: <XCircle className="w-4 h-4" />, color: 'bg-error-subtle text-error-text', label: 'Rolled Back' },
};

function ReleaseCard({ release }: { release: Release }) {
  const status = statusConfig[release.status];

  return (
    <Card variant="hover" padding="none" className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={status.color}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
          </div>
          <span className="text-sm text-text-secondary">
            {formatRelativeTime(release.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <Tag className="w-5 h-5 text-text-tertiary" />
          <h3 className="text-lg font-semibold text-text-primary">{release.version}</h3>
          <span className="text-text-secondary">·</span>
          <Link
            to={`/discover/catalog/${release.applicationId}`}
            className="text-accent-text hover:text-accent"
          >
            {release.applicationName}
          </Link>
        </div>

        <p className="text-text-secondary mb-4">{release.changelog}</p>

        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <GitCommit className="w-4 h-4" />
            <span>{release.commits} commits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{release.createdBy}</span>
          </div>
        </div>

        {/* Environments */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
          {release.environments.map((env) => (
            <div
              key={env.name}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                env.status === 'deployed' && 'bg-success-subtle text-success-text',
                env.status === 'pending' && 'bg-warning-subtle text-warning-text',
                env.status === 'ready' && 'bg-accent-subtle text-accent-text',
                env.status === 'rolled-back' && 'bg-error-subtle text-error-text'
              )}
            >
              <span className="capitalize font-medium">{env.name}</span>
              {env.status === 'deployed' && <CheckCircle className="w-3.5 h-3.5" />}
              {env.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
              {env.status === 'ready' && <ArrowRight className="w-3.5 h-3.5" />}
              {env.status === 'rolled-back' && <XCircle className="w-3.5 h-3.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border-default bg-surface-raised flex items-center justify-between">
        <div className="flex items-center gap-2">
          {release.approvers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>Approved by:</span>
              <AvatarGroup
                avatars={release.approvers.map((a) => ({ name: a }))}
                size="sm"
                max={3}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
            Details
          </Button>
          {release.status === 'pending' && (
            <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}>
              Approve
            </Button>
          )}
          {release.status === 'approved' && (
            <Button variant="primary" size="sm" leftIcon={<Rocket className="w-4 h-4" />}>
              Deploy
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function Releases() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Releases', count: mockReleases.length },
    { id: 'pending', label: 'Pending', count: mockReleases.filter((r) => r.status === 'pending').length },
    { id: 'approved', label: 'Ready to Deploy', count: mockReleases.filter((r) => r.status === 'approved').length },
    { id: 'deployed', label: 'Deployed', count: mockReleases.filter((r) => r.status === 'deployed').length },
  ];

  const filteredReleases = mockReleases.filter((r) => {
    if (activeTab !== 'all' && r.status !== activeTab) return false;
    if (search) {
      const lower = search.toLowerCase();
      return (
        r.version.toLowerCase().includes(lower) ||
        r.applicationName.toLowerCase().includes(lower) ||
        r.changelog.toLowerCase().includes(lower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Releases</h1>
          <p className="text-text-secondary mt-1">
            Manage release versions and deployments
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Create Release
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
              <Tag className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{mockReleases.length}</p>
              <p className="text-sm text-text-secondary">Total Releases</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-subtle flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {mockReleases.filter((r) => r.status === 'pending').length}
              </p>
              <p className="text-sm text-text-secondary">Awaiting Approval</p>
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
                {mockReleases.filter((r) => r.status === 'approved').length}
              </p>
              <p className="text-sm text-text-secondary">Ready to Deploy</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {mockReleases.filter((r) => r.status === 'deployed').length}
              </p>
              <p className="text-sm text-text-secondary">Deployed Today</p>
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
            placeholder="Search releases..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={applications.slice(0, 5).map((a) => ({
            value: a.id,
            label: a.displayName,
          })).concat([{ value: 'all', label: 'All Applications' }])}
          className="w-48"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Releases */}
      <TabPanel>
        {filteredReleases.length === 0 ? (
          <Card className="text-center py-12">
            <Tag className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="font-medium text-text-primary">No releases found</p>
            <p className="text-sm text-text-secondary mt-1">
              {search ? 'Try adjusting your search' : 'Create a release to get started'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
