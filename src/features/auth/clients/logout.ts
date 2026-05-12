import { Client, authApiClient } from '../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../constants';
import type { LogoutResponse } from '../models';

const LOGOUT_TIMEOUT_MS = 5000;

export const logout = async (sessionToken: string | null): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  const headers: Record<string, string> = {};
  if (sessionToken) {
    headers[HTTP_HEADERS.CUSTOM.SESSION_TOKEN] = sessionToken;
  }
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
    timeout: LOGOUT_TIMEOUT_MS,
    headers,
  });
};
