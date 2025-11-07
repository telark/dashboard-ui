import { triggerSingleAppSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/layout/modes';
import { SYNC_CONSTANTS } from '../../constants/config/sync';
import { WORKLOAD_DETAILS_CONSTANTS } from '../../constants/pages/workload-details';
import store from '../../store';
import { startSync, endSync } from '../../store/workloads/slices/workloadSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { buildDetailsSyncKey, buildCardSyncKey, destroySyncMessage } from '../helpers/sync';
import { WORKLOAD_SYNC_CONFIG } from '../../config/syncConfig';
import { DetailsSyncParams, SyncParams } from '../../interfaces/sync';

export const syncAppWorkloadDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.fasid?.name;
    const displayName = details?.fasid?.sourceName;
    store.dispatch(startSync(apiName));

    const key = buildDetailsSyncKey(WORKLOAD_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX, apiName);
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}…`,
      key,
      duration: WORKLOAD_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleAppSync(apiName);
    const effect = res?.data?.syncEffect ?? WORKLOAD_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      resourceDetails: details,
      key,
      message,
      config: WORKLOAD_SYNC_CONFIG,
    });
  } catch (err: unknown) {
    const apiName = details?.fasid?.name || details?.name;
    const key = buildDetailsSyncKey(WORKLOAD_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX, apiName);
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: WORKLOAD_SYNC_CONFIG });
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

    const key = buildCardSyncKey(name);
    const state = store.getState();
    const app = state.workload.apps.find((a: any) => a?.name === name);
    const displayName = app?.sourceName;
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
  } catch (err: unknown) {
    const key = buildCardSyncKey(name);
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: WORKLOAD_SYNC_CONFIG, isDetailsSync: false });
  } finally {
    setSyncing(false);
    store.dispatch(endSync(name));
  }
};
