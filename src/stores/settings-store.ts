import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationSettings {
  // Email Notifications
  emailDeployments: boolean;
  emailIncidents: boolean;
  emailApprovals: boolean;
  emailMentions: boolean;
  emailWeeklyDigest: boolean;
  // Push Notifications
  pushCriticalOnly: boolean;
  pushOnCall: boolean;
  pushDesktop: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showBreadcrumbs: boolean;
  animations: boolean;
}

export interface LocalizationSettings {
  language: string;
  timezone: string;
  dateFormat: 'mdy' | 'dmy' | 'ymd';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface SettingsState {
  // Profile
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  
  // Localization
  localization: LocalizationSettings;
  
  // Notifications
  notifications: NotificationSettings;
  
  // Appearance
  appearance: AppearanceSettings;
  
  // Security
  security: SecuritySettings;
  
  // Actions
  updateProfile: (profile: { firstName?: string; lastName?: string; email?: string }) => void;
  updateLocalization: (settings: Partial<LocalizationSettings>) => void;
  updateNotification: <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => void;
  updateAppearance: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => void;
  updateSecurity: <K extends keyof SecuritySettings>(key: K, value: SecuritySettings[K]) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@company.com',
  role: 'Tech Lead',
  
  localization: {
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'mdy' as const,
  },
  
  notifications: {
    emailDeployments: true,
    emailIncidents: true,
    emailApprovals: true,
    emailMentions: false,
    emailWeeklyDigest: true,
    pushCriticalOnly: true,
    pushOnCall: true,
    pushDesktop: false,
  },
  
  appearance: {
    theme: 'dark' as const,
    compactMode: false,
    showBreadcrumbs: true,
    animations: true,
  },
  
  security: {
    twoFactorEnabled: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateProfile: (profile) => set((state) => ({
        ...state,
        ...profile,
      })),
      
      updateLocalization: (settings) => set((state) => ({
        localization: { ...state.localization, ...settings },
      })),
      
      updateNotification: (key, value) => set((state) => ({
        notifications: { ...state.notifications, [key]: value },
      })),
      
      updateAppearance: (key, value) => set((state) => {
        const newAppearance = { ...state.appearance, [key]: value };
        
        // Apply theme immediately to the document
        if (key === 'theme') {
          applyTheme(value as 'light' | 'dark' | 'system');
        }
        
        // Apply animations setting
        if (key === 'animations') {
          applyAnimations(value as boolean);
        }
        
        // Apply compact mode
        if (key === 'compactMode') {
          applyCompactMode(value as boolean);
        }
        
        return { appearance: newAppearance };
      }),
      
      updateSecurity: (key, value) => set((state) => ({
        security: { ...state.security, [key]: value },
      })),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'idp-settings',
      partialize: (state) => ({
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        localization: state.localization,
        notifications: state.notifications,
        appearance: state.appearance,
        security: state.security,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply settings when store rehydrates
        if (state) {
          applyTheme(state.appearance.theme);
          applyAnimations(state.appearance.animations);
          applyCompactMode(state.appearance.compactMode);
        }
      },
    }
  )
);

// Helper functions to apply settings to the DOM
function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }
}

function applyAnimations(enabled: boolean) {
  const root = document.documentElement;
  
  if (enabled) {
    root.classList.remove('no-animations');
    root.style.setProperty('--animation-duration', '200ms');
  } else {
    root.classList.add('no-animations');
    root.style.setProperty('--animation-duration', '0ms');
  }
}

function applyCompactMode(enabled: boolean) {
  const root = document.documentElement;
  
  if (enabled) {
    root.classList.add('compact');
    root.style.setProperty('--spacing-scale', '0.75');
  } else {
    root.classList.remove('compact');
    root.style.setProperty('--spacing-scale', '1');
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const state = useSettingsStore.getState();
    if (state.appearance.theme === 'system') {
      applyTheme('system');
    }
  });
}

// Format date according to user's preference
export function formatDateWithPreference(date: Date | string): string {
  const d = new Date(date);
  const format = useSettingsStore.getState().localization.dateFormat;
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'dmy':
      return `${day}/${month}/${year}`;
    case 'ymd':
      return `${year}-${month}-${day}`;
    case 'mdy':
    default:
      return `${month}/${day}/${year}`;
  }
}

// Get timezone-adjusted date
export function getTimezoneAdjustedDate(date: Date | string): Date {
  const timezone = useSettingsStore.getState().localization.timezone;
  const d = new Date(date);
  
  try {
    return new Date(d.toLocaleString('en-US', { timeZone: timezone }));
  } catch {
    return d;
  }
}
