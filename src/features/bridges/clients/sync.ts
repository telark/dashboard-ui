import { Client, syncManagerApiClient } from '../../../api';
import { Endpoints } from '../../../constants';
import type { SyncGrouperResponse } from '../../../clients/sync-manager';

export const triggerBridgesSync = async () => {
  const { path, method } = Endpoints.SYNC.BRIDGES;
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleBridgeSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.BRIDGE(name);
  return Client<SyncGrouperResponse>(syncManagerApiClient, path, { method });
};

