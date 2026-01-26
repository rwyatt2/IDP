import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { generateSearchResults, applications, teams } from '@/data/mock-data';
import { Card, SearchInput, Badge, StatusBadge, Tabs, TabPanel, AvatarGroup } from '@/components/ui';
import {
  Search,
  Database,
  Users,
  FileText,
  Rocket,
  Boxes,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
  Server,
  Globe,
  Code,
  Layers,
  GitBranch,
} from 'lucide-react';
import type { ApplicationType } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  application: <Database className="w-5 h-5" />,
  service: <Server className="w-5 h-5" />,
  team: <Users className="w-5 h-5" />,
  documentation: <FileText className="w-5 h-5" />,
  deployment: <Rocket className="w-5 h-5" />,
  extension: <Boxes className="w-5 h-5" />,
  resource: <Layers className="w-5 h-5" />,
};

const appTypeIcons: Record<ApplicationType, React.ReactNode> = {
  service: <Server className="w-4 h-4" />,
  frontend: <Globe className="w-4 h-4" />,
  backend: <Database className="w-4 h-4" />,
  library: <Code className="w-4 h-4" />,
  infrastructure: <Layers className="w-4 h-4" />,
  'data-pipeline': <GitBranch className="w-4 h-4" />,
};

const recentSearches = ['api gateway', 'payment service', 'authentication', 'notification'];
const popularSearches = ['kubernetes deployment', 'database migration', 'api documentation', 'incident runbook'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    return generateSearchResults(query);
  }, [query]);

  const filteredResults = results;

  const tabs = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    results.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return [
      { id: 'all', label: 'All Results', count: counts.all },
      { id: 'application', label: 'Applications', count: counts.application || 0 },
      { id: 'team', label: 'Teams', count: counts.team || 0 },
      { id: 'extension', label: 'Extensions', count: counts.extension || 0 },
    ].filter((t) => t.id === 'all' || t.count > 0);
  }, [results]);

  const displayResults = activeTab === 'all' 
    ? filteredResults 
    : filteredResults.filter((r) => r.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Search</h1>
        <p className="text-text-secondary mt-1">
          Find applications, services, documentation, and more
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search across all resources..."
          inputSize="lg"
        />
      </div>

      {query.length >= 2 ? (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {displayResults.length} result{displayResults.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>

          {/* Tabs */}
          {results.length > 0 && (
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          )}

          {/* Results */}
          <TabPanel>
            {displayResults.length === 0 ? (
              <Card className="text-center py-12">
                <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="font-medium text-text-primary">No results found</p>
                <p className="text-sm text-text-secondary mt-1">
                  Try different keywords or check your spelling
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {displayResults.map((result) => (
                  <Link
                    key={result.id}
                    to={result.url}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg border border-border-subtle hover:border-border-default hover:shadow-soft transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-surface-raised flex items-center justify-center text-text-tertiary flex-shrink-0">
                      {typeIcons[result.type] || <Database className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text-primary">{result.title}</h3>
                        <Badge variant="neutral" size="sm" className="capitalize">
                          {result.type}
                        </Badge>
                      </div>
                      {result.subtitle && (
                        <p className="text-sm text-text-secondary mt-0.5">{result.subtitle}</p>
                      )}
                      {result.description && (
                        <p className="text-sm text-text-tertiary mt-1 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </TabPanel>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-text-tertiary" />
              <h3 className="font-semibold text-text-primary">Recent Searches</h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors text-left"
                >
                  <Search className="w-4 h-4 text-text-tertiary" />
                  <span className="text-text-primary">{search}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Popular Searches */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-text-tertiary" />
              <h3 className="font-semibold text-text-primary">Popular Searches</h3>
            </div>
            <div className="space-y-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors text-left"
                >
                  <Star className="w-4 h-4 text-text-tertiary" />
                  <span className="text-text-primary">{search}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Access - Applications */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Popular Applications</h3>
              <Link to="/discover/catalog" className="text-sm text-accent-text hover:text-accent-text">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <Link
                  key={app.id}
                  to={`/discover/catalog/${app.id}`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-text-tertiary">
                    {appTypeIcons[app.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{app.displayName}</p>
                    <p className="text-sm text-text-secondary">{app.team.name}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Access - Teams */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Teams</h3>
              <Link to="/discover/teams" className="text-sm text-accent-text hover:text-accent-text">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/discover/teams/${team.id}`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-raised transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-accent-text">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{team.name}</p>
                    <p className="text-sm text-text-secondary">{team.members.length} members</p>
                  </div>
                  <AvatarGroup
                    avatars={team.members.slice(0, 3).map((m) => ({ name: m.name, src: m.avatar }))}
                    size="sm"
                  />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
