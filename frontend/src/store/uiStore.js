import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI store for managing UI state
 */
export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
      notifications: [],

      /**
       * Toggle theme
       */
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      }),

      /**
       * Set theme
       */
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },

      /**
       * Toggle sidebar
       */
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      /**
       * Set sidebar open state
       */
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      /**
       * Add notification
       */
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...notification,
            timestamp: new Date(),
          },
        ],
      })),

      /**
       * Remove notification
       */
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      /**
       * Clear all notifications
       */
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
