import { HEADER_LAYOUT } from '../layout/header';

export const APP_CONFIGS = {
  MESSAGE: {
    TOP: HEADER_LAYOUT.HEIGHT_PX + 12,
    MAX_COUNT: 3,
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
  INSIGHTS: '/insights',
  // access-and-permissions
  ROLES: '/management/roles',
  USERS: '/management/users',
  GROUPS: '/management/groups',
  // settings
  SETTINGS: '/settings',
  // governance
  PROTECTION_PLANS: '/governance/plans/protection',
  PROTECTION_PLAN_DETAILS: '/governance/plans/protection/:name/details',
} as const;
