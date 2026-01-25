import { useState, useRef, useEffect, useMemo } from 'react';
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

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        icon: <Home className="w-4 h-4" />,
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
        icon: <Search className="w-4 h-4" />,
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
        icon: <Plus className="w-4 h-4" />,
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
        icon: <Database className="w-4 h-4" />,
        action: () => navigate('/discover/catalog'),
        category: 'Navigation',
      },
      {
        id: 'deployments',
        label: 'View Deployments',
        icon: <Rocket className="w-4 h-4" />,
        action: () => navigate('/deploy/deployments'),
        category: 'Navigation',
      },
      {
        id: 'pipelines',
        label: 'Manage Pipelines',
        icon: <GitBranch className="w-4 h-4" />,
        action: () => navigate('/build/pipelines'),
        category: 'Navigation',
      },
      {
        id: 'observability',
        label: 'View Observability',
        icon: <Activity className="w-4 h-4" />,
        action: () => navigate('/manage/observability'),
        category: 'Navigation',
      },
      {
        id: 'incidents',
        label: 'View Incidents',
        icon: <AlertTriangle className="w-4 h-4" />,
        action: () => navigate('/manage/incidents'),
        category: 'Navigation',
      },
      {
        id: 'costs',
        label: 'View Costs',
        icon: <DollarSign className="w-4 h-4" />,
        action: () => navigate('/manage/costs'),
        category: 'Navigation',
      },
      {
        id: 'extensions',
        label: 'Browse Extensions',
        icon: <Store className="w-4 h-4" />,
        action: () => navigate('/extensions'),
        category: 'Navigation',
      },
      {
        id: 'environments',
        label: 'Manage Environments',
        icon: <Globe className="w-4 h-4" />,
        action: () => navigate('/deploy/environments'),
        category: 'Navigation',
      },
      {
        id: 'teams',
        label: 'View API Documentation',
        icon: <FileText className="w-4 h-4" />,
        action: () => navigate('/discover/docs'),
        category: 'Navigation',
      },
      {
        id: 'sync-catalog',
        label: 'Refresh Catalog',
        description: 'Sync the service catalog',
        icon: <RefreshCw className="w-4 h-4" />,
        action: () => {
          logAction('Refreshed', 'Service catalog');
          toast.success('Catalog Synced', 'Service catalog has been refreshed');
        },
        category: 'Actions',
      },
      {
        id: 'settings',
        label: 'Open Settings',
        icon: <Settings className="w-4 h-4" />,
        action: () => navigate('/settings'),
        category: 'Actions',
      },
      {
        id: 'help',
        label: 'Help & Documentation',
        icon: <HelpCircle className="w-4 h-4" />,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
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

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-xl overflow-hidden animate-slide-down glass-panel-strong border border-white/[0.08]">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Command className="w-5 h-5 text-accent-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 text-base text-zinc-100 placeholder:text-zinc-500 outline-none bg-transparent"
          />
        </div>

        {/* Commands */}
        <div className="max-h-[50vh] overflow-y-auto py-1.5">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2">
                  <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                {items.map((command) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleSelect(command)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-100',
                        selectedIndex === globalIndex
                          ? 'bg-accent-500/10'
                          : 'hover:bg-white/[0.04]'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                          selectedIndex === globalIndex
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-white/[0.04] text-zinc-500'
                        )}
                      >
                        {command.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium text-sm truncate',
                          selectedIndex === globalIndex ? 'text-zinc-100' : 'text-zinc-300'
                        )}>
                          {command.label}
                        </p>
                        {command.description && (
                          <p className="text-xs text-zinc-500 truncate">
                            {command.description}
                          </p>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors',
                          selectedIndex === globalIndex
                            ? 'bg-accent-500/20 text-accent-300 border border-accent-500/20'
                            : 'bg-white/[0.04] text-zinc-500 border border-white/[0.06]'
                        )}>
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
              Run
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
