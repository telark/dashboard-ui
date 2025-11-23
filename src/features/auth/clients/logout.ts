import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { LogoutResponse } from '../models';

export const logout = async (): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
  });
};
