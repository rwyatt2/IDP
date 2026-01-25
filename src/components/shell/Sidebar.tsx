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
import { useState } from 'react';

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
  glowColor: string;
  items: NavItem[];
  defaultPath: string;
}

const navigation: NavSection[] = [
  {
    phase: 'discover',
    label: 'Discover',
    icon: <Compass className="w-[18px] h-[18px]" />,
    accentColor: 'text-blue-400',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    defaultPath: '/discover/catalog',
    items: [
      { label: 'System Catalog', href: '/discover/catalog', icon: <Database className="w-4 h-4" /> },
      { label: 'Search', href: '/discover/search', icon: <Search className="w-4 h-4" /> },
      { label: 'Dependencies', href: '/discover/dependencies', icon: <Network className="w-4 h-4" /> },
      { label: 'API Docs', href: '/discover/docs', icon: <FileText className="w-4 h-4" /> },
    ],
  },
  {
    phase: 'build',
    label: 'Build',
    icon: <Wrench className="w-[18px] h-[18px]" />,
    accentColor: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    defaultPath: '/build/create',
    items: [
      { label: 'Create App', href: '/build/create', icon: <Plus className="w-4 h-4" /> },
      { label: 'Configure', href: '/build/configure', icon: <Settings className="w-4 h-4" /> },
      { label: 'Pipelines', href: '/build/pipelines', icon: <GitBranch className="w-4 h-4" /> },
      { label: 'Infrastructure', href: '/build/infrastructure', icon: <Server className="w-4 h-4" /> },
    ],
  },
  {
    phase: 'deploy',
    label: 'Deploy',
    icon: <Rocket className="w-[18px] h-[18px]" />,
    accentColor: 'text-violet-400',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    defaultPath: '/deploy/deployments',
    items: [
      { label: 'Releases', href: '/deploy/releases', icon: <GitPullRequest className="w-4 h-4" /> },
      { label: 'Deployments', href: '/deploy/deployments', icon: <Rocket className="w-4 h-4" />, badge: 2 },
      { label: 'History', href: '/deploy/history', icon: <History className="w-4 h-4" /> },
      { label: 'Environments', href: '/deploy/environments', icon: <Globe className="w-4 h-4" /> },
      { label: 'Change Gates', href: '/deploy/gates', icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  },
  {
    phase: 'manage',
    label: 'Manage',
    icon: <Gauge className="w-[18px] h-[18px]" />,
    accentColor: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    defaultPath: '/manage/observability',
    items: [
      { label: 'Observability', href: '/manage/observability', icon: <Activity className="w-4 h-4" /> },
      { label: 'Costs', href: '/manage/costs', icon: <DollarSign className="w-4 h-4" /> },
      { label: 'Incidents', href: '/manage/incidents', icon: <AlertTriangle className="w-4 h-4" />, badge: 1 },
      { label: 'Analytics', href: '/manage/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useNavigationStore();
  const { favoriteIds, extensions } = useExtensionStore();

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
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-white/[0.04]">
        {!sidebarCollapsed && (
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6b21a8 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 0 20px -5px rgba(124, 58, 237, 0.5)'
              }}
            >
              <Layers className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-luminous">DevPortal</span>
          </NavLink>
        )}
        {sidebarCollapsed && (
          <NavLink 
            to="/" 
            className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6b21a8 100%)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 0 20px -5px rgba(124, 58, 237, 0.5)'
            }}
          >
            <Layers className="w-4 h-4 text-white" />
          </NavLink>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all',
            sidebarCollapsed && 'hidden'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Dashboard Link */}
      <div className="px-2 pt-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'sidebar-item group',
              isActive && location.pathname === '/' && 'sidebar-item-active'
            )
          }
        >
          <Home className="w-[18px] h-[18px]" />
          {!sidebarCollapsed && <span className="text-sm">Dashboard</span>}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 no-scrollbar">
        {navigation.map((section) => {
          const isExpanded = expandedSections.has(section.phase);
          const isSectionActive = activePhase === section.phase;

          return (
            <div key={section.phase} className="mb-0.5">
              {/* Phase Header */}
              <button
                onClick={() => handlePhaseClick(section)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-2 rounded-lg group',
                  'transition-all duration-150',
                  isSectionActive
                    ? 'bg-white/[0.06] text-zinc-100'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                )}
                style={isSectionActive ? {
                  boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 0 20px -10px ${section.glowColor}`
                } : undefined}
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
                      'w-3.5 h-3.5 text-zinc-500 transition-transform duration-150',
                      isExpanded ? 'rotate-0' : '-rotate-90'
                    )}
                  />
                )}
              </button>

              {/* Phase Items */}
              {!sidebarCollapsed && isExpanded && (
                <div className="mt-0.5 ml-4 pl-2.5 border-l border-white/[0.04] space-y-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm group',
                          'transition-all duration-150',
                          isActive
                            ? 'text-white'
                            : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                        )
                      }
                      style={({ isActive }) => isActive ? {
                        background: 'rgba(124, 58, 237, 0.1)',
                        boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 0 20px -10px ${section.glowColor}`,
                        border: '1px solid rgba(124, 58, 237, 0.2)'
                      } : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-violet-300"
                          style={{
                            background: 'rgba(124, 58, 237, 0.2)',
                            boxShadow: 'inset 0 0 8px rgba(124, 58, 237, 0.2)'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Collapsed hover menu */}
              {sidebarCollapsed && (
                <div className="relative group">
                  <div 
                    className="absolute left-full top-0 ml-2 w-44 rounded-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20, 20, 31, 0.98) 0%, rgba(14, 14, 24, 0.99) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 16px 48px -12px rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                      {section.label}
                    </div>
                    {section.items.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'text-white bg-white/[0.06]'
                              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                          )
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-semibold">
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
        <div className="mt-3 pt-3 border-t border-white/[0.04]">
          <NavLink
            to="/extensions"
            className={({ isActive }) =>
              cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )
            }
          >
            <Boxes className="w-[18px] h-[18px]" />
            {!sidebarCollapsed && <span className="text-sm">Extensions</span>}
          </NavLink>
        </div>

        {/* Favorites */}
        {!sidebarCollapsed && favoriteExtensions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <div className="px-2.5 mb-2">
              <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Favorites
              </span>
            </div>
            <div className="space-y-0.5">
              {favoriteExtensions.slice(0, 4).map((ext) => (
                <NavLink
                  key={ext.id}
                  to={`/extensions/${ext.id}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors',
                      isActive
                        ? 'text-amber-300 bg-amber-500/10'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    )
                  }
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="truncate">{ext.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.04] p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'sidebar-item',
              isActive && 'sidebar-item-active'
            )
          }
        >
          <Settings className="w-[18px] h-[18px]" />
          {!sidebarCollapsed && <span className="text-sm">Settings</span>}
        </NavLink>

        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 mt-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
