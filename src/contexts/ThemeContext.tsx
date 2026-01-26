/**
 * Theme Context & Provider
 * 
 * Provides theme state management with:
 * - System preference detection
 * - LocalStorage persistence
 * - Smooth theme transitions
 * - Type-safe theme values
 * 
 * Usage:
 * ```tsx
 * const { theme, setTheme, resolvedTheme } = useTheme();
 * ```
 */

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback,
  useMemo 
} from 'react';

// ============================================================================
// Types
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** Current theme setting (can be 'system') */
  theme: Theme;
  /** Actual applied theme (never 'system') */
  resolvedTheme: ResolvedTheme;
  /** Update theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Check if currently dark mode */
  isDark: boolean;
  /** Check if currently light mode */
  isLight: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'idp-theme';
const DEFAULT_THEME: Theme = 'dark'; // Developer preference

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme if none stored */
  defaultTheme?: Theme;
  /** Storage key for persistence */
  storageKey?: string;
  /** Enable system theme detection */
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = STORAGE_KEY,
  enableSystem = true,
}: ThemeProviderProps) {
  // Initialize theme from storage or default
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme;
      }
    } catch {
      // Storage not available
    }
    
    return defaultTheme;
  });

  // Track system preference
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system' && enableSystem) {
      return systemTheme;
    }
    return theme === 'system' ? 'dark' : theme;
  }, [theme, systemTheme, enableSystem]);

  // Listen for system preference changes
  useEffect(() => {
    if (!enableSystem || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystem]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Add transition class for smooth theme changes
    root.classList.add('theme-transition');
    
    // Apply theme
    root.setAttribute('data-theme', resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        resolvedTheme === 'dark' ? '#0a0d12' : '#ffffff'
      );
    }

    // Remove transition class after animation
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, [resolvedTheme]);

  // Set theme with persistence
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Storage not available
    }
  }, [storageKey]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// ============================================================================
// Theme Toggle Component
// ============================================================================

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={className}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Current: ${theme === 'system' ? `System (${resolvedTheme})` : theme}`}
    >
      {/* Sun icon for light mode */}
      <svg
        className={`w-5 h-5 transition-transform ${
          resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      
      {/* Moon icon for dark mode */}
      <svg
        className={`w-5 h-5 absolute transition-transform ${
          resolvedTheme === 'light' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      
      {showLabel && (
        <span className="ml-2">
          {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}

// ============================================================================
// Theme Selector Component (for settings)
// ============================================================================

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const options: { value: Theme; label: string; description: string }[] = [
    { value: 'light', label: 'Light', description: 'Light theme' },
    { value: 'dark', label: 'Dark', description: 'Dark theme' },
    { value: 'system', label: 'System', description: `Currently: ${resolvedTheme}` },
  ];
  
  return (
    <div className={className} role="radiogroup" aria-label="Theme selection">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          onClick={() => setTheme(option.value)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg border transition-all
            ${theme === option.value 
              ? 'border-accent bg-accent-subtle text-text-primary' 
              : 'border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${theme === option.value ? 'bg-accent text-white' : 'bg-surface-raised'}
          `}>
            {option.value === 'light' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            )}
            {option.value === 'dark' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
            {option.value === 'system' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            )}
          </div>
          <div className="text-left">
            <p className="font-medium">{option.label}</p>
            <p className="text-sm text-text-tertiary">{option.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ThemeContext;
