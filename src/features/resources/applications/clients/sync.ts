import { Client, discoveryApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { SyncWithEffectResponse } from '../../../../interfaces/resources/sync';

export const triggerApplicationSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APPLICATION(name);
  return Client<SyncWithEffectResponse>(discoveryApiClient, path, { method });
};

