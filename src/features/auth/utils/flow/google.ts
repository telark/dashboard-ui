import { LOGIN_CONSTANTS } from '../../constants/login';
import { APP_ROUTES } from '../../../../constants';

const buildNonce = (): string => {
  const bytes = new Uint8Array(LOGIN_CONSTANTS.OIDC.NONCE_BYTE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const buildGoogleOAuthUrl = (clientId: string): string => {
  const redirectUri = `${window.location.origin}${APP_ROUTES.GOOGLE_CALLBACK}`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: LOGIN_CONSTANTS.OIDC.GOOGLE_RESPONSE_TYPE,
    scope: LOGIN_CONSTANTS.OIDC.GOOGLE_SCOPE,
    nonce: buildNonce(),
  });
  return `${LOGIN_CONSTANTS.OIDC.GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const redirectToGoogle = (clientId: string): void => {
  window.location.href = buildGoogleOAuthUrl(clientId);
};
