import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores';
import { Card, Badge, Button, Input, Select } from '@/components/ui';
import { useToast } from '@/components/ui';
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
  EyeOff,
  Save,
  Check,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
}

export function Settings() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get settings from store
  const {
    firstName,
    lastName,
    email,
    role,
    localization,
    notifications,
    appearance,
    security,
    updateProfile,
    updateLocalization,
    updateNotification,
    updateAppearance,
    updateSecurity,
  } = useSettingsStore();

  // Local state for profile fields (to batch updates)
  const [profileForm, setProfileForm] = useState({
    firstName,
    lastName,
    email,
  });

  // Sync profile form when store changes
  useEffect(() => {
    setProfileForm({ firstName, lastName, email });
  }, [firstName, lastName, email]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', name: 'CI/CD Pipeline', key: 'idp_sk_live_***************8x4k', lastUsed: '2 hours ago', created: 'Dec 15, 2025' },
    { id: '2', name: 'Local Development', key: 'idp_sk_test_***************9m2p', lastUsed: 'Never', created: 'Jan 10, 2026' },
  ]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);

  // Integrations state
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: '1', name: 'GitHub', icon: '🐙', connected: true, description: 'Source code management' },
    { id: '2', name: 'Slack', icon: '💬', connected: true, description: 'Team communication' },
    { id: '3', name: 'PagerDuty', icon: '🔔', connected: true, description: 'Incident management' },
    { id: '4', name: 'Datadog', icon: '📊', connected: false, description: 'Monitoring and analytics' },
    { id: '5', name: 'Jira', icon: '📋', connected: false, description: 'Issue tracking' },
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe className="w-4 h-4" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Save profile changes
    updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
    });
    
    setSaving(false);
    setSaved(true);
    toast.success('Settings saved', 'Your preferences have been updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Name required', 'Please enter a name for the API key.');
      return;
    }
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `idp_sk_live_${Math.random().toString(36).substring(2, 15)}`,
      lastUsed: 'Never',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowNewKeyModal(false);
    toast.success('API Key created', `"${newKey.name}" has been created successfully.`);
  };

  const handleRevokeApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.info('API Key revoked', `"${key?.name}" has been revoked.`);
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Copied', 'API key copied to clipboard.');
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id ? { ...i, connected: !i.connected } : i
    ));
    const integration = integrations.find(i => i.id === id);
    if (integration?.connected) {
      toast.info('Disconnected', `${integration.name} has been disconnected.`);
    } else {
      toast.success('Connected', `${integration?.name} has been connected successfully.`);
    }
  };

  // Request desktop notification permission
  const handleDesktopNotificationToggle = async () => {
    if (!notifications.pushDesktop) {
      // Requesting to enable
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updateNotification('pushDesktop', true);
          toast.success('Enabled', 'Desktop notifications have been enabled.');
          // Show test notification
          new Notification('DevPortal', {
            body: 'Desktop notifications are now enabled!',
            icon: '/favicon.ico',
          });
        } else {
          toast.error('Permission denied', 'Please enable notifications in your browser settings.');
        }
      } else {
        toast.error('Not supported', 'Your browser does not support desktop notifications.');
      }
    } else {
      updateNotification('pushDesktop', false);
      toast.info('Disabled', 'Desktop notifications have been disabled.');
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled = false }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'w-11 h-6 rounded-full transition-colors relative',
        enabled ? 'bg-accent' : 'bg-surface-raised',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-pressed={enabled}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full shadow-sm absolute top-0.5 transition-transform',
          enabled ? 'translate-x-5 bg-white' : 'translate-x-0.5 bg-text-tertiary'
        )}
      />
    </button>
  );

  const SettingRow = ({ 
    label, 
    description, 
    enabled, 
    onToggle,
    disabled = false 
  }: { 
    label: string; 
    description: string; 
    enabled: boolean; 
    onToggle: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0">
      <div>
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-tertiary mt-0.5">{description}</p>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} disabled={disabled} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-tertiary mt-1">
            Manage your preferences and account settings
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
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
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-tertiary hover:bg-surface-raised hover:text-text-secondary'
                )}
              >
                {tab.icon}
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <>
              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Profile Settings</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">First Name</label>
                      <Input 
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Last Name</label>
                      <Input 
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                    <Input 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Role</label>
                    <Input value={role} disabled className="opacity-60" />
                    <p className="text-xs text-text-disabled mt-1">Contact your admin to change your role</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Localization</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Language</label>
                    <Select
                      value={localization.language}
                      onChange={(value) => updateLocalization({ language: value })}
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
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Timezone</label>
                    <Select
                      value={localization.timezone}
                      onChange={(value) => updateLocalization({ timezone: value })}
                      options={[
                        { value: 'America/Los_Angeles', label: 'Pacific Time (PST)' },
                        { value: 'America/New_York', label: 'Eastern Time (EST)' },
                        { value: 'America/Chicago', label: 'Central Time (CST)' },
                        { value: 'America/Denver', label: 'Mountain Time (MST)' },
                        { value: 'Europe/London', label: 'GMT' },
                        { value: 'Europe/Paris', label: 'Central European Time (CET)' },
                        { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
                        { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
                        { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Date Format</label>
                    <Select
                      value={localization.dateFormat}
                      onChange={(value) => updateLocalization({ dateFormat: value as 'mdy' | 'dmy' | 'ymd' })}
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
              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Email Notifications</h3>
                  <p className="text-sm text-text-tertiary mt-1">Configure which notifications you receive via email</p>
                </div>
                <div className="px-5">
                  <SettingRow
                    label="Deployment updates"
                    description="Get notified when deployments start, succeed, or fail"
                    enabled={notifications.emailDeployments}
                    onToggle={() => updateNotification('emailDeployments', !notifications.emailDeployments)}
                  />
                  <SettingRow
                    label="Incident alerts"
                    description="Critical alerts when incidents are created or escalated"
                    enabled={notifications.emailIncidents}
                    onToggle={() => updateNotification('emailIncidents', !notifications.emailIncidents)}
                  />
                  <SettingRow
                    label="Approval requests"
                    description="When someone requests your approval"
                    enabled={notifications.emailApprovals}
                    onToggle={() => updateNotification('emailApprovals', !notifications.emailApprovals)}
                  />
                  <SettingRow
                    label="Mentions"
                    description="When someone mentions you in comments"
                    enabled={notifications.emailMentions}
                    onToggle={() => updateNotification('emailMentions', !notifications.emailMentions)}
                  />
                  <SettingRow
                    label="Weekly digest"
                    description="Summary of activity across your services"
                    enabled={notifications.emailWeeklyDigest}
                    onToggle={() => updateNotification('emailWeeklyDigest', !notifications.emailWeeklyDigest)}
                  />
                </div>
              </Card>

              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Push Notifications</h3>
                  <p className="text-sm text-text-tertiary mt-1">Mobile and browser notifications</p>
                </div>
                <div className="px-5">
                  <SettingRow
                    label="Critical alerts only"
                    description="Only receive push for critical incidents"
                    enabled={notifications.pushCriticalOnly}
                    onToggle={() => updateNotification('pushCriticalOnly', !notifications.pushCriticalOnly)}
                  />
                  <SettingRow
                    label="On-call notifications"
                    description="Page me when I'm on-call"
                    enabled={notifications.pushOnCall}
                    onToggle={() => updateNotification('pushOnCall', !notifications.pushOnCall)}
                  />
                  <SettingRow
                    label="Desktop notifications"
                    description="Show browser notifications"
                    enabled={notifications.pushDesktop}
                    onToggle={handleDesktopNotificationToggle}
                  />
                </div>
              </Card>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Theme</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun className="w-6 h-6" /> },
                      { id: 'dark', label: 'Dark', icon: <Moon className="w-6 h-6" /> },
                      { id: 'system', label: 'System', icon: <Monitor className="w-6 h-6" /> },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateAppearance('theme', theme.id as 'light' | 'dark' | 'system')}
                        className={cn(
                          'p-6 rounded-xl border-2 transition-all duration-200',
                          appearance.theme === theme.id
                            ? 'border-accent bg-accent/10'
                            : 'border-border-subtle hover:border-border-default bg-surface-raised'
                        )}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={cn(
                            'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                            appearance.theme === theme.id ? 'bg-accent/20 text-accent' : 'bg-surface text-text-tertiary'
                          )}>
                            {theme.icon}
                          </div>
                          <span className={cn(
                            'font-medium',
                            appearance.theme === theme.id ? 'text-text-primary' : 'text-text-secondary'
                          )}>{theme.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Display</h3>
                </div>
                <div className="px-5">
                  <SettingRow
                    label="Compact mode"
                    description="Reduce spacing and padding"
                    enabled={appearance.compactMode}
                    onToggle={() => updateAppearance('compactMode', !appearance.compactMode)}
                  />
                  <SettingRow
                    label="Show breadcrumbs"
                    description="Display navigation breadcrumbs"
                    enabled={appearance.showBreadcrumbs}
                    onToggle={() => updateAppearance('showBreadcrumbs', !appearance.showBreadcrumbs)}
                  />
                  <SettingRow
                    label="Animations"
                    description="Enable UI animations"
                    enabled={appearance.animations}
                    onToggle={() => updateAppearance('animations', !appearance.animations)}
                  />
                </div>
              </Card>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle">
                  <h3 className="font-semibold text-text-primary">Authentication</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                        <Key className="w-5 h-5 text-text-tertiary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">Password</p>
                        <p className="text-sm text-text-tertiary">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        security.twoFactorEnabled ? 'bg-success/20' : 'bg-warning/20'
                      )}>
                        <Shield className={cn('w-5 h-5', security.twoFactorEnabled ? 'text-success' : 'text-warning')} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">Two-Factor Authentication</p>
                        <p className="text-sm text-text-tertiary">
                          {security.twoFactorEnabled ? 'Enabled via authenticator app' : 'Not enabled'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={security.twoFactorEnabled ? 'success' : 'warning'}>
                        {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          updateSecurity('twoFactorEnabled', !security.twoFactorEnabled);
                          toast.success(
                            security.twoFactorEnabled ? 'Disabled' : 'Enabled',
                            security.twoFactorEnabled 
                              ? 'Two-factor authentication has been disabled.'
                              : 'Two-factor authentication has been enabled.'
                          );
                        }}
                      >
                        {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-surface border-border-subtle">
                <div className="p-5 border-b border-border-subtle flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">API Keys</h3>
                    <p className="text-sm text-text-tertiary mt-1">Manage API keys for programmatic access</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowNewKeyModal(true)}
                  >
                    Create Key
                  </Button>
                </div>
                <div className="p-5 space-y-3">
                  {showNewKeyModal && (
                    <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 mb-4">
                      <h4 className="font-medium text-text-primary mb-3">Create New API Key</h4>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Enter key name..."
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="primary" size="sm" onClick={handleCreateApiKey}>
                          Create
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setShowNewKeyModal(false); setNewKeyName(''); }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-8 text-text-tertiary">
                      No API keys yet. Create one to get started.
                    </div>
                  ) : (
                    apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary">{key.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs text-text-tertiary font-mono bg-surface px-2 py-0.5 rounded">
                              {showKeyId === key.id ? key.key : key.key.replace(/(.{10}).*(.{4})/, '$1***************$2')}
                            </code>
                            <button
                              onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                              className="text-text-disabled hover:text-text-tertiary transition-colors"
                            >
                              {showKeyId === key.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopyApiKey(key.key)}
                              className="text-text-disabled hover:text-text-tertiary transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-text-disabled mt-1">
                            Last used: {key.lastUsed} · Created: {key.created}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-error hover:bg-error/10"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleRevokeApiKey(key.id)}
                        >
                          Revoke
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </>
          )}

          {activeTab === 'integrations' && (
            <Card className="bg-surface border-border-subtle">
              <div className="p-5 border-b border-border-subtle">
                <h3 className="font-semibold text-text-primary">Connected Services</h3>
                <p className="text-sm text-text-tertiary mt-1">Manage third-party integrations</p>
              </div>
              <div className="p-5 space-y-3">
                {integrations.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-raised">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-xl">
                        {service.icon}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{service.name}</p>
                        <p className="text-sm text-text-tertiary">{service.description}</p>
                      </div>
                    </div>
                    {service.connected ? (
                      <div className="flex items-center gap-3">
                        <Badge variant="success">Connected</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                          Configure
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-error hover:bg-error/10"
                          onClick={() => handleToggleIntegration(service.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleToggleIntegration(service.id)}
                      >
                        Connect
                      </Button>
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
