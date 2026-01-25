import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification, UserPreferences } from '@/types';
import { currentUser, notifications as mockNotifications } from '@/data/mock-data';

interface UserState {
  user: User | null;
  notifications: Notification[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: currentUser,
      notifications: mockNotifications,
      isAuthenticated: true,
      isLoading: false,

      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false, notifications: [] }),
      
      updatePreferences: (preferences) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
            : null,
        })),
      
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
