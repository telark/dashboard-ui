import { LOGIN_CONSTANTS } from '../../constants/login';
import { APP_ROUTES } from '../../../../constants';
import { oidcGetNonce } from '../../clients';

const buildGoogleOAuthUrl = (clientId: string, nonce: string): string => {
  const redirectUri = `${window.location.origin}${APP_ROUTES.GOOGLE_CALLBACK}`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: LOGIN_CONSTANTS.OIDC.GOOGLE_RESPONSE_TYPE,
    scope: LOGIN_CONSTANTS.OIDC.GOOGLE_SCOPE,
    nonce,
  });
  return `${LOGIN_CONSTANTS.OIDC.GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const redirectToGoogle = async (clientId: string): Promise<void> => {
  const { nonce } = await oidcGetNonce();
  window.location.href = buildGoogleOAuthUrl(clientId, nonce);
};
