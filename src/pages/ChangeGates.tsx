import { useState } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Card, CardHeader, Badge, Button, Tabs, TabPanel, Avatar, AvatarGroup } from '@/components/ui';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Settings,
  Play,
  Pause,
  Users,
  Calendar,
  Lock,
  Bell,
} from 'lucide-react';

interface ChangeGate {
  id: string;
  name: string;
  type: 'approval' | 'schedule' | 'automated' | 'manual';
  environment: string;
  status: 'active' | 'paused' | 'disabled';
  rules: string[];
  approvers?: string[];
  schedule?: string;
  lastTriggered?: string;
}

interface PendingChange {
  id: string;
  gate: string;
  application: string;
  version: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvals: { user: string; status: string; timestamp?: string }[];
  requiredApprovals: number;
}

const mockGates: ChangeGate[] = [
  {
    id: 'gate-1',
    name: 'Production Approval',
    type: 'approval',
    environment: 'production',
    status: 'active',
    rules: ['Requires 2 approvals from Platform team', 'No deployments during incidents'],
    approvers: ['Sarah Chen', 'Mike Johnson', 'Alex Rivera'],
    lastTriggered: '2026-01-25T10:28:00Z',
  },
  {
    id: 'gate-2',
    name: 'Staging Auto-Deploy',
    type: 'automated',
    environment: 'staging',
    status: 'active',
    rules: ['All tests must pass', 'Security scan must pass', 'Coverage > 80%'],
    lastTriggered: '2026-01-25T11:00:00Z',
  },
  {
    id: 'gate-3',
    name: 'Change Freeze',
    type: 'schedule',
    environment: 'production',
    status: 'paused',
    rules: ['No deployments Friday 6PM - Monday 6AM', 'No deployments during holidays'],
    schedule: 'Fri 18:00 - Mon 06:00 UTC',
  },
  {
    id: 'gate-4',
    name: 'Tier-1 Services',
    type: 'approval',
    environment: 'production',
    status: 'active',
    rules: ['Requires Tech Lead approval', 'Must have rollback plan', 'Notification to #incidents'],
    approvers: ['Sarah Chen', 'Alex Rivera'],
  },
];

const mockPendingChanges: PendingChange[] = [
  {
    id: 'pc-1',
    gate: 'Production Approval',
    application: 'User Dashboard',
    version: 'v4.2.0',
    requestedBy: 'Taylor Kim',
    requestedAt: '2026-01-25T09:00:00Z',
    status: 'pending',
    approvals: [
      { user: 'Sarah Chen', status: 'pending' },
    ],
    requiredApprovals: 2,
  },
  {
    id: 'pc-2',
    gate: 'Tier-1 Services',
    application: 'Payment Service',
    version: 'v3.8.1',
    requestedBy: 'Alex Rivera',
    requestedAt: '2026-01-24T15:30:00Z',
    status: 'approved',
    approvals: [
      { user: 'Sarah Chen', status: 'approved', timestamp: '2026-01-24T15:45:00Z' },
      { user: 'Jordan Lee', status: 'approved', timestamp: '2026-01-24T15:50:00Z' },
    ],
    requiredApprovals: 2,
  },
];

const gateTypeIcons = {
  approval: <Users className="w-5 h-5" />,
  schedule: <Calendar className="w-5 h-5" />,
  automated: <ShieldCheck className="w-5 h-5" />,
  manual: <Lock className="w-5 h-5" />,
};

const gateTypeColors = {
  approval: 'bg-purple-100 text-purple-600',
  schedule: 'bg-blue-100 text-blue-600',
  automated: 'bg-green-100 text-green-600',
  manual: 'bg-orange-100 text-orange-600',
};

const statusColors = {
  active: 'bg-success-100 text-success-700',
  paused: 'bg-warning-100 text-warning-700',
  disabled: 'bg-slate-100 text-slate-600',
};

