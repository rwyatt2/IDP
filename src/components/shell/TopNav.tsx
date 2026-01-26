import { useState, useRef, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserStore, useNavigationStore, useDocumentationStore } from '@/stores';
import { useClickOutside } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Command,
  ChevronDown,
  Plus,
  Sparkles,
  Code,
  Users,
  BarChart3,
  Briefcase,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { usePersonaStore } from '@/stores';
import { PERSONAS, type PersonaType } from '@/types/persona';
import { formatRelativeTime } from '@/lib/utils';

const personaIcons: Record<PersonaType, React.ReactNode> = {
  developer: <Code className="w-4 h-4" aria-hidden="true" />,
  'tech-lead': <Users className="w-4 h-4" aria-hidden="true" />,
  'engineering-manager': <BarChart3 className="w-4 h-4" aria-hidden="true" />,
  executive: <Briefcase className="w-4 h-4" aria-hidden="true" />,
};

const personaColors: Record<PersonaType, string> = {
  developer: 'text-info',
  'tech-lead': 'text-accent',
  'engineering-manager': 'text-success',
  executive: 'text-warning',
};

export function TopNav() {
  const navigate = useNavigate();
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useUserStore();
  const { openSearch, toggleCommandPalette } = useNavigationStore();
  const { currentPersona, setPersona } = usePersonaStore();
  const { openSidebar: openHelpSidebar } = useDocumentationStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  
  useClickOutside(notifRef, () => setShowNotifications(false), showNotifications);
  useClickOutside(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  // Handle Escape key to close menus
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showNotifications) {
          setShowNotifications(false);
          notifButtonRef.current?.focus();
        }
        if (showUserMenu) {
          setShowUserMenu(false);
          userButtonRef.current?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showNotifications, showUserMenu]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  if (!user) return null;

  return (
    <div className="h-14 flex items-center justify-between px-6 gap-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <button
          onClick={openSearch}
          className="group w-full h-9 flex items-center gap-3 px-4 rounded-lg
                     bg-surface-raised border border-border-subtle 
                     hover:border-border-default hover:bg-surface-overlay
                     transition-all duration-150 focus-visible-ring"
          aria-label="Open search dialog"
        >
          <Search className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
          <span className="flex-1 text-left text-sm text-text-tertiary">Search applications, services, docs...</span>
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle text-[10px] font-medium text-text-tertiary" aria-hidden="true">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Create New */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/build/create')}
          className="hidden sm:flex px-4"
          aria-label="Create new application"
        >
          New App
        </Button>

        {/* Help */}
        <button
          onClick={openHelpSidebar}
          className="p-2.5 rounded-lg text-text-tertiary hover:text-accent hover:bg-accent/10 transition-all duration-150 focus-visible-ring"
          aria-label="Open help center (⌘/)"
          title="Help (⌘/)"
        >
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Command Palette */}
        <button
          onClick={toggleCommandPalette}
          className="p-2.5 rounded-lg text-text-tertiary hover:text-accent hover:bg-accent/10 transition-all duration-150 focus-visible-ring"
          aria-label="Open command palette"
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg text-text-tertiary hover:text-warning hover:bg-warning/10 transition-all duration-150 focus-visible-ring"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            ref={notifButtonRef}
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2.5 rounded-lg transition-all duration-150 focus-visible-ring",
              showNotifications 
                ? "text-text-primary bg-surface-raised" 
                : "text-text-tertiary hover:text-text-secondary hover:bg-interactive-hover"
            )}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span 
                className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-error text-text-on-emphasis text-[10px] font-bold flex items-center justify-center px-1"
                aria-hidden="true"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-[420px] rounded-xl overflow-hidden animate-scale-in z-50 bg-surface-overlay border border-border-default shadow-2xl"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="flex items-center justify-between p-3 border-b border-border-subtle bg-surface-raised">
                <h2 className="font-medium text-sm text-text-primary">Notifications</h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-accent hover:text-accent/80 transition-colors focus-visible-ring rounded px-1"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto bg-surface" role="list">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-text-tertiary text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.actionUrl) {
                          navigate(notif.actionUrl);
                        }
                        setShowNotifications(false);
                      }}
                      className={cn(
                        'w-full p-3 text-left hover:bg-surface-raised transition-colors border-b border-border-subtle last:border-0 focus-visible-ring',
                        !notif.read && 'bg-accent/5'
                      )}
                      role="listitem"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                            notif.read ? 'bg-text-disabled' : 'bg-accent'
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-text-primary">
                            {notif.title}
                          </p>
                          <p className="text-xs text-text-tertiary line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-text-disabled mt-1.5 tracking-wide">
                            {formatRelativeTime(notif.timestamp)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-border-default mx-2" aria-hidden="true" />

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            ref={userButtonRef}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "flex items-center gap-2.5 p-1.5 rounded-lg transition-all duration-150 focus-visible-ring",
              showUserMenu 
                ? "bg-surface-raised" 
                : "hover:bg-interactive-hover"
            )}
            aria-label={`User menu for ${user.name}`}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <ChevronDown 
              className={cn(
                "w-4 h-4 text-text-tertiary transition-transform duration-150",
                showUserMenu && "rotate-180"
              )} 
              aria-hidden="true"
            />
          </button>

          {showUserMenu && (
            <div 
              className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden animate-scale-in z-50 bg-surface-overlay border border-border-default shadow-2xl"
              role="dialog"
              aria-label="User menu"
            >
              <div className="p-4 border-b border-border-subtle bg-surface-raised">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="lg" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                  </div>
                </div>
                {user.onCallStatus?.isOnCall && (
                  <div className="mt-3 px-3 py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                      <span className="font-semibold">On-Call</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 pl-4">
                      {user.onCallStatus.schedule}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Persona Switcher Section */}
              <div className="p-2 border-b border-border-subtle bg-surface">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={personaColors[currentPersona]}>
                      {personaIcons[currentPersona]}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">{PERSONAS[currentPersona].name}</p>
                      <p className="text-xs text-text-tertiary">Switch persona</p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      'w-4 h-4 text-text-tertiary transition-transform duration-fast',
                      showPersonaMenu && 'rotate-180'
                    )} 
                    aria-hidden="true" 
                  />
                </button>
                
                {showPersonaMenu && (
                  <div className="mt-2 space-y-1">
                    {(Object.keys(PERSONAS) as PersonaType[]).map((personaKey) => {
                      const p = PERSONAS[personaKey];
                      const isSelected = currentPersona === personaKey;
                      
                      return (
                        <button
                          key={personaKey}
                          onClick={() => {
                            setPersona(personaKey);
                            setShowPersonaMenu(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                            isSelected 
                              ? 'bg-accent/10 border border-accent/30' 
                              : 'hover:bg-surface-raised border border-transparent'
                          )}
                        >
                          <span className={personaColors[personaKey]}>
                            {personaIcons[personaKey]}
                          </span>
                          <span className="flex-1 text-sm text-text-primary">{p.name}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                    <p className="px-3 py-2 text-xs text-text-disabled">
                      Switch view to experience platform as different roles
                    </p>
                  </div>
                )}
              </div>
              
              <nav className="p-2 bg-surface" role="menu">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors focus-visible-ring"
                  role="menuitem"
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors focus-visible-ring"
                  role="menuitem"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  Settings
                </Link>
                <Link
                  to="/help"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors focus-visible-ring"
                  role="menuitem"
                >
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                  Help & Docs
                </Link>
                <div className="my-2 h-px bg-border-subtle" role="separator" />
                <button 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors focus-visible-ring w-full"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign out
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
