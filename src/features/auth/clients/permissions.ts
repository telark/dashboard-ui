import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { PermissionsResponse } from '../models/permissions';

export const getMyPermissions = async (): Promise<PermissionsResponse> => {
  const { path, method } = Endpoints.AUTH.PERMISSIONS.GET;
  return await Client<PermissionsResponse>(authApiClient, path, { method });
};
