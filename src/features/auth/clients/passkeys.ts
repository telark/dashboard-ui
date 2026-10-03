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
  EnrollLinkResponse,
} from '../models';

export const getAllPasskeys = async (): Promise<Passkey[]> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.GET_ALL;
  return await Client<Passkey[]>(authApiClient, path, {
    method,
  });
};

export const getPasskey = async (credentialId: string): Promise<Passkey> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.GET_SINGLE(credentialId);
  return await Client<Passkey>(authApiClient, path, {
    method,
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

export const createEnrollLink = async (): Promise<EnrollLinkResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.ENROLL_LINK;
  return await Client<EnrollLinkResponse>(authApiClient, path, { method });
};

export const updatePasskey = async (
  credentialId: string,
  request: UpdatePasskeyRequest,
): Promise<UpdatePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.UPDATE(credentialId);
  return await Client<UpdatePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
  });
};

export const deletePasskey = async (
  credentialId: string,
  request: DeletePasskeyRequest = {},
): Promise<DeletePasskeyResponse> => {
  const { path, method } = Endpoints.AUTH.PASSKEYS.DELETE(credentialId);
  return await Client<DeletePasskeyResponse>(authApiClient, path, {
    method,
    data: request,
  });
};
