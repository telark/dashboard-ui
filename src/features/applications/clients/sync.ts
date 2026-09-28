import { Client, discoveryApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import { SYNC_CONSTANTS } from '../../../constants/config/sync';
import type { ResourceDetailsResponse } from '../../../interfaces/http';
import type { ForceSyncPhase } from '../models';

export interface ApplicationForceSyncResult {
  jobId: string;
  appName: string;
  phase: ForceSyncPhase;
  status: 'enqueued' | 'already_in_flight';
}

export const triggerApplicationSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APPLICATION(name);
  return Client<ResourceDetailsResponse<ApplicationForceSyncResult>>(discoveryApiClient, path, {
    method,
    timeout: SYNC_CONSTANTS.APPLICATION_FORCE_SYNC_TIMEOUT_MS,
  });
};
