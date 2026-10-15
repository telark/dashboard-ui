import { APP_ROUTES } from '../../../constants';

// Google accepts only a redirect URI listed on the OAuth client, so login and the setup help share it.
export const googleRedirectUri = (): string =>
  `${window.location.origin}${APP_ROUTES.GOOGLE_CALLBACK}`;
