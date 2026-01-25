import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/stores';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleCommandPalette, openSearch, toggleSidebar } = useNavigationStore();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'k',
      meta: true,
      action: () => toggleCommandPalette(),
      description: 'Open command palette',
    },
    {
      key: 'k',
      ctrl: true,
      action: () => toggleCommandPalette(),
      description: 'Open command palette',
    },
    {
      key: '/',
      action: () => openSearch(),
      description: 'Focus search',
    },
    {
      key: 'b',
      meta: true,
      action: () => toggleSidebar(),
      description: 'Toggle sidebar',
    },
    {
      key: 'b',
      ctrl: true,
      action: () => toggleSidebar(),
      description: 'Toggle sidebar',
    },
    {
      key: '1',
      meta: true,
      action: () => navigate('/discover'),
      description: 'Go to Discover',
    },
    {
      key: '2',
      meta: true,
      action: () => navigate('/build'),
      description: 'Go to Build',
    },
    {
      key: '3',
      meta: true,
      action: () => navigate('/deploy'),
      description: 'Go to Deploy',
    },
    {
      key: '4',
      meta: true,
      action: () => navigate('/manage'),
      description: 'Go to Manage',
    },
    {
      key: 'n',
      meta: true,
      shift: true,
      action: () => navigate('/build/create'),
      description: 'Create new application',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow command palette shortcut when in input
        if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleCommandPalette();
        }
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !shortcut.ctrl;
        const metaMatches = shortcut.meta ? event.metaKey : !shortcut.meta;
        const shiftMatches = shortcut.shift ? event.shiftKey : !shortcut.shift;
        const altMatches = shortcut.alt ? event.altKey : !shortcut.alt;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, toggleCommandPalette]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

export function useEscapeKey(onEscape: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, enabled]);
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onClickOutside: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onClickOutside, enabled]);
}
