import { triggerSingleAppSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/layout/modes';
import { SYNC_CONSTANTS } from '../../constants/config/sync';
import store from '../../store';
import { startSync, endSync } from '../../store/workloads/slices/workloadSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { WORKLOAD_SYNC_CONFIG } from '../../config/syncConfig';
import { DetailsSyncParams, SyncParams } from '../../interfaces/sync';

export const syncAppWorkloadDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.fasid?.name || details?.name;
    const displayName = details?.fasid?.sourceName || details?.name;
    if (!apiName) {
      throw new Error('Workload name is required');
    }
    store.dispatch(startSync(apiName));

    const key = `sync-app-${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleAppSync(apiName);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      resourceDetails: details,
      key,
      message,
      config: WORKLOAD_SYNC_CONFIG,
    });
  } catch (err: any) {
    // Ensure loading message is closed on error/timeout
    const apiName = details?.fasid?.name || details?.name;
    const key = `sync-app-${apiName}`;
    if (apiName) {
      message.destroy(key);
    }
    handleSyncError({ err, message, isDetailsSync: false, config: WORKLOAD_SYNC_CONFIG });
  } finally {
    const apiName = details?.fasid?.name || details?.name;
    if (apiName) {
      setSyncing(false);
      store.dispatch(endSync(apiName));
    }
  }
};

export const syncAppWorkload = async ({ name, message, setSyncing }: SyncParams): Promise<void> => {
  try {
    setSyncing(true);
    store.dispatch(startSync(name));

    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${name}`;
    // Resolve display name from store (sourceName) when available
    const state = store.getState();
    const app = state.workload.apps.find((a: any) => a?.name === name);
    const displayName = app?.sourceName || name;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleAppSync(name);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      name,
      key,
      message,
      config: WORKLOAD_SYNC_CONFIG,
    });
  } catch (err: any) {
    // Ensure loading message is closed on error/timeout
    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${name}`;
    message.destroy(key);
    handleSyncError({ err, message, isDetailsSync: false, config: WORKLOAD_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    store.dispatch(endSync(name));
  }
};
