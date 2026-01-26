import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useExtensionStore, useInteractionStore } from '@/stores';
import { Button, SearchInput, Badge, Card, Tabs, TabPanel, useToast } from '@/components/ui';
import {
  Star,
  Download,
  ChevronRight,
  Database,
  Rocket,
  Activity,
  Shield,
  DollarSign,
  GitBranch,
  Server,
  Users,
  Zap,
} from 'lucide-react';
import type { Extension, ExtensionCategory } from '@/types';

const categoryIcons: Record<ExtensionCategory, React.ReactNode> = {
  catalog: <Database className="w-5 h-5" />,
  deployment: <Rocket className="w-5 h-5" />,
  monitoring: <Activity className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  cost: <DollarSign className="w-5 h-5" />,
  infrastructure: <Server className="w-5 h-5" />,
  collaboration: <Users className="w-5 h-5" />,
  automation: <GitBranch className="w-5 h-5" />,
};

const categoryColors: Record<ExtensionCategory, string> = {
  catalog: 'bg-blue-500/20 text-blue-400',
  deployment: 'bg-purple-500/20 text-purple-400',
  monitoring: 'bg-green-500/20 text-green-400',
  security: 'bg-red-500/20 text-red-400',
  cost: 'bg-amber-500/20 text-amber-400',
  infrastructure: 'bg-cyan-500/20 text-cyan-400',
  collaboration: 'bg-pink-500/20 text-pink-400',
  automation: 'bg-orange-500/20 text-orange-400',
};

function ExtensionCard({ extension }: { extension: Extension }) {
  const navigate = useNavigate();
  const { installExtension, uninstallExtension, toggleFavorite, favoriteIds } = useExtensionStore();
  const { logAction } = useInteractionStore();
  const toast = useToast();
  
  const isFavorite = favoriteIds.includes(extension.id);

  const handleInstall = () => {
    installExtension(extension.id);
    logAction('Installed extension', extension.name);
    toast.success('Extension Installed', `${extension.name} has been installed successfully`);
  };

  const handleUninstall = () => {
    uninstallExtension(extension.id);
    logAction('Uninstalled extension', extension.name);
    toast.info('Extension Removed', `${extension.name} has been uninstalled`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(extension.id);
    if (!isFavorite) {
      toast.success('Added to Favorites', `${extension.name} added to your favorites`);
    }
  };

  return (
    <Card variant="hover" padding="none" className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              categoryColors[extension.category]
            )}
          >
            {categoryIcons[extension.category]}
          </div>
          <button
            onClick={handleToggleFavorite}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              isFavorite
                ? 'text-amber-400 bg-amber-500/20'
                : 'text-text-tertiary hover:text-amber-400 hover:bg-surface-raised'
            )}
          >
            <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
          </button>
        </div>
        
        <h3 className="font-semibold text-text-primary mb-1">{extension.name}</h3>
        <p className="text-sm text-text-tertiary line-clamp-2 mb-3">
          {extension.shortDescription}
        </p>
        
        <div className="flex items-center gap-3 text-sm text-text-tertiary mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{extension.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{extension.downloads.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {extension.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-border-subtle bg-surface-raised flex items-center justify-between">
        <span className="text-xs text-text-tertiary">by {extension.author}</span>
        {extension.installed ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUninstall}
              className="text-text-tertiary"
            >
              Uninstall
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/extensions/${extension.id}`)}
            >
              Open
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstall}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Install
          </Button>
        )}
      </div>
    </Card>
  );
}

export function Extensions() {
  const { extensions, getInstalledExtensions, getFeaturedExtensions } = useExtensionStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory | 'all'>('all');

  const tabs = [
    { id: 'all', label: 'All Extensions', count: extensions.length },
    { id: 'installed', label: 'Installed', count: getInstalledExtensions().length },
    { id: 'featured', label: 'Featured', count: getFeaturedExtensions().length },
  ];

  const categories = useMemo(() => {
    const cats = new Set(extensions.map((e) => e.category));
    return Array.from(cats) as ExtensionCategory[];
  }, [extensions]);

  const filteredExtensions = useMemo(() => {
    let result = extensions;

    // Filter by tab
    if (activeTab === 'installed') {
      result = result.filter((e) => e.installed);
    } else if (activeTab === 'featured') {
      result = result.filter((e) => e.featured);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Filter by search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower) ||
          e.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }

    return result;
  }, [extensions, activeTab, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Extension Marketplace</h1>
        <p className="text-text-tertiary mt-1">
          Discover and install extensions to enhance your developer platform
        </p>
      </div>

      {/* Featured Banner */}
      {activeTab === 'all' && (
        <Card className="bg-gradient-to-r from-accent/20 to-violet-600/20 border-accent/30">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <Badge variant="info" className="mb-3">
                Featured
              </Badge>
              <h2 className="text-xl font-semibold text-text-primary">Incident Commander</h2>
              <p className="text-text-secondary mt-2 max-w-lg">
                Complete incident management with automated runbooks, on-call scheduling, and post-mortem workflows.
              </p>
              <Button
                variant="primary"
                className="mt-5"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Zap className="w-12 h-12 text-accent" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search extensions..."
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              leftIcon={categoryIcons[cat]}
              className="whitespace-nowrap"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Extensions Grid */}
      <TabPanel>
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No extensions found</p>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExtensions.map((extension) => (
              <ExtensionCard key={extension.id} extension={extension} />
            ))}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
