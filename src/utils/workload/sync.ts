import { App as AntdApp } from 'antd';
import { triggerSingleAppSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { SYNC_CONSTANTS } from '../../constants/sync';
import store, { AppDispatch } from '../../store';
import { startSync, endSync } from '../../store/workloads/slices/workloadSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { WORKLOAD_SYNC_CONFIG } from '../../constants/config';
import { DetailsSyncParams, SyncParams } from '../../interfaces/shared';


export const syncAppWorkloadDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.fasid?.name || details?.name;
    if (!apiName) {
      throw new Error('Workload name is required');
    }
    (store.dispatch as AppDispatch)(startSync(apiName));

    const key = `sync-app-${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
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
    handleSyncError({ err, message, isDetailsSync: false, config: WORKLOAD_SYNC_CONFIG });
  } finally {
    const apiName = details?.fasid?.name || details?.name;
    if (apiName) {
      setSyncing(false);
      (store.dispatch as AppDispatch)(endSync(apiName));
    }
  }
};

export const syncAppWorkload = async ({
  name,
  message,
  setSyncing,
}: SyncParams): Promise<void> => {
  try {
    setSyncing(true);
    (store.dispatch as AppDispatch)(startSync(name));

    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${name}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${name}…`,
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
    handleSyncError({ err, message, isDetailsSync: false, config: WORKLOAD_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};

