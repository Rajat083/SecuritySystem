import { create } from 'zustand';
import { campusStateService } from '../services';

/**
 * Campus state store
 */
export const useCampusStore = create((set, get) => ({
  campusState: null,
  isLoading: false,
  error: null,

  /**
   * Fetch current campus state
   */
  fetchCampusState: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await campusStateService.getCurrent();
      set({ campusState: data, isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch campus state',
      });
      throw error;
    }
  },

  /**
   * Update campus state
   */
  updateCampusState: async (newState) => {
    set({ isLoading: true, error: null });
    try {
      const data = await campusStateService.update(newState);
      set({ campusState: data, isLoading: false });
      return data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update campus state',
      });
      throw error;
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));
