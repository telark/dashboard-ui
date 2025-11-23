import { Client, syncManagerApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import type { SyncGrouperResponse } from '../../../clients/sync-manager';

export const triggerAppsSync = async () => {
  const { path, method } = Endpoints.SYNC.APPS;
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleAppSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APP(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

