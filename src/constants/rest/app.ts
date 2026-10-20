import { HEADER_LAYOUT } from '../layout/header';
import { SIDEBAR_LAYOUT } from '../layout/sidebar';

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
    TRANSITION: `margin-left ${SIDEBAR_LAYOUT.TRANSITION_MS}ms ${SIDEBAR_LAYOUT.TRANSITION_EASING}`,
  },
} as const;

export const APP_ROUTES = {
  HOME: '/',
  // auth
  LOGIN: '/login',
  REGISTER: '/register',
  GOOGLE_CALLBACK: '/auth/google/callback',
  // A break-glass request's approval page: public, so the bootstrap account approves without a sign-in.
  BREAK_GLASS: '/break-glass',
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
  AUTHENTICATION: '/settings/authentication',
} as const;

// Here, not in a feature, so a deep link from always-loaded code (the bell) loads no feature constants.
export const APP_ROUTE_PARAMS = {
  // /insights?insight=<id> opens that insight's details panel.
  INSIGHT: 'insight',
} as const;
