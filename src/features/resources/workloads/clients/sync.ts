import { Client, discoveryApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { SyncWithEffectResponse } from '../../../../interfaces/resources/sync';

export const triggerAppsSync = async () => {
  const { path, method } = Endpoints.SYNC.APPS;
  return Client<SyncWithEffectResponse>(discoveryApiClient, path, { method });
};

export const triggerSingleAppSync = async (name: string) => {
  const { path, method } = Endpoints.SYNC.APP(name);
  return Client<SyncWithEffectResponse>(discoveryApiClient, path, { method });
};
