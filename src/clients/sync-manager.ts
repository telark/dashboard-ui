import { Client, syncManagerApiClient } from '../api';
import { Endpoints } from '../constants/endpoints';

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

export const triggerGroupersSync = async () => {
  const { path, method } = Endpoints.SYNC.GROUPERS;
  return Client<any>(syncManagerApiClient, path, { method });
};

export const triggerSingleGrouperSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.GROUPER(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleAppSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APP(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};
