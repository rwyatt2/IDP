import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { applications } from '@/data/mock-data';
import { Card, SearchInput, Badge, Tabs, TabPanel, Button } from '@/components/ui';
import {
  FileText,
  Code,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Lock,
  Globe,
  Server,
  Play,
  BookOpen,
} from 'lucide-react';
import type { Endpoint } from '@/types';

interface ApiEndpoint extends Endpoint {
  id: string;
  serviceName: string;
  serviceId: string;
}

const methodColors: Record<string, string> = {
  GET: 'bg-success-subtle text-success-text',
  POST: 'bg-info-subtle text-info-text',
  PUT: 'bg-warning-subtle text-warning-text',
  DELETE: 'bg-error-subtle text-error-text',
  PATCH: 'bg-accent-subtle text-accent-text',
};

function EndpointCard({ endpoint, expanded, onToggle }: { 
  endpoint: ApiEndpoint; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlExample = `curl -X ${endpoint.method} \\
  'https://api.company.com${endpoint.path}' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -H 'Content-Type: application/json'`;

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-raised transition-colors"
      >
        <Badge className={cn('font-mono text-xs', methodColors[endpoint.method])}>
          {endpoint.method}
        </Badge>
        <code className="flex-1 font-mono text-sm text-text-secondary">{endpoint.path}</code>
        <div className="flex items-center gap-2">
          {endpoint.authenticated && (
            <Lock className="w-4 h-4 text-text-tertiary" />
          )}
          {endpoint.rateLimit && (
            <Badge variant="neutral" size="sm">
              {endpoint.rateLimit}/min
            </Badge>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          ) : (
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="border-t border-border-default p-4 bg-surface-raised space-y-4">
          {/* Description */}
          {endpoint.description && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-1">Description</h4>
              <p className="text-sm text-text-tertiary">{endpoint.description}</p>
            </div>
          )}

          {/* Service */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Service</h4>
            <p className="text-sm text-text-tertiary">{endpoint.serviceName}</p>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Authentication</h4>
            <p className="text-sm text-text-tertiary">
              {endpoint.authenticated ? 'Required - Bearer Token' : 'Not required'}
            </p>
          </div>

          {/* Example */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-text-secondary">Example Request</h4>
              <button
                onClick={() => handleCopy(curlExample)}
                className="text-xs text-text-tertiary hover:text-text-secondary flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-surface text-text-primary p-3 rounded-lg text-xs overflow-x-auto">
              {curlExample}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="sm" leftIcon={<Play className="w-4 h-4" />}>
              Try it
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
              Full docs
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function ApiDocs() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const allEndpoints = useMemo(() => {
    const endpoints: ApiEndpoint[] = [];
    applications.forEach((app) => {
      app.endpoints?.forEach((endpoint, index) => {
        endpoints.push({
          ...endpoint,
          id: `${app.id}-${index}`,
          serviceName: app.displayName,
          serviceId: app.id,
        });
      });
    });
    return endpoints;
  }, []);

  const filteredEndpoints = useMemo(() => {
    let result = allEndpoints;
    
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.path.toLowerCase().includes(lower) ||
          e.serviceName.toLowerCase().includes(lower) ||
          e.description?.toLowerCase().includes(lower)
      );
    }
    
    if (methodFilter !== 'all') {
      result = result.filter((e) => e.method === methodFilter);
    }
    
    return result;
  }, [allEndpoints, search, methodFilter]);

  const services = useMemo(() => {
    const svcMap = new Map<string, { id: string; name: string; count: number }>();
    allEndpoints.forEach((e) => {
      const existing = svcMap.get(e.serviceId);
      if (existing) {
        existing.count++;
      } else {
        svcMap.set(e.serviceId, { id: e.serviceId, name: e.serviceName, count: 1 });
      }
    });
    return Array.from(svcMap.values());
  }, [allEndpoints]);

  const tabs = [
    { id: 'all', label: 'All Endpoints', count: allEndpoints.length },
    ...services.slice(0, 4).map((s) => ({
      id: s.id,
      label: s.name,
      count: s.count,
    })),
  ];

  const displayEndpoints = activeTab === 'all'
    ? filteredEndpoints
    : filteredEndpoints.filter((e) => e.serviceId === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">API Documentation</h1>
          <p className="text-text-tertiary mt-1">
            Explore and interact with service APIs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />}>
            Guides
          </Button>
          <Button variant="primary" leftIcon={<Code className="w-4 h-4" />}>
            Generate SDK
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-overlay flex items-center justify-center">
              <FileText className="w-5 h-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{allEndpoints.length}</p>
              <p className="text-sm text-text-tertiary">Total Endpoints</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Server className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{services.length}</p>
              <p className="text-sm text-text-tertiary">Services</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-subtle flex items-center justify-center">
              <Globe className="w-5 h-5 text-success-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {allEndpoints.filter((e) => !e.authenticated).length}
              </p>
              <p className="text-sm text-text-tertiary">Public</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-subtle flex items-center justify-center">
              <Lock className="w-5 h-5 text-info-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {allEndpoints.filter((e) => e.authenticated).length}
              </p>
              <p className="text-sm text-text-tertiary">Protected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search endpoints..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'GET', 'POST', 'PUT', 'DELETE'].map((method) => (
            <Button
              key={method}
              variant={methodFilter === method ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethodFilter(method)}
              className={method !== 'all' ? 'font-mono' : ''}
            >
              {method === 'all' ? 'All Methods' : method}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Endpoints */}
      <TabPanel>
        {displayEndpoints.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="w-12 h-12 text-text-disabled mx-auto mb-4" />
            <p className="font-medium text-text-primary">No endpoints found</p>
            <p className="text-sm text-text-tertiary mt-1">
              Try adjusting your search or filters
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {displayEndpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                expanded={expandedEndpoint === endpoint.id}
                onToggle={() => setExpandedEndpoint(
                  expandedEndpoint === endpoint.id ? null : endpoint.id
                )}
              />
            ))}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
