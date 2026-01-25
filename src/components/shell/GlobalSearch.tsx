import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/stores';
import { useEscapeKey } from '@/hooks';
import { generateSearchResults } from '@/data/mock-data';
import {
  Search,
  X,
  Database,
  Users,
  FileText,
  Rocket,
  Boxes,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import type { SearchResult } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  application: <Database className="w-4 h-4" />,
  service: <Boxes className="w-4 h-4" />,
  team: <Users className="w-4 h-4" />,
  documentation: <FileText className="w-4 h-4" />,
  deployment: <Rocket className="w-4 h-4" />,
  extension: <Boxes className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  application: 'text-blue-400',
  service: 'text-emerald-400',
  team: 'text-amber-400',
  documentation: 'text-violet-400',
  deployment: 'text-rose-400',
  extension: 'text-cyan-400',
};

const recentSearches = [
  'api gateway',
  'payment service',
  'authentication',
];

const popularSearches = [
  'Create new application',
  'View deployments',
  'System health',
];

export function GlobalSearch() {
  const navigate = useNavigate();
  const { searchOpen, closeSearch, searchQuery, setSearchQuery } = useNavigationStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return generateSearchResults(searchQuery);
  }, [searchQuery]);

  useEscapeKey(closeSearch, searchOpen);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    closeSearch();
  };

  if (!searchOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-xl overflow-hidden animate-slide-down glass-panel-strong border border-white/[0.08]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search applications, services, docs..."
            className="flex-1 text-base text-zinc-100 placeholder:text-zinc-500 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results or Suggestions */}
        <div className="max-h-[55vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-1.5">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100',
                    selectedIndex === index
                      ? 'bg-accent-500/10'
                      : 'hover:bg-white/[0.04]'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      selectedIndex === index
                        ? 'bg-accent-500/20'
                        : 'bg-white/[0.04]',
                      typeColors[result.type] || 'text-zinc-400'
                    )}
                  >
                    {typeIcons[result.type] || <Database className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium text-sm truncate',
                      selectedIndex === index ? 'text-zinc-100' : 'text-zinc-300'
                    )}>
                      {result.title}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {result.subtitle} · <span className="text-zinc-600">{result.type}</span>
                    </p>
                  </div>
                  <ArrowRight
                    className={cn(
                      'w-4 h-4 transition-all duration-100',
                      selectedIndex === index
                        ? 'opacity-100 text-accent-400 translate-x-0'
                        : 'opacity-0 -translate-x-1'
                    )}
                  />
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-400 text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs text-zinc-600 mt-1">
                Try different keywords or browse the catalog
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Recent</span>
                </div>
                <div className="space-y-0.5">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Popular</span>
                </div>
                <div className="space-y-0.5">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-4 text-[10px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-medium text-zinc-500">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-medium text-zinc-500">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-medium text-zinc-500">
                ESC
              </kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
