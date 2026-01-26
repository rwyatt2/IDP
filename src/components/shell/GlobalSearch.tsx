import { useState, useRef, useEffect, useMemo, useId } from 'react';
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
  application: <Database className="w-4 h-4" aria-hidden="true" />,
  service: <Boxes className="w-4 h-4" aria-hidden="true" />,
  team: <Users className="w-4 h-4" aria-hidden="true" />,
  documentation: <FileText className="w-4 h-4" aria-hidden="true" />,
  deployment: <Rocket className="w-4 h-4" aria-hidden="true" />,
  extension: <Boxes className="w-4 h-4" aria-hidden="true" />,
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
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;

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
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelectedIndex(results.length - 1);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    closeSearch();
  };

  // Trap focus within modal
  useEffect(() => {
    if (!searchOpen) return;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // Simple focus trap - keep focus in the search input
      e.preventDefault();
      inputRef.current?.focus();
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [searchOpen]);

  if (!searchOpen) return null;

  const statusMessage = results.length > 0 
    ? `${results.length} results found` 
    : searchQuery.length >= 2 
      ? 'No results found' 
      : '';

  return createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => e.target === e.currentTarget && closeSearch()}
    >
      <div className="w-full max-w-2xl rounded-xl overflow-hidden animate-slide-down bg-surface-overlay border border-border-default shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-surface-raised">
          <Search className="w-5 h-5 text-text-tertiary" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search applications, services, docs..."
            className="flex-1 text-base text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={results.length > 0 ? `${baseId}-option-${selectedIndex}` : undefined}
            aria-autocomplete="list"
            aria-label="Search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded text-text-tertiary hover:text-text-secondary hover:bg-surface-raised transition-colors focus-visible-ring"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-[10px] font-medium text-text-tertiary" aria-hidden="true">
            ESC
          </kbd>
        </div>

        {/* Live region for screen reader announcements */}
        <div id={statusId} className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </div>

        {/* Results or Suggestions */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto bg-surface">
          {results.length > 0 ? (
            <div 
              id={listboxId}
              className="py-1.5"
              role="listbox"
              aria-label="Search results"
            >
              {results.map((result, index) => (
                <button
                  key={result.id}
                  id={`${baseId}-option-${index}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100',
                    selectedIndex === index
                      ? 'bg-accent/10'
                      : 'hover:bg-surface-raised'
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      selectedIndex === index
                        ? 'bg-accent/20'
                        : 'bg-surface-raised',
                      typeColors[result.type] || 'text-text-tertiary'
                    )}
                  >
                    {typeIcons[result.type] || <Database className="w-4 h-4" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium text-sm truncate',
                      selectedIndex === index ? 'text-text-primary' : 'text-text-secondary'
                    )}>
                      {result.title}
                    </p>
                    <p className="text-xs text-text-tertiary truncate">
                      {result.subtitle} · <span className="text-text-disabled">{result.type}</span>
                    </p>
                  </div>
                  <ArrowRight
                    className={cn(
                      'w-4 h-4 transition-all duration-100',
                      selectedIndex === index
                        ? 'opacity-100 text-accent translate-x-0'
                        : 'opacity-0 -translate-x-1'
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-8 text-center">
              <p className="text-text-secondary text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs text-text-disabled mt-1">
                Try different keywords or browse the catalog
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Clock className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
                  <span className="text-[10px] font-medium text-text-disabled uppercase tracking-wider">Recent</span>
                </div>
                <div className="space-y-0.5" role="list" aria-label="Recent searches">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="w-full px-3 py-2 text-left text-sm text-text-tertiary hover:text-text-primary hover:bg-surface-raised rounded-lg transition-colors focus-visible-ring"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
                  <span className="text-[10px] font-medium text-text-disabled uppercase tracking-wider">Popular</span>
                </div>
                <div className="space-y-0.5" role="list" aria-label="Popular searches">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchQuery(search)}
                      className="w-full px-3 py-2 text-left text-sm text-text-tertiary hover:text-text-primary hover:bg-surface-raised rounded-lg transition-colors focus-visible-ring"
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
        <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-raised">
          <div className="flex items-center gap-4 text-[10px] text-text-disabled" aria-hidden="true">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle font-medium text-text-tertiary">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle font-medium text-text-tertiary">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle font-medium text-text-tertiary">
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
