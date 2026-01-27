import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';

/**
 * Auth store for managing authentication state
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Set user and token
       */
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, error: null });
      },

      /**
       * Login user
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          // Backend returns { access_token, token_type }
          // Decode the JWT to get user info (username, role)
          const token = data.access_token;
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          const user = { username: payload.username, role: payload.role };
          get().setAuth(user, token);
          set({ isLoading: false });
          return data;
        } catch (error) {
          const errorMessage = error.message || error.data?.detail || 'Login failed. Please check your credentials.';
          set({ 
            isLoading: false, 
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Load user from storage
       */
      loadUser: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error('Error loading user:', error);
            get().logout();
          }
        }
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
