import { HEADER_LAYOUT } from '../layout/header';

export const APP_CONFIGS = {
  MESSAGE: {
    TOP: HEADER_LAYOUT.HEIGHT_PX + 12,
    MAX_COUNT: 3,
  },
  LAYOUT: {
    MIN_HEIGHT: '100vh',
    // Pages scroll in this pane below the header rather than the window, so the header, the
    // sidebar and panels span the full viewport and the scrollbar runs beside the content only.
    CONTENT_ID: 'app-content',
    CONTENT_TOP: HEADER_LAYOUT.HEIGHT,
    CONTENT_HEIGHT: HEADER_LAYOUT.MIN_HEIGHT,
    CONTENT_OVERFLOW: 'auto',
    MARGIN_LEFT: 'var(--sidebar-width)',
    TRANSITION: 'margin-left 0.3s ease',
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  // auth
  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_CALLBACK: '/auth/google/callback',
  // resources
  APPLICATIONS: '/applications',
  APPLICATION_DETAILS: '/applications/:name',
  INSIGHTS: '/insights',
  PROTECTION_PLANS: '/protection-plans',
  PROTECTION_PLAN_DETAILS: '/protection-plans/:name',
  // access-and-permissions
  ROLES: '/roles',
  USERS: '/members',
  GROUPS: '/groups',
  // settings
  SETTINGS: '/settings',
  PASSKEYS: '/settings/security/passkeys',
} as const;
