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
  // auth
  LOGIN: '/login',
  REGISTER: '/register',
  PASSKEYS: '/passkeys',
  GOOGLE_CALLBACK: '/auth/google/callback',
  // resources
  APPLICATIONS: '/applications',
  APPLICATION_DETAILS: '/applications/:name/details',
  // access-and-permissions
  ROLES: '/management/roles',
  USERS: '/management/users',
  GROUPS: '/management/groups',
  // settings
  SETTINGS: '/settings',
  // governance
  PROTECTION_PLANS: '/governance/protection-plans',
  PROTECTION_PLANS_CREATE: '/governance/protection-plans/create',
} as const;
