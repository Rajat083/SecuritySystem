import api from './api';

/**
 * Authentication service
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} - Login response
   */
  login: async (credentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} - Logout response
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user
   * @returns {Promise} - Current user data
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   * @returns {Promise} - New access token
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

/**
 * Student service
 */
export const studentService = {
  /**
   * Record student entry
   * @param {Object} data - Entry data (roll_number, name, phone_number, gate_number)
   * @returns {Promise} - Entry response
   */
  recordEntry: async (data) => {
    const response = await api.post('/student/entry', data);
    return response.data;
  },

  /**
   * Record student exit
   * @param {Object} data - Exit data (roll_number, name, phone_number, purpose, return_by, gate_number)
   * @returns {Promise} - Exit response
   */
  recordExit: async (data) => {
    const response = await api.post('/student/exit', data);
    return response.data;
  },
};

/**
 * Visitor service
 */
export const visitorService = {
  /**
   * Record visitor entry
   * @param {Object} data - Entry data (name, phone_number, number_of_visitors, vehicle_number, gate_number)
   * @returns {Promise} - Entry response with visitor_id
   */
  recordEntry: async (data) => {
    const response = await api.post('/visitor/entry', data);
    return response.data;
  },

  /**
   * Record visitor exit
   * @param {string} visitor_id - Visitor ID from entry
   * @param {number} gate_number - Gate number (1-10)
   * @returns {Promise} - Exit response
   */
  recordExit: async (visitor_id, gate_number) => {
    const response = await api.post(`/visitor/exit/${visitor_id}`, null, {
      params: { gate_number }
    });
    return response.data;
  },
};

/**
 * Access log service
 */
export const accessLogService = {
  /**
   * Get student logs
   * @returns {Promise} - Student logs list
   */
  getStudentLogs: async () => {
    const response = await api.get('/state/logs/students');
    return response.data;
  },

  /**
   * Get visitor logs
   * @returns {Promise} - Visitor logs list
   */
  getVisitorLogs: async () => {
    const response = await api.get('/state/logs/visitors');
    return response.data;
  },
};

/**
 * Campus state service
 */
export const campusStateService = {
  /**
   * Get current campus state
   * @returns {Promise} - Campus state data
   */
  getCurrent: async () => {
    const response = await api.get('/state/current');
    return response.data;
  },

  /**
   * Update campus state
   * @param {Object} data - New campus state
   * @returns {Promise} - Updated campus state
   */
  update: async (data) => {
    const response = await api.post('/admin/state', data);
    return response.data;
  },

  /**
   * Get campus state history
   * @param {Object} params - Query parameters
   * @returns {Promise} - State history
   */
  getHistory: async (params = {}) => {
    const response = await api.get('/admin/state/history', { params });
    return response.data;
  },
};

/**
 * Analytics service
 */
export const analyticsService = {
  /**
   * Get visitors inside campus
   * @returns {Promise} - Visitors inside
   */
  getVisitorsInside: async () => {
    const response = await api.get('/state/visitors/inside');
    return response.data;
  },

  /**
   * Get students outside campus
   * @returns {Promise} - Students outside
   */
  getStudentsOutside: async () => {
    const response = await api.get('/state/students/outside');
    return response.data;
  },

  /**
   * Get student logs
   * @returns {Promise} - Student logs
   */
  getStudentLogs: async () => {
    const response = await api.get('/state/logs/students');
    return response.data;
  },

  /**
   * Get visitor logs
   * @returns {Promise} - Visitor logs
   */
  getVisitorLogs: async () => {
    const response = await api.get('/state/logs/visitors');
    return response.data;
  },
};
