import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type {
  RegisterStartResponse,
  RegisterFinishRequest,
  RegisterFinishResponse,
} from '../models';

export const registerStart = async (email?: string): Promise<RegisterStartResponse> => {
  const { path, method } = Endpoints.AUTH.REGISTER.START;
  const config: any = {
    method,
  };
  if (email) {
    config.data = { email };
  }

  return await Client<RegisterStartResponse>(authApiClient, path, config);
};

export const registerFinish = async (
  request: RegisterFinishRequest,
): Promise<RegisterFinishResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.CREATE;
  return await Client<RegisterFinishResponse>(authApiClient, path, {
    method,
    data: request,
  });
};
