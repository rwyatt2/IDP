import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  discover: 'Discover',
  build: 'Build',
  deploy: 'Deploy',
  manage: 'Manage',
  catalog: 'System Catalog',
  search: 'Search',
  dependencies: 'Dependencies',
  docs: 'Documentation',
  create: 'Create Application',
  configure: 'Configure Services',
  pipelines: 'Pipelines',
  infrastructure: 'Infrastructure',
  releases: 'Releases',
  deployments: 'Deployments',
  history: 'History',
  environments: 'Environments',
  gates: 'Change Gates',
  observability: 'Observability',
  costs: 'Costs',
  incidents: 'Incidents',
  analytics: 'Analytics',
  extensions: 'Extensions',
  settings: 'Settings',
  profile: 'Profile',
  help: 'Help',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm" role="list">
        <li>
          <Link
            to="/"
            className="p-1 rounded text-text-tertiary hover:text-text-secondary hover:bg-interactive-hover transition-colors focus-visible-ring"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
            {crumb.isLast ? (
              <span 
                className="px-1.5 py-0.5 font-medium text-text-primary text-sm"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="px-1.5 py-0.5 rounded text-text-tertiary hover:text-text-secondary hover:bg-interactive-hover transition-colors text-sm focus-visible-ring"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
