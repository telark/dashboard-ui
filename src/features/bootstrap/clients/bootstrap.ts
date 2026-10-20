import { Client, authApiClient, exporterApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import type { ResourceDetailsResponse } from '../../../interfaces/http';
import type { LoginStartResponse, PublicKeyCredential } from '../../auth/models';
import type { BootstrapAction, BootstrapRequestResult, BootstrapStatus } from '../models/bootstrap';

export const getBootstrapStatus = async (): Promise<BootstrapStatus> => {
  const { path, method } = Endpoints.BOOTSTRAP.GET;
  const response = await Client<ResourceDetailsResponse<BootstrapStatus>>(exporterApiClient, path, {
    method,
  });
  return response.data;
};

// Shaped like login/start: the options carry the challenge, bound to this request and this action.
export const startAssertion = async (
  requestId: string,
  action: BootstrapAction,
): Promise<LoginStartResponse> => {
  const { path, method } = Endpoints.BOOTSTRAP.ASSERT_START(requestId);
  return await Client<LoginStartResponse>(authApiClient, path, { method, data: { action } });
};

export const finishAssertion = async (
  requestId: string,
  action: BootstrapAction,
  credential: PublicKeyCredential,
): Promise<BootstrapRequestResult> => {
  const { path, method } = Endpoints.BOOTSTRAP.ASSERT_FINISH(requestId);
  return await Client<BootstrapRequestResult>(authApiClient, path, {
    method,
    data: { ...credential, action },
  });
};
