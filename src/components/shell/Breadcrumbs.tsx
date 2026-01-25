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
    <nav className="flex items-center gap-1 text-sm">
      <Link
        to="/"
        className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {breadcrumbs.map((crumb) => (
        <div key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />
          {crumb.isLast ? (
            <span className="px-1.5 py-0.5 font-medium text-zinc-200 text-sm">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="px-1.5 py-0.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors text-sm"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
