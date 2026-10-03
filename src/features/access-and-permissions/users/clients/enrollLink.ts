import { Client, authApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { EnrollLinkResponse } from '../../../auth/models';

export const createUserEnrollLink = async (userId: string): Promise<EnrollLinkResponse> => {
  const { path, method } = Endpoints.USERS.CREATE_ENROLL_LINK(userId);
  return await Client<EnrollLinkResponse>(authApiClient, path, { method });
};

export const revokeUserEnrollLink = async (userId: string): Promise<void> => {
  const { path, method } = Endpoints.USERS.REVOKE_ENROLL_LINK(userId);
  await Client(authApiClient, path, { method });
};
