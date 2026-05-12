import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { AuthConfigData, AuthConfigResponse } from '../models';

export const getAuthConfig = async (): Promise<AuthConfigData> => {
  const { path, method } = Endpoints.AUTH.CONFIG.GET;
  const resp = await Client<AuthConfigResponse>(authApiClient, path, { method });
  return resp.data;
};
