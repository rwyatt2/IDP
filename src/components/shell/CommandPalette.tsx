import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useNavigationStore, useInteractionStore } from '@/stores';
import { useEscapeKey } from '@/hooks';
import { useToast } from '@/components/ui';
import {
  Command,
  Plus,
  Database,
  Rocket,
  Activity,
  DollarSign,
  Settings,
  HelpCircle,
  GitBranch,
  AlertTriangle,
  Home,
  Store,
  Search,
  FileText,
  Globe,
  RefreshCw,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const { commandPaletteOpen, closeCommandPalette, openSearch } = useNavigationStore();
  const { logAction } = useInteractionStore();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        icon: <Home className="w-4 h-4" aria-hidden="true" />,
        shortcut: '⌘1',
        action: () => {
          navigate('/');
          logAction('Navigated', 'Dashboard');
        },
        category: 'Navigation',
      },
      {
        id: 'search',
        label: 'Search Everything',
        description: 'Search applications, services, and docs',
        icon: <Search className="w-4 h-4" aria-hidden="true" />,
        shortcut: '/',
        action: () => {
          openSearch();
        },
        category: 'Actions',
      },
      {
        id: 'create-app',
        label: 'Create New Application',
        description: 'Start the application creation wizard',
        icon: <Plus className="w-4 h-4" aria-hidden="true" />,
        shortcut: '⌘⇧N',
        action: () => {
          navigate('/build/create');
          logAction('Started', 'Application creation');
          toast.info('Create Application', 'Starting the application wizard...');
        },
        category: 'Actions',
      },
      {
        id: 'catalog',
        label: 'Browse System Catalog',
        icon: <Database className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/discover/catalog'),
        category: 'Navigation',
      },
      {
        id: 'deployments',
        label: 'View Deployments',
        icon: <Rocket className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/deploy/deployments'),
        category: 'Navigation',
      },
      {
        id: 'pipelines',
        label: 'Manage Pipelines',
        icon: <GitBranch className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/build/pipelines'),
        category: 'Navigation',
      },
      {
        id: 'observability',
        label: 'View Observability',
        icon: <Activity className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/manage/observability'),
        category: 'Navigation',
      },
      {
        id: 'incidents',
        label: 'View Incidents',
        icon: <AlertTriangle className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/manage/incidents'),
        category: 'Navigation',
      },
      {
        id: 'costs',
        label: 'View Costs',
        icon: <DollarSign className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/manage/costs'),
        category: 'Navigation',
      },
      {
        id: 'extensions',
        label: 'Browse Extensions',
        icon: <Store className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/extensions'),
        category: 'Navigation',
      },
      {
        id: 'environments',
        label: 'Manage Environments',
        icon: <Globe className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/deploy/environments'),
        category: 'Navigation',
      },
      {
        id: 'teams',
        label: 'View API Documentation',
        icon: <FileText className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/discover/docs'),
        category: 'Navigation',
      },
      {
        id: 'sync-catalog',
        label: 'Refresh Catalog',
        description: 'Sync the service catalog',
        icon: <RefreshCw className="w-4 h-4" aria-hidden="true" />,
        action: () => {
          logAction('Refreshed', 'Service catalog');
          toast.success('Catalog Synced', 'Service catalog has been refreshed');
        },
        category: 'Actions',
      },
      {
        id: 'settings',
        label: 'Open Settings',
        icon: <Settings className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/settings'),
        category: 'Actions',
      },
      {
        id: 'help',
        label: 'Help & Documentation',
        icon: <HelpCircle className="w-4 h-4" aria-hidden="true" />,
        action: () => navigate('/help'),
        category: 'Actions',
      },
    ],
    [navigate, openSearch, logAction, toast]
  );

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  useEscapeKey(closeCommandPalette, commandPaletteOpen);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Focus trap
  useEffect(() => {
    if (!commandPaletteOpen) return;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [commandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelectedIndex(filteredCommands.length - 1);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex]);
    }
  };

  const handleSelect = (command: CommandItem) => {
    command.action();
    closeCommandPalette();
  };

  if (!commandPaletteOpen) return null;

  const statusMessage = filteredCommands.length > 0 
    ? `${filteredCommands.length} commands available` 
    : 'No commands found';

  return createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => e.target === e.currentTarget && closeCommandPalette()}
    >
      <div className="w-full max-w-lg rounded-xl overflow-hidden animate-slide-down bg-surface-overlay border border-border-default shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-surface-raised">
          <Command className="w-5 h-5 text-accent" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 text-base text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
            role="combobox"
            aria-expanded={filteredCommands.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={filteredCommands.length > 0 ? `${baseId}-option-${selectedIndex}` : undefined}
            aria-autocomplete="list"
            aria-label="Command search"
          />
        </div>

        {/* Live region for screen reader announcements */}
        <div id={statusId} className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </div>

        {/* Commands */}
        <div 
          id={listboxId}
          className="max-h-[50vh] overflow-y-auto py-1.5 bg-surface"
          role="listbox"
          aria-label="Commands"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary text-sm">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} role="group" aria-label={category}>
                <div className="px-4 py-2">
                  <span className="text-[10px] font-medium text-text-disabled uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                {items.map((command) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      id={`${baseId}-option-${globalIndex}`}
                      onClick={() => handleSelect(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-100',
                        selectedIndex === globalIndex
                          ? 'bg-accent/10'
                          : 'hover:bg-surface-raised'
                      )}
                      role="option"
                      aria-selected={selectedIndex === globalIndex}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          selectedIndex === globalIndex
                            ? 'bg-accent/20 text-accent'
                            : 'bg-surface-raised text-text-tertiary'
                        )}
                      >
                        {command.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium text-sm truncate',
                          selectedIndex === globalIndex ? 'text-text-primary' : 'text-text-secondary'
                        )}>
                          {command.label}
                        </p>
                        {command.description && (
                          <p className="text-xs text-text-tertiary truncate">
                            {command.description}
                          </p>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd 
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors',
                            selectedIndex === globalIndex
                              ? 'bg-accent/20 text-accent border border-accent/30'
                              : 'bg-surface-raised text-text-disabled border border-border-subtle'
                          )}
                          aria-hidden="true"
                        >
                          {command.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
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
              Run
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
