import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui';
import { Construction } from 'lucide-react';

const routeLabels: Record<string, string> = {
  discover: 'Discover',
  build: 'Build',
  deploy: 'Deploy',
  manage: 'Manage',
  catalog: 'System Catalog',
  search: 'Search',
  dependencies: 'Dependencies',
  docs: 'API Documentation',
  create: 'Create Application',
  configure: 'Configure Services',
  pipelines: 'Pipelines',
  infrastructure: 'Infrastructure',
  releases: 'Releases',
  deployments: 'Deployments',
  history: 'Deployment History',
  environments: 'Environments',
  gates: 'Change Gates',
  observability: 'Observability',
  costs: 'Costs',
  incidents: 'Incidents',
  analytics: 'Analytics',
  settings: 'Settings',
  profile: 'Profile',
  help: 'Help',
};

export function PlaceholderPage() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Page';
  const title = routeLabels[lastSegment] || lastSegment;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-text-tertiary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary mb-4">
          This page is under construction. Check back soon for updates.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised text-sm text-text-tertiary">
          <span className="font-mono">{location.pathname}</span>
        </div>
      </Card>
    </div>
  );
}
