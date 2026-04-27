import { Client, authApiClient } from '../../../api/index';
import { Endpoints } from '../../../constants';
import type {
  LoginStartRequest,
  LoginStartResponse,
  LoginFinishRequest,
  LoginFinishResponse,
  DeviceMetadata,
} from '../models';
import type { User } from '../../access-and-permissions/users/models';

export interface OIDCCallbackResponse {
  sessionToken: string;
  email: string;
  user?: User;
}

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

export interface OIDCCallbackRequest extends DeviceMetadata {
  idToken: string;
}

export const oidcGoogleCallback = async (
  request: OIDCCallbackRequest,
): Promise<OIDCCallbackResponse> => {
  const { path, method } = Endpoints.AUTH.OIDC.GOOGLE.CALLBACK;
  return await Client<OIDCCallbackResponse>(authApiClient, path, {
    method,
    data: request,
  });
};
