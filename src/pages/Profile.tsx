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
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
            <p className="text-slate-500">{currentUser.role}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
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
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <GitCommit className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{userDeployments.length}</p>
              <p className="text-sm text-slate-500">Deployments</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{userApps.length}</p>
              <p className="text-sm text-slate-500">Services Owned</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{userIncidents.length}</p>
              <p className="text-sm text-slate-500">Incidents Handled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">2.5h</p>
              <p className="text-sm text-slate-500">On-Call Today</p>
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
            <Card padding="lg">
              <CardHeader title="Personal Information" />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Full Name</span>
                  <span className="text-sm font-medium text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="text-sm font-medium text-slate-900">{currentUser.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Role</span>
                  <span className="text-sm font-medium text-slate-900">{currentUser.role}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Team</span>
                  <span className="text-sm font-medium text-slate-900">Platform Engineering</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Location</span>
                  <span className="text-sm font-medium text-slate-900">San Francisco, CA</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">Timezone</span>
                  <span className="text-sm font-medium text-slate-900">America/Los_Angeles (PST)</span>
                </div>
              </div>
            </Card>

            {/* Connected Accounts */}
            <Card padding="lg">
              <CardHeader title="Connected Accounts" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">GitHub</p>
                    <p className="text-sm text-slate-500">@sarah-chen</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Slack className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Slack</p>
                    <p className="text-sm text-slate-500">@sarah.chen</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Google</p>
                    <p className="text-sm text-slate-500">sarah.chen@company.com</p>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg" className="lg:col-span-2">
              <CardHeader title="Recent Activity" />
              <div className="mt-4 space-y-3">
                {userDeployments.slice(0, 5).map((deployment) => (
                  <div key={deployment.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                    <GitCommit className="w-5 h-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        Deployed <span className="font-medium">{deployment.applicationName}</span> {deployment.version}
                      </p>
                      <p className="text-xs text-slate-500">to {deployment.environment}</p>
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
          <Card padding="lg">
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
                    item.type === 'deployment' && 'bg-primary-100 text-primary-600',
                    item.type === 'approval' && 'bg-success-100 text-success-600',
                    item.type === 'incident' && 'bg-warning-100 text-warning-600',
                    item.type === 'pipeline' && 'bg-purple-100 text-purple-600',
                    item.type === 'config' && 'bg-slate-100 text-slate-600'
                  )}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                    <p className="text-slate-900">
                      {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title="Teams" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary-50 border border-primary-200">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Platform Engineering</p>
                    <p className="text-sm text-slate-500">Primary team</p>
                  </div>
                  <Badge variant="info">Tech Lead</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Security Guild</p>
                    <p className="text-sm text-slate-500">Cross-functional team</p>
                  </div>
                  <Badge variant="neutral">Member</Badge>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Permissions" />
              <div className="mt-4 space-y-3">
                {currentUser.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                    <Shield className="w-5 h-5 text-success-500" />
                    <span className="font-medium text-slate-900 capitalize">{permission}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title="Authentication" />
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">Password</p>
                      <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Change</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-success-500" />
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Enabled via authenticator app</p>
                    </div>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Active Sessions" />
              <div className="mt-4 space-y-3">
                {[
                  { device: 'MacBook Pro', location: 'San Francisco, CA', current: true, lastActive: 'Now' },
                  { device: 'iPhone 15 Pro', location: 'San Francisco, CA', current: false, lastActive: '2 hours ago' },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {session.device}
                          {session.current && <Badge variant="success" size="sm" className="ml-2">Current</Badge>}
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.location} · {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-danger-600">
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
