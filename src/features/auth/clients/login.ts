import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type {
  LoginStartRequest,
  LoginStartResponse,
  LoginFinishRequest,
  LoginFinishResponse,
} from '../models';

export const loginStart = async (request: LoginStartRequest): Promise<LoginStartResponse> => {
  const { path, method } = Endpoints.AUTH.LOGIN.START;
  return await Client<LoginStartResponse>(authApiClient, path, {
    method,
    data: request,
  });
};

export const loginFinish = async (request: LoginFinishRequest): Promise<LoginFinishResponse> => {
  const { path, method } = Endpoints.AUTH.LOGIN.FINISH;
  return await Client<LoginFinishResponse>(authApiClient, path, {
    method,
    data: request,
  });
};