function GateCard({ gate }: { gate: ChangeGate }) {
  return (
    <Card variant="hover" padding="none" className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', gateTypeColors[gate.type])}>
              {gateTypeIcons[gate.type]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{gate.name}</h3>
              <p className="text-sm text-slate-500 capitalize">{gate.environment}</p>
            </div>
          </div>
          <Badge className={statusColors[gate.status]} size="sm">
            {gate.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {gate.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        {gate.approvers && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-500">Approvers:</span>
            <AvatarGroup
              avatars={gate.approvers.map((a) => ({ name: a }))}
              size="sm"
              max={4}
            />
          </div>
        )}

        {gate.schedule && (
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{gate.schedule}</span>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        {gate.lastTriggered && (
          <span className="text-xs text-slate-500">
            Last triggered {formatRelativeTime(gate.lastTriggered)}
          </span>
        )}
        {!gate.lastTriggered && <span />}
        <div className="flex items-center gap-2">
          {gate.status === 'active' ? (
            <Button variant="ghost" size="sm" leftIcon={<Pause className="w-4 h-4" />}>
              Pause
            </Button>
          ) : (
            <Button variant="ghost" size="sm" leftIcon={<Play className="w-4 h-4" />}>
              Enable
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function ChangeGates() {
  const [activeTab, setActiveTab] = useState('gates');

  const tabs = [
    { id: 'gates', label: 'Gates', count: mockGates.length },
    { id: 'pending', label: 'Pending Changes', count: mockPendingChanges.filter((c) => c.status === 'pending').length },
    { id: 'history', label: 'History' },
  ];

  const pendingCount = mockPendingChanges.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Change Gates</h1>
          <p className="text-slate-500 mt-1">
            Control and govern deployment workflows
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Create Gate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockGates.length}</p>
              <p className="text-sm text-slate-500">Total Gates</p>
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
                {mockGates.filter((g) => g.status === 'active').length}
              </p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              <p className="text-sm text-slate-500">Pending Approval</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {mockGates.filter((g) => g.type === 'approval').length}
              </p>
              <p className="text-sm text-slate-500">Approval Gates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <Card className="bg-warning-50 border-warning-200 p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-warning-800">
                {pendingCount} change{pendingCount !== 1 ? 's' : ''} awaiting approval
              </p>
              <p className="text-sm text-warning-700">
                Review and approve pending deployment requests
              </p>
            </div>
            <Button variant="secondary" onClick={() => setActiveTab('pending')}>
              Review
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'gates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockGates.map((gate) => (
              <GateCard key={gate.id} gate={gate} />
            ))}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {mockPendingChanges.filter((c) => c.status === 'pending').length === 0 ? (
              <Card className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <p className="font-medium text-slate-900">No pending changes</p>
                <p className="text-sm text-slate-500 mt-1">
                  All deployment requests have been processed
                </p>
              </Card>
            ) : (
              mockPendingChanges.map((change) => (
                <Card key={change.id} padding="lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{change.application}</h3>
                        <Badge variant="info">{change.version}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        Gate: {change.gate} · Requested by {change.requestedBy}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatRelativeTime(change.requestedAt)}
                      </p>
                    </div>
                    {change.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" leftIcon={<XCircle className="w-4 h-4" />}>
                          Reject
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}>
                          Approve
                        </Button>
                      </div>
                    )}
                    {change.status === 'approved' && (
                      <Badge variant="success">Approved</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">
                      {change.approvals.filter((a) => a.status === 'approved').length}/{change.requiredApprovals} approvals
                    </span>
                    <div className="flex items-center gap-2">
                      {change.approvals.map((approval, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Avatar name={approval.user} size="sm" />
                          {approval.status === 'approved' && (
                            <CheckCircle className="w-4 h-4 text-success-500" />
                          )}
                          {approval.status === 'pending' && (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <Card padding="lg">
            <CardHeader title="Recent Gate Activity" />
            <div className="mt-4 space-y-3">
              {[
                { action: 'approved', gate: 'Production Approval', app: 'API Gateway v2.14.3', user: 'Alex Rivera', time: '10:28 AM' },
                { action: 'passed', gate: 'Staging Auto-Deploy', app: 'Payment Service v3.8.1', user: 'System', time: '11:00 AM' },
                { action: 'requested', gate: 'Production Approval', app: 'User Dashboard v4.2.0', user: 'Taylor Kim', time: '9:00 AM' },
                { action: 'approved', gate: 'Tier-1 Services', app: 'Auth Service v5.1.2', user: 'Sarah Chen', time: 'Yesterday' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                  {item.action === 'approved' && <CheckCircle className="w-5 h-5 text-success-500" />}
                  {item.action === 'passed' && <ShieldCheck className="w-5 h-5 text-success-500" />}
                  {item.action === 'requested' && <Clock className="w-5 h-5 text-warning-500" />}
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{item.app}</span> {item.action} at{' '}
                      <span className="font-medium">{item.gate}</span>
                    </p>
                    <p className="text-xs text-slate-500">by {item.user}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </TabPanel>
    </div>
  );
}
