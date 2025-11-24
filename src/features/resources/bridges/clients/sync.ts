import { Client, syncManagerApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { SyncWithEffectResponse } from '../../../../interfaces/resources/sync';

export const triggerBridgesSync = async () => {
  const { path, method } = Endpoints.SYNC.BRIDGES;
  return Client<SyncWithEffectResponse>(syncManagerApiClient, path, { method });
};

export const triggerSingleBridgeSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.BRIDGE(name);
  return Client<SyncWithEffectResponse>(syncManagerApiClient, path, { method });
};
