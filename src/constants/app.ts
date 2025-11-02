export const APP_CONFIGS = {
  MESSAGE: {
    TOP: 72,
    MAX_COUNT: 3,
  },
  WELCOME: {
    DURATION: 3000, // 3 seconds
    STORAGE_KEY: 'WELCOME_PENDING',
    STORAGE_VALUE: '1',
  },
  LAYOUT: {
    MIN_HEIGHT: '100vh',
    HEIGHT: '100vh',
    MARGIN_LEFT: 'var(--sidebar-width)',
    TRANSITION: 'margin-left 0.3s ease',
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  GROUPERS: '/groupers',
  GROUPER_DETAILS: '/groupers/:name/details',
  WORKLOADS: '/workloads',
  APP_WORKLOAD_DETAILS: '/workloads/apps/:name/details',
  BRIDGES: '/bridges',
  BRIDGE_DETAILS: '/bridges/:name/details',
  ROLES: '/roles',
  ROLE_CREATE: '/roles/create',
} as const;
