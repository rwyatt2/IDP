import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserStore, useNavigationStore } from '@/stores';
import { useClickOutside } from '@/hooks';
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
  Store,
  Sparkles,
} from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';

export function TopNav() {
  const navigate = useNavigate();
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useUserStore();
  const { openSearch, toggleCommandPalette } = useNavigationStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(notifRef, () => setShowNotifications(false), showNotifications);
  useClickOutside(userMenuRef, () => setShowUserMenu(false), showUserMenu);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  if (!user) return null;

  return (
    <header className="h-14 flex items-center justify-between px-4 gap-4">
      {/* Search Bar - Command Center Style */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={openSearch}
          className="group w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-400 
                     bg-surface-2/50 border border-white/[0.06] 
                     hover:border-white/[0.1] hover:bg-surface-3/50
                     transition-all duration-150"
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="flex-1 text-left text-sm">Search applications, services, docs...</span>
          <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-zinc-500">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Create New */}
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate('/build/create')}
          className="hidden sm:flex"
        >
          New App
        </Button>

        {/* Extensions */}
        <Link
          to="/extensions"
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-150"
          title="Extensions"
        >
          <Store className="w-[18px] h-[18px]" />
        </Link>

        {/* Command Palette */}
        <button
          onClick={toggleCommandPalette}
          className="p-2 rounded-lg text-zinc-500 hover:text-accent-400 hover:bg-accent-500/10 transition-all duration-150"
          title="Command Palette"
        >
          <Sparkles className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-lg transition-all duration-150",
              showNotifications 
                ? "text-zinc-200 bg-white/[0.06]" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
            )}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-600 text-white text-[9px] font-semibold flex items-center justify-center shadow-glow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl overflow-hidden animate-scale-in z-50 glass-panel-strong">
              <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
                <h3 className="font-medium text-sm text-zinc-200">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-accent-400 hover:text-accent-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">
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
                        'w-full p-3 text-left hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0',
                        !notif.read && 'bg-accent-500/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0',
                            notif.read ? 'bg-zinc-600' : 'bg-accent-500 shadow-glow-sm'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-zinc-200">
                            {notif.title}
                          </p>
                          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-1.5 tracking-wide">
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
        <div className="w-px h-5 bg-white/[0.06] mx-1" />

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "flex items-center gap-2 p-1 rounded-lg transition-all duration-150",
              showUserMenu 
                ? "bg-white/[0.06]" 
                : "hover:bg-white/[0.04]"
            )}
          >
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-zinc-500 transition-transform duration-150",
              showUserMenu && "rotate-180"
            )} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden animate-scale-in z-50 glass-panel-strong">
              <div className="p-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="lg" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-zinc-100 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
                {user.onCallStatus?.isOnCall && (
                  <div className="mt-2.5 px-2 py-1.5 rounded-md bg-warning-bg border border-warning-border">
                    <div className="flex items-center gap-2 text-warning-text text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-text animate-pulse" />
                      <span className="font-medium">On-Call</span>
                      <span className="text-zinc-500">
                        · {user.onCallStatus.schedule}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-1.5">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="dropdown-item"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="dropdown-item"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link
                  to="/help"
                  onClick={() => setShowUserMenu(false)}
                  className="dropdown-item"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Docs
                </Link>
                <div className="my-1.5 h-px bg-white/[0.06]" />
                <button className="dropdown-item text-danger-text hover:bg-danger-bg/50">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
