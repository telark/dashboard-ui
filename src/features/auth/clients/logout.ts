import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { LogoutResponse } from '../models';

const LOGOUT_TIMEOUT_MS = 5000;

export const logout = async (): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
    timeout: LOGOUT_TIMEOUT_MS,
  });
};
