export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Campus Security System';
export const ENABLE_DEVTOOLS = import.meta.env.VITE_ENABLE_DEVTOOLS === 'true';

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  VISITOR: 'visitor',
};

export const CAMPUS_STATES = {
  OPEN: 'open',
  CLOSED: 'closed',
  RESTRICTED: 'restricted',
  EMERGENCY: 'emergency',
};

export const ACCESS_STATUS = {
  ALLOWED: 'allowed',
  DENIED: 'denied',
  PENDING: 'pending',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  STUDENTS: '/students',
  VISITORS: '/visitors',
  ACCESS_LOGS: '/access-logs',
  CAMPUS_STATE: '/campus-state',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

export const QUERY_KEYS = {
  AUTH_USER: ['auth', 'user'],
  STUDENTS: ['students'],
  VISITORS: ['visitors'],
  ACCESS_LOGS: ['access-logs'],
  CAMPUS_STATE: ['campus-state'],
  ANALYTICS: ['analytics'],
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};
