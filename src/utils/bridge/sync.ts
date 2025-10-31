import { triggerSingleBridgeSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { BRIDGE_DETAILS_CONSTANTS } from '../../constants/pages/bridge-details';
import { SYNC_CONSTANTS } from '../../constants/sync';
import store, { AppDispatch } from '../../store';
import { startSync, endSync } from '../../store/bridges/slices/bridgeSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { BRIDGE_SYNC_CONFIG } from '../../constants/config';
import { DetailsSyncParams, SyncParams } from '../../interfaces/shared';

export const syncBridgeDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.syncName || details.name;
    (store.dispatch as AppDispatch)(startSync(details.name));

    const key = `${BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleBridgeSync(apiName);
    const effect = res?.data?.syncEffect ?? BRIDGE_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      resourceDetails: details,
      key,
      message,
      config: BRIDGE_SYNC_CONFIG,
    });
  } catch (err: any) {
    handleSyncError({ err, message, isDetailsSync: true, config: BRIDGE_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(details.name));
  }
};

export const syncBridge = async ({
  name,
  syncName,
  message,
  setSyncing,
}: SyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = syncName || name;
    (store.dispatch as AppDispatch)(startSync(name));

    const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${apiName}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleBridgeSync(apiName);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      name,
      key,
      message,
      config: BRIDGE_SYNC_CONFIG,
    });
  } catch (err: any) {
    handleSyncError({ err, message, isDetailsSync: false, config: BRIDGE_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};


