import { Client, syncManagerApiClient } from '../api';
import { Endpoints } from '../constants/rest/endpoints';

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

export const triggerAppsSync = async () => {
  const { path, method } = Endpoints.SYNC.APPS;
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleAppSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APP(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};
