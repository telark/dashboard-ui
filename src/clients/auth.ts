import { Client, authApiClient } from '../api/index';
import { Endpoints, HTTP_HEADERS } from '../constants';
import type {
  LoginStartRequest,
  LoginStartResponse,
  LoginFinishRequest,
  LoginFinishResponse,
  RegisterStartResponse,
  RegisterFinishRequest,
  RegisterFinishResponse,
  LogoutResponse,
  Passkey,
  CreatePasskeyRequest,
  CreatePasskeyResponse,
  UpdatePasskeyRequest,
  UpdatePasskeyResponse,
  DeletePasskeyRequest,
  DeletePasskeyResponse,
} from '../interfaces/auth';

// Authentication
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

export const registerStart = async (): Promise<RegisterStartResponse> => {
  const { path, method } = Endpoints.AUTH.REGISTER.START;
  return await Client<RegisterStartResponse>(authApiClient, path, {
    method,
  });
};

export const logout = async (): Promise<LogoutResponse> => {
  const { path, method } = Endpoints.AUTH.LOGOUT;
  return await Client<LogoutResponse>(authApiClient, path, {
    method,
  });
};

// Passkey Management
export const getAllPasskeys = async (): Promise<Passkey[]> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.GET_ALL;
  return await Client<Passkey[]>(authApiClient, path, {
    method,
  });
};

export const getPasskey = async (credentialId: string): Promise<Passkey> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.GET_SINGLE;
  return await Client<Passkey>(authApiClient, path, {
    method,
    headers: {
      [HTTP_HEADERS.CUSTOM.CREDENTIAL_ID]: credentialId,
    },
  });
};

export const createPasskey = async (
  request: CreatePasskeyRequest,
  deviceName: string,
  deviceType: 'platform' | 'cross-platform',
): Promise<CreatePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.CREATE;
  return await Client<CreatePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
    headers: {
      [HTTP_HEADERS.CUSTOM.DEVICE_NAME]: deviceName,
      [HTTP_HEADERS.CUSTOM.DEVICE_TYPE]: deviceType,
    },
  });
};

export const updatePasskey = async (
  credentialId: string,
  request: UpdatePasskeyRequest,
): Promise<UpdatePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.UPDATE;
  return await Client<UpdatePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
    headers: {
      [HTTP_HEADERS.CUSTOM.CREDENTIAL_ID]: credentialId,
    },
  });
};

export const deletePasskey = async (
  credentialId: string,
  request: DeletePasskeyRequest = {},
): Promise<DeletePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.DELETE;
  return await Client<DeletePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
    headers: {
      [HTTP_HEADERS.CUSTOM.CREDENTIAL_ID]: credentialId,
    },
  });
};

