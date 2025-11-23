import { Client, exporterApiClient, syncManagerApiClient } from '../../../api/index';
import logger from '../../../logging';
import { Endpoints, ERROR_MESSAGES } from '../../../constants';
import type { StandardApiResponse } from '../../../interfaces/http';

export interface SyncGrouperResponse {
  status: number;
  operation: string;
  message: string;
  data: {
    name: string;
    phase: string; // Completed | NotStarted | Failed
    syncEffect: string; // Changed | NoUpdate | NewlyCreated | Deleted | NotFound
  };
}

export const updateGrouperSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.GROUPERS.UPDATE_SYNC(name);
    return await Client<StandardApiResponse>(exporterApiClient, path, {
      method: method,
      data: { spec: { config: { sync: { mode: syncMode } } } },
    });
  } catch (error) {
    logger.error(`${ERROR_MESSAGES.CLIENT.UPDATE_SYNC_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

export const triggerGroupersSync = async () => {
  const { path, method } = Endpoints.SYNC.GROUPERS;
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleGrouperSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.GROUPER(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

