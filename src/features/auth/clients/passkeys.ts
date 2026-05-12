import { Client, authApiClient } from '../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../constants';
import type {
  Passkey,
  CreatePasskeyResponse,
  UpdatePasskeyRequest,
  UpdatePasskeyResponse,
  DeletePasskeyRequest,
  DeletePasskeyResponse,
  PublicKeyCredential,
  PasskeyDeviceType,
} from '../models';

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
  credential: PublicKeyCredential,
  deviceName: string,
  deviceType: PasskeyDeviceType,
  email?: string,
): Promise<CreatePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.CREATE;
  const headers: Record<string, string> = {
    [HTTP_HEADERS.CUSTOM.DEVICE_NAME]: deviceName,
    [HTTP_HEADERS.CUSTOM.DEVICE_TYPE]: deviceType,
  };

  if (email) {
    headers[HTTP_HEADERS.CUSTOM.EMAIL] = email;
  }

  return await Client<CreatePasskeyResponse>(authApiClient, path, {
    method,
    data: credential,
    headers,
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
  userId?: string,
): Promise<DeletePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.DELETE;
  const headers: Record<string, string> = {
    [HTTP_HEADERS.CUSTOM.CREDENTIAL_ID]: credentialId,
  };

  if (request.cleanupOrphaned && userId) {
    headers[HTTP_HEADERS.CUSTOM.USER_ID] = userId;
  }

  return await Client<DeletePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
    headers,
  });
};
