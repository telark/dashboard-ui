import { APP_ROUTES } from '../../../constants';

export const AUTH_CONFIG = {
  SESSION: {
    VALIDATION: {
      INTERVAL_SECONDS: 60,
    },
  },
} as const;

/** Routes that render without waiting for the permissions store to be ready. */
export const PERMISSION_GATE_BYPASS_PATHS: readonly string[] = [
  APP_ROUTES.HOME,
  `${APP_ROUTES.SETTINGS}/profile`,
  `${APP_ROUTES.SETTINGS}/appearance`,
  `${APP_ROUTES.SETTINGS}/permissions`,
  `${APP_ROUTES.SETTINGS}/security`,
  APP_ROUTES.PASSKEYS,
  `${APP_ROUTES.SETTINGS}/about`,
];
