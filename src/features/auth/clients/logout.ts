import { Client, authApiClient } from '../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../constants';
import type { LogoutResponse } from '../models';

const LOGOUT_TIMEOUT_MS = 5000;

// Auth revokes the session behind the cookie and clears it. A token is passed only to revoke a pre-0.2.0 one.
export const logout = async (legacyToken?: string): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  const headers: Record<string, string> = {};
  if (legacyToken) {
    headers[HTTP_HEADERS.CUSTOM.SESSION_TOKEN] = legacyToken;
  }
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
    timeout: LOGOUT_TIMEOUT_MS,
    headers,
  });
};
