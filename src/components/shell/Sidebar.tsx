import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNavigationStore, useExtensionStore } from '@/stores';
import {
  Search,
  Database,
  Network,
  FileText,
  Plus,
  Settings,
  GitBranch,
  Server,
  Rocket,
  GitPullRequest,
  History,
  Globe,
  ShieldCheck,
  Activity,
  DollarSign,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Compass,
  Boxes,
  Wrench,
  Gauge,
  Home,
  Layers,
} from 'lucide-react';
import type { Phase } from '@/types';
import { useState, useId } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavSection {
  phase: Phase;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
  items: NavItem[];
  defaultPath: string;
}

const navigation: NavSection[] = [
  {
    phase: 'discover',
    label: 'Discover',
    icon: <Compass className="w-[18px] h-[18px]" aria-hidden="true" />,
    accentColor: 'text-info-text',
    defaultPath: '/discover/catalog',
    items: [
      { label: 'System Catalog', href: '/discover/catalog', icon: <Database className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Search', href: '/discover/search', icon: <Search className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Dependencies', href: '/discover/dependencies', icon: <Network className="w-4 h-4" aria-hidden="true" /> },
      { label: 'API Docs', href: '/discover/docs', icon: <FileText className="w-4 h-4" aria-hidden="true" /> },
    ],
  },
  {
    phase: 'build',
    label: 'Build',
    icon: <Wrench className="w-[18px] h-[18px]" aria-hidden="true" />,
    accentColor: 'text-success-text',
    defaultPath: '/build/create',
    items: [
      { label: 'Create App', href: '/build/create', icon: <Plus className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Configure', href: '/build/configure', icon: <Settings className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Pipelines', href: '/build/pipelines', icon: <GitBranch className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Infrastructure', href: '/build/infrastructure', icon: <Server className="w-4 h-4" aria-hidden="true" /> },
    ],
  },
  {
    phase: 'deploy',
    label: 'Deploy',
    icon: <Rocket className="w-[18px] h-[18px]" aria-hidden="true" />,
    accentColor: 'text-accent-text',
    defaultPath: '/deploy/deployments',
    items: [
      { label: 'Releases', href: '/deploy/releases', icon: <GitPullRequest className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Deployments', href: '/deploy/deployments', icon: <Rocket className="w-4 h-4" aria-hidden="true" />, badge: 2 },
      { label: 'History', href: '/deploy/history', icon: <History className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Environments', href: '/deploy/environments', icon: <Globe className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Change Gates', href: '/deploy/gates', icon: <ShieldCheck className="w-4 h-4" aria-hidden="true" /> },
    ],
  },
  {
    phase: 'manage',
    label: 'Manage',
    icon: <Gauge className="w-[18px] h-[18px]" aria-hidden="true" />,
    accentColor: 'text-warning-text',
    defaultPath: '/manage/observability',
    items: [
      { label: 'Observability', href: '/manage/observability', icon: <Activity className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Costs', href: '/manage/costs', icon: <DollarSign className="w-4 h-4" aria-hidden="true" /> },
      { label: 'Incidents', href: '/manage/incidents', icon: <AlertTriangle className="w-4 h-4" aria-hidden="true" />, badge: 1 },
      { label: 'Analytics', href: '/manage/analytics', icon: <BarChart3 className="w-4 h-4" aria-hidden="true" /> },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useNavigationStore();
  const { favoriteIds, extensions } = useExtensionStore();
  const baseId = useId();

  const [expandedSections, setExpandedSections] = useState<Set<Phase>>(
    new Set(['discover', 'build', 'deploy', 'manage'])
  );

  const favoriteExtensions = extensions.filter((e) => favoriteIds.includes(e.id));
  const pathParts = location.pathname.split('/');
  const activePhase = pathParts[1] as Phase;

  const toggleSection = (phase: Phase) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  };

  const handlePhaseClick = (section: NavSection) => {
    if (sidebarCollapsed) {
      navigate(section.defaultPath);
    } else {
      toggleSection(section.phase);
    }
  };

  return (
    <aside
      className={cn(
        'h-full sidebar relative z-10',
        'transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-60'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-border-subtle">
        {!sidebarCollapsed && (
          <NavLink to="/" className="flex items-center gap-2.5 group focus-visible-ring rounded-lg">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Layers className="w-4 h-4 text-text-on-emphasis" aria-hidden="true" />
            </div>
            <span className="font-semibold text-sm text-text-primary tracking-tight">DevPortal</span>
          </NavLink>
        )}
        {sidebarCollapsed && (
          <NavLink 
            to="/" 
            className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center mx-auto focus-visible-ring"
            aria-label="DevPortal home"
          >
            <Layers className="w-4 h-4 text-text-on-emphasis" aria-hidden="true" />
          </NavLink>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-interactive-hover transition-colors focus-visible-ring',
            sidebarCollapsed && 'hidden'
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Dashboard Link */}
      <div className="px-2 pt-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'sidebar-item group focus-visible-ring',
              isActive && location.pathname === '/' && 'sidebar-item-active'
            )
          }
        >
          <Home className="w-[18px] h-[18px]" aria-hidden="true" />
          {!sidebarCollapsed && <span className="text-sm">Dashboard</span>}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 no-scrollbar" aria-label="Primary navigation">
        {navigation.map((section) => {
          const isExpanded = expandedSections.has(section.phase);
          const isSectionActive = activePhase === section.phase;
          const menuId = `${baseId}-${section.phase}-menu`;

          return (
            <div key={section.phase} className="mb-0.5">
              {/* Phase Header */}
              <button
                onClick={() => handlePhaseClick(section)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-2 rounded-lg group focus-visible-ring',
                  'transition-all duration-150',
                  isSectionActive
                    ? 'bg-interactive-hover text-text-secondary'
                    : 'text-text-tertiary hover:bg-interactive-hover hover:text-text-secondary'
                )}
                aria-expanded={!sidebarCollapsed ? isExpanded : undefined}
                aria-controls={!sidebarCollapsed ? menuId : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isSectionActive ? section.accentColor : ''}>{section.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">{section.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-text-disabled transition-transform duration-150',
                      isExpanded ? 'rotate-0' : '-rotate-90'
                    )}
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Phase Items */}
              {!sidebarCollapsed && isExpanded && (
                <ul 
                  id={menuId}
                  className="mt-0.5 ml-4 pl-2.5 border-l border-border-subtle space-y-0.5"
                  role="list"
                >
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm group focus-visible-ring',
                            'transition-all duration-150',
                            isActive
                              ? 'text-text-primary bg-interactive-hover'
                              : 'text-text-tertiary hover:bg-interactive-hover hover:text-text-secondary'
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span 
                            className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold text-text-on-emphasis bg-accent flex items-center justify-center"
                            aria-label={`${item.badge} items`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}

              {/* Collapsed hover menu */}
              {sidebarCollapsed && (
                <div className="relative group">
                  <div 
                    className="absolute left-full top-0 ml-2 w-44 rounded-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50 glass-panel-strong"
                    role="menu"
                    aria-label={`${section.label} submenu`}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
                      {section.label}
                    </div>
                    {section.items.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 px-3 py-2 text-sm transition-colors focus-visible-ring',
                            isActive
                              ? 'text-text-primary bg-interactive-hover'
                              : 'text-text-tertiary hover:bg-interactive-hover hover:text-text-secondary'
                          )
                        }
                        role="menuitem"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-text-on-emphasis text-[10px] font-semibold flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Extensions Link */}
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <NavLink
            to="/extensions"
            className={({ isActive }) =>
              cn(
                'sidebar-item focus-visible-ring',
                isActive && 'sidebar-item-active'
              )
            }
          >
            <Boxes className="w-[18px] h-[18px]" aria-hidden="true" />
            {!sidebarCollapsed && <span className="text-sm">Extensions</span>}
          </NavLink>
        </div>

        {/* Favorites */}
        {!sidebarCollapsed && favoriteExtensions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <div className="px-2.5 mb-2">
              <span className="text-[10px] font-medium text-text-disabled uppercase tracking-wider">
                Favorites
              </span>
            </div>
            <ul className="space-y-0.5" role="list">
              {favoriteExtensions.slice(0, 4).map((ext) => (
                <li key={ext.id}>
                  <NavLink
                    to={`/extensions/${ext.id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors focus-visible-ring',
                        isActive
                          ? 'text-warning-text bg-warning-subtle'
                          : 'text-text-tertiary hover:bg-interactive-hover hover:text-text-secondary'
                      )
                    }
                  >
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" aria-hidden="true" />
                    <span className="truncate">{ext.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border-subtle p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'sidebar-item focus-visible-ring',
              isActive && 'sidebar-item-active'
            )
          }
        >
          <Settings className="w-[18px] h-[18px]" aria-hidden="true" />
          {!sidebarCollapsed && <span className="text-sm">Settings</span>}
        </NavLink>

        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 mt-1 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-interactive-hover transition-colors focus-visible-ring"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
}
