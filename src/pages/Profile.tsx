import { useState } from 'react';
import { cn } from '@/lib/utils';
import { currentUser, applications, deployments, incidents } from '@/data/mock-data';
import { Card, CardHeader, Badge, Button, Avatar, Tabs, TabPanel } from '@/components/ui';
import {
  Mail,
  MapPin,
  Building,
  Shield,
  Key,
  Globe,
  Clock,
  Activity,
  GitCommit,
  Server,
  AlertTriangle,
  Edit,
  Camera,
  Github,
  Slack,
} from 'lucide-react';

export function Profile() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'teams', label: 'Teams & Roles' },
    { id: 'security', label: 'Security' },
  ];

  const userDeployments = deployments.filter((d) => d.triggeredBy === currentUser.name);
  const userApps = applications.filter((a) => a.team.name === currentUser.team);
  const userIncidents = incidents.filter((i) => i.assignee === currentUser.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="xl"
              className="w-24 h-24"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-text-on-emphasis flex items-center justify-center hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{currentUser.name}</h1>
            <p className="text-text-secondary">{currentUser.role}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>Platform Engineering</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="success">Active</Badge>
              {currentUser.permissions.includes('admin') && (
                <Badge variant="info">Admin</Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />}>
          Edit Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <GitCommit className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{userDeployments.length}</p>
              <p className="text-sm text-text-secondary">Deployments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-surface border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-subtle flex items-center justify-center">
              <Server className="w-5 h-5 text-info-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{userApps.length}</p>
              <p className="text-sm text-text-secondary">Services Owned</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-surface border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-subtle flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{userIncidents.length}</p>
              <p className="text-sm text-text-secondary">Incidents Handled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-surface border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">2.5h</p>
              <p className="text-sm text-text-secondary">On-Call Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Personal Information" />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-sm text-text-secondary">Full Name</span>
                  <span className="text-sm font-medium text-text-primary">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-sm text-text-secondary">Email</span>
                  <span className="text-sm font-medium text-text-primary">{currentUser.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-sm text-text-secondary">Role</span>
                  <span className="text-sm font-medium text-text-primary">{currentUser.role}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-sm text-text-secondary">Team</span>
                  <span className="text-sm font-medium text-text-primary">Platform Engineering</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border-subtle">
                  <span className="text-sm text-text-secondary">Location</span>
                  <span className="text-sm font-medium text-text-primary">San Francisco, CA</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">Timezone</span>
                  <span className="text-sm font-medium text-text-primary">America/Los_Angeles (PST)</span>
                </div>
              </div>
            </Card>

            {/* Connected Accounts */}
            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Connected Accounts" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
                    <Github className="w-5 h-5 text-text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">GitHub</p>
                    <p className="text-sm text-text-secondary">@sarah-chen</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="w-10 h-10 rounded-lg bg-info-subtle flex items-center justify-center">
                    <Slack className="w-5 h-5 text-info-text" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Slack</p>
                    <p className="text-sm text-text-secondary">@sarah.chen</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent-text" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Google</p>
                    <p className="text-sm text-text-secondary">sarah.chen@company.com</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg" className="lg:col-span-2 bg-surface border-border-subtle">
              <CardHeader title="Recent Activity" />
              <div className="mt-4 space-y-3">
                {userDeployments.slice(0, 5).map((deployment) => (
                  <div key={deployment.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-raised">
                    <GitCommit className="w-5 h-5 text-text-tertiary" />
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">
                        Deployed <span className="font-medium">{deployment.applicationName}</span> {deployment.version}
                      </p>
                      <p className="text-xs text-text-secondary">to {deployment.environment}</p>
                    </div>
                    <Badge variant={deployment.status === 'succeeded' ? 'success' : 'danger'} size="sm">
                      {deployment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <Card padding="lg" className="bg-surface border-border-subtle">
            <CardHeader title="Activity Timeline" />
            <div className="mt-4 space-y-4">
              {[
                { action: 'Deployed', target: 'API Gateway v2.14.3', time: '2 hours ago', type: 'deployment' },
                { action: 'Approved', target: 'Payment Service v3.8.1', time: '4 hours ago', type: 'approval' },
                { action: 'Resolved', target: 'INC-2024-089', time: 'Yesterday', type: 'incident' },
                { action: 'Created', target: 'New pipeline for User Dashboard', time: '2 days ago', type: 'pipeline' },
                { action: 'Updated', target: 'Auth Service configuration', time: '3 days ago', type: 'config' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    item.type === 'deployment' && 'bg-accent-subtle text-accent-text',
                    item.type === 'approval' && 'bg-success-subtle text-success-text',
                    item.type === 'incident' && 'bg-warning-subtle text-warning-text',
                    item.type === 'pipeline' && 'bg-info-subtle text-info-text',
                    item.type === 'config' && 'bg-surface-raised text-text-tertiary'
                  )}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-border-subtle last:border-0">
                    <p className="text-text-primary">
                      {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-sm text-text-secondary">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Teams" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent-subtle border border-accent-border">
                  <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
                    <Building className="w-5 h-5 text-accent-text" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Platform Engineering</p>
                    <p className="text-sm text-text-secondary">Primary team</p>
                  </div>
                  <Badge variant="info">Tech Lead</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
                    <Building className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">Security Guild</p>
                    <p className="text-sm text-text-secondary">Cross-functional team</p>
                  </div>
                  <Badge variant="neutral">Member</Badge>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Permissions" />
              <div className="mt-4 space-y-3">
                {currentUser.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-surface-raised">
                    <Shield className="w-5 h-5 text-success-text" />
                    <span className="font-medium text-text-primary capitalize">{permission}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Authentication" />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-text-tertiary" />
                    <div>
                      <p className="font-medium text-text-primary">Password</p>
                      <p className="text-sm text-text-secondary">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Change</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-success-text" />
                    <div>
                      <p className="font-medium text-text-primary">Two-Factor Authentication</p>
                      <p className="text-sm text-text-secondary">Enabled via authenticator app</p>
                    </div>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="bg-surface border-border-subtle">
              <CardHeader title="Active Sessions" />
              <div className="mt-4 space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'San Francisco, CA', current: true, lastActive: 'Now' },
                  { device: 'iPhone 15 Pro', location: 'San Francisco, CA', current: false, lastActive: '2 hours ago' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-text-tertiary" />
                      <div>
                        <p className="font-medium text-text-primary">
                          {session.device}
                          {session.current && <Badge variant="success" size="sm" className="ml-2">Current</Badge>}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {session.location} · {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-error-text hover:bg-error-subtle">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
