import { useParams, Link } from 'react-router-dom';
import { cn, formatRelativeTime } from '@/lib/utils';
import { extensions } from '@/data/mock-data';
import { useExtensionStore } from '@/stores';
import { Card, CardHeader, Badge, Button, Tabs, TabPanel } from '@/components/ui';
import {
  ArrowLeft,
  Star,
  Download,
  ExternalLink,
  Shield,
  GitBranch,
  FileText,
  MessageSquare,
  Heart,
} from 'lucide-react';
import { useState } from 'react';

export function ExtensionDetail() {
  const { id } = useParams();
  const extension = extensions.find((e) => e.id === id);
  const { installedIds, installExtension, uninstallExtension, favoriteIds, toggleFavorite } = useExtensionStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!extension) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Extension not found</p>
        <Link to="/extensions" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          Back to Extensions
        </Link>
      </div>
    );
  }

  const isInstalled = installedIds.includes(extension.id);
  const isFavorite = favoriteIds.includes(extension.id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'changelog', label: 'Changelog' },
    { id: 'permissions', label: 'Permissions' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/extensions"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Extensions
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center text-3xl">
            {extension.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{extension.name}</h1>
              <Badge variant="neutral">v{extension.version}</Badge>
              {extension.featured && (
                <Badge variant="success" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1">{extension.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <span>By {extension.author}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                <span>{extension.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{extension.downloads.toLocaleString()} downloads</span>
              </div>
              <span>Category: {extension.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(extension.id)}
            className={isFavorite ? 'text-danger-500' : ''}
          >
            <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
          </Button>
          {isInstalled ? (
            <Button
              variant="secondary"
              onClick={() => uninstallExtension(extension.id)}
            >
              Uninstall
            </Button>
          ) : (
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => installExtension(extension.id)}
            >
              Install
            </Button>
          )}
          {isInstalled && (
            <Button variant="primary" leftIcon={<ExternalLink className="w-4 h-4" />}>
              Open
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <TabPanel>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card padding="lg">
                  <h3 className="font-semibold text-slate-900 mb-4">About</h3>
                  <div className="prose prose-slate max-w-none">
                    <p>
                      {extension.name} is a powerful extension that enhances your developer experience 
                      by providing seamless integration with your existing workflows.
                    </p>
                    <h4>Key Features</h4>
                    <ul>
                      <li>Seamless integration with the developer platform</li>
                      <li>Real-time updates and notifications</li>
                      <li>Customizable dashboards and views</li>
                      <li>Role-based access controls</li>
                      <li>Comprehensive API and webhook support</li>
                    </ul>
                    <h4>Getting Started</h4>
                    <p>
                      Install the extension and navigate to your dashboard to see the new widgets 
                      and features available. Configure your preferences in the extension settings.
                    </p>
                  </div>
                </Card>

                {/* Screenshots */}
                <Card padding="lg">
                  <h3 className="font-semibold text-slate-900 mb-4">Screenshots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-slate-400">Screenshot {i}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'documentation' && (
              <Card padding="lg">
                <h3 className="font-semibold text-slate-900 mb-4">Documentation</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Getting Started', description: 'Learn how to set up and configure the extension' },
                    { title: 'Configuration Guide', description: 'Detailed configuration options and settings' },
                    { title: 'API Reference', description: 'Complete API documentation for advanced usage' },
                    { title: 'Troubleshooting', description: 'Common issues and how to resolve them' },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{doc.title}</p>
                        <p className="text-sm text-slate-500">{doc.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'changelog' && (
              <Card padding="lg">
                <h3 className="font-semibold text-slate-900 mb-4">Changelog</h3>
                <div className="space-y-6">
                  {[
                    { version: extension.version, date: '2026-01-20', changes: ['Fixed dashboard rendering issue', 'Improved performance for large datasets', 'Added new configuration options'] },
                    { version: '2.4.1', date: '2026-01-10', changes: ['Bug fixes and stability improvements', 'Updated dependencies'] },
                    { version: '2.4.0', date: '2025-12-15', changes: ['New widget types', 'Enhanced filtering capabilities', 'Dark mode support'] },
                  ].map((release) => (
                    <div key={release.version}>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="info">v{release.version}</Badge>
                        <span className="text-sm text-slate-500">{release.date}</span>
                      </div>
                      <ul className="space-y-1 text-slate-600 text-sm">
                        {release.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'permissions' && (
              <Card padding="lg">
                <h3 className="font-semibold text-slate-900 mb-4">Required Permissions</h3>
                <div className="space-y-3">
                  {[
                    { permission: 'Read Applications', description: 'Access to view application metadata', risk: 'low' },
                    { permission: 'Read Deployments', description: 'Access to view deployment history', risk: 'low' },
                    { permission: 'Read Metrics', description: 'Access to view performance metrics', risk: 'low' },
                    { permission: 'Read User Profile', description: 'Access to your basic profile information', risk: 'low' },
                  ].map((perm) => (
                    <div
                      key={perm.permission}
                      className="flex items-start gap-4 p-4 rounded-lg border border-slate-200"
                    >
                      <Shield className={cn(
                        'w-5 h-5 mt-0.5',
                        perm.risk === 'low' && 'text-success-500',
                        perm.risk === 'medium' && 'text-warning-500',
                        perm.risk === 'high' && 'text-danger-500'
                      )} />
                      <div>
                        <p className="font-medium text-slate-900">{perm.permission}</p>
                        <p className="text-sm text-slate-500">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Extension Info */}
          <Card padding="lg">
            <CardHeader title="Extension Info" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Version</span>
                <span className="text-sm font-medium text-slate-900">{extension.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Author</span>
                <span className="text-sm font-medium text-slate-900">{extension.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Category</span>
                <Badge variant="neutral">{extension.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Last Updated</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatRelativeTime(extension.lastUpdated)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= Math.round(extension.rating)
                          ? 'text-warning-500 fill-warning-500'
                          : 'text-slate-300'
                      )}
                    />
                  ))}
                  <span className="text-sm text-slate-500 ml-1">({extension.rating})</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Support */}
          <Card padding="lg">
            <CardHeader title="Support" />
            <div className="mt-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                Documentation
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Report Issue
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<GitBranch className="w-4 h-4" />}>
                View Source
              </Button>
            </div>
          </Card>

          {/* Related Extensions */}
          <Card padding="lg">
            <CardHeader title="Related Extensions" />
            <div className="mt-4 space-y-3">
              {extensions
                .filter((e) => e.id !== extension.id && e.category === extension.category)
                .slice(0, 3)
                .map((ext) => (
                  <Link
                    key={ext.id}
                    to={`/extensions/${ext.id}`}
                    className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-lg">
                      {ext.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{ext.name}</p>
                      <p className="text-sm text-slate-500">
                        <Star className="w-3 h-3 inline text-warning-500 fill-warning-500" /> {ext.rating}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
