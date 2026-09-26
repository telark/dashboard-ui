import { LOGIN_CONSTANTS } from '../../constants/login';
import { APP_ROUTES } from '../../../../constants';
import { oidcGetNonce } from '../../clients';

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

// Binds the Google response to the tab that started the flow, so a callback
// URL crafted with someone else's id_token is rejected (login CSRF).
const createOAuthState = (): string => {
  const state = toHex(
    globalThis.crypto.getRandomValues(new Uint8Array(LOGIN_CONSTANTS.OIDC.STATE_BYTES)),
  );
  globalThis.sessionStorage.setItem(LOGIN_CONSTANTS.OIDC.STATE_STORAGE_KEY, state);
  return state;
};

export const consumeOAuthState = (): string | null => {
  try {
    const state = globalThis.sessionStorage.getItem(LOGIN_CONSTANTS.OIDC.STATE_STORAGE_KEY);
    globalThis.sessionStorage.removeItem(LOGIN_CONSTANTS.OIDC.STATE_STORAGE_KEY);
    return state;
  } catch {
    return null;
  }
};

const buildGoogleOAuthUrl = (clientId: string, nonce: string, state: string): string => {
  const redirectUri = `${window.location.origin}${APP_ROUTES.GOOGLE_CALLBACK}`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: LOGIN_CONSTANTS.OIDC.GOOGLE_RESPONSE_TYPE,
    scope: LOGIN_CONSTANTS.OIDC.GOOGLE_SCOPE,
    nonce,
    state,
  });
  return `${LOGIN_CONSTANTS.OIDC.GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const redirectToGoogle = async (clientId: string): Promise<void> => {
  const res = await oidcGetNonce();
  const nonce = (res as unknown as { data: { nonce: string } }).data.nonce;
  window.location.href = buildGoogleOAuthUrl(clientId, nonce, createOAuthState());
};
