import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { LogoutResponse } from '../models';

const LOGOUT_TIMEOUT_MS = 5000;

// Auth revokes the session behind the cookie and clears it.
export const logout = async (): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
    timeout: LOGOUT_TIMEOUT_MS,
  });
};
