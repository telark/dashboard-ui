import { triggerSingleBridgeSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { BRIDGE_DETAILS_CONSTANTS } from '../../constants/pages/bridge-details';
import { SYNC_CONSTANTS } from '../../constants/sync';
import store, { AppDispatch } from '../../store';
import { startSync, endSync } from '../../store/bridges/slices/bridgeSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { BRIDGE_SYNC_CONFIG } from '../../constants/config';
import { DetailsSyncParams, SyncParams } from '../../interfaces/sync';

export const syncBridgeDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.syncName || details.name;
    const displayName = details?.name || details?.sourceName || apiName;
    (store.dispatch as AppDispatch)(startSync(details.name));

    const key = `${BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}…`,
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
    // Ensure loading message is closed on error/timeout
    const apiName = details?.syncName || details.name;
    const key = `${BRIDGE_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.destroy(key);
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
  // Compute API/display identifiers upfront so they are available in all blocks
  const apiName = syncName || name;
  const displayName = name; // 'name' is sourceName at callers; use it for user-facing label
  const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${apiName}`;
  try {
    setSyncing(true);
    (store.dispatch as AppDispatch)(startSync(name));
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}`,
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
    // Ensure loading message is closed on error/timeout
    message.destroy(key);
    handleSyncError({ err, message, isDetailsSync: false, config: BRIDGE_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};
