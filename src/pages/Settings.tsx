import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { Card, CardHeader, Badge, Button, Input, Select } from '@/components/ui';
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Globe,
  Shield,
  Key,
  Monitor,
  Moon,
  Sun,
  Eye,
  Save,
  Check,
} from 'lucide-react';

export function Settings() {
  const { user, updatePreferences } = useUserStore();
  const preferences = user?.preferences;
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={cn(
        'w-11 h-6 rounded-full transition-colors relative',
        enabled ? 'bg-primary-500' : 'bg-slate-200'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">
            Manage your preferences and account settings
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <>
              <Card padding="lg">
                <CardHeader title="Profile Settings" />
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">First Name</label>
                      <Input defaultValue="Sarah" />
                    </div>
                    <div>
                      <label className="label">Last Name</label>
                      <Input defaultValue="Chen" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <Input defaultValue="sarah.chen@company.com" />
                  </div>
                  <div>
                    <label className="label">Role</label>
                    <Input defaultValue="Tech Lead" disabled />
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader title="Localization" />
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="label">Language</label>
                    <Select
                      value="en"
                      onChange={() => {}}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' },
                        { value: 'ja', label: 'Japanese' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="label">Timezone</label>
                    <Select
                      value="America/Los_Angeles"
                      onChange={() => {}}
                      options={[
                        { value: 'America/Los_Angeles', label: 'Pacific Time (PST)' },
                        { value: 'America/New_York', label: 'Eastern Time (EST)' },
                        { value: 'Europe/London', label: 'GMT' },
                        { value: 'Europe/Paris', label: 'Central European Time (CET)' },
                        { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="label">Date Format</label>
                    <Select
                      value="mdy"
                      onChange={() => {}}
                      options={[
                        { value: 'mdy', label: 'MM/DD/YYYY' },
                        { value: 'dmy', label: 'DD/MM/YYYY' },
                        { value: 'ymd', label: 'YYYY-MM-DD' },
                      ]}
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <Card padding="lg">
                <CardHeader 
                  title="Email Notifications" 
                  description="Configure which notifications you receive via email"
                />
                <div className="mt-4 space-y-4">
                  {[
                    { key: 'deployments', label: 'Deployment updates', description: 'Get notified when deployments start, succeed, or fail', enabled: true },
                    { key: 'incidents', label: 'Incident alerts', description: 'Critical alerts when incidents are created or escalated', enabled: true },
                    { key: 'approvals', label: 'Approval requests', description: 'When someone requests your approval', enabled: true },
                    { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in comments', enabled: false },
                    { key: 'weekly', label: 'Weekly digest', description: 'Summary of activity across your services', enabled: true },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <ToggleSwitch enabled={item.enabled} onToggle={() => {}} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader 
                  title="Push Notifications" 
                  description="Mobile and browser notifications"
                />
                <div className="mt-4 space-y-4">
                  {[
                    { key: 'critical', label: 'Critical alerts only', description: 'Only receive push for critical incidents', enabled: true },
                    { key: 'oncall', label: 'On-call notifications', description: 'Page me when I\'m on-call', enabled: true },
                    { key: 'desktop', label: 'Desktop notifications', description: 'Show browser notifications', enabled: false },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <ToggleSwitch enabled={item.enabled} onToggle={() => {}} />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <Card padding="lg">
                <CardHeader title="Theme" />
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun className="w-6 h-6" /> },
                      { id: 'dark', label: 'Dark', icon: <Moon className="w-6 h-6" /> },
                      { id: 'system', label: 'System', icon: <Monitor className="w-6 h-6" /> },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updatePreferences({ theme: theme.id as 'light' | 'dark' | 'system' })}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-colors',
                          preferences?.theme === theme.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={cn(
                            'w-12 h-12 rounded-lg flex items-center justify-center',
                            preferences?.theme === theme.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                          )}>
                            {theme.icon}
                          </div>
                          <span className="font-medium text-slate-900">{theme.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader title="Display" />
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">Compact mode</p>
                      <p className="text-sm text-slate-500">Reduce spacing and padding</p>
                    </div>
                    <ToggleSwitch
                      enabled={false}
                      onToggle={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">Show breadcrumbs</p>
                      <p className="text-sm text-slate-500">Display navigation breadcrumbs</p>
                    </div>
                    <ToggleSwitch enabled={true} onToggle={() => {}} />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">Animations</p>
                      <p className="text-sm text-slate-500">Enable UI animations</p>
                    </div>
                    <ToggleSwitch enabled={true} onToggle={() => {}} />
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'security' && (
            <>
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
                    <Button variant="secondary" size="sm">Change Password</Button>
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
                <CardHeader 
                  title="API Keys" 
                  description="Manage API keys for programmatic access"
                  action={<Button variant="secondary" size="sm">Create Key</Button>}
                />
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'CI/CD Pipeline', lastUsed: '2 hours ago', created: 'Dec 15, 2025' },
                    { name: 'Local Development', lastUsed: 'Never', created: 'Jan 10, 2026' },
                  ].map((key) => (
                    <div key={key.name} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                      <div>
                        <p className="font-medium text-slate-900">{key.name}</p>
                        <p className="text-sm text-slate-500">
                          Last used: {key.lastUsed} · Created: {key.created}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger-600">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === 'integrations' && (
            <Card padding="lg">
              <CardHeader 
                title="Connected Services" 
                description="Manage third-party integrations"
              />
              <div className="mt-4 space-y-3">
                {[
                  { name: 'GitHub', icon: '🐙', connected: true, description: 'Source code management' },
                  { name: 'Slack', icon: '💬', connected: true, description: 'Team communication' },
                  { name: 'PagerDuty', icon: '🔔', connected: true, description: 'Incident management' },
                  { name: 'Datadog', icon: '📊', connected: false, description: 'Monitoring and analytics' },
                  { name: 'Jira', icon: '📋', connected: false, description: 'Issue tracking' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        {service.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{service.name}</p>
                        <p className="text-sm text-slate-500">{service.description}</p>
                      </div>
                    </div>
                    {service.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Connected</Badge>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm">Connect</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
