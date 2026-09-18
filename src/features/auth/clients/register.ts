import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type { RegisterStartRequest, RegisterStartResponse } from '../models';

export const registerStart = async (
  email?: string,
  enrollToken?: string,
): Promise<RegisterStartResponse> => {
  const { path, method } = Endpoints.AUTH.REGISTER.START;
  const data: RegisterStartRequest = {};
  if (email) {
    data.email = email;
  }
  if (enrollToken) {
    data.enrollToken = enrollToken;
  }

  return await Client<RegisterStartResponse>(authApiClient, path, { method, data });
};
