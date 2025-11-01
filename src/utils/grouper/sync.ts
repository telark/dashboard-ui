import { triggerSingleGrouperSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/modes';
import { GROUPER_DETAILS_CONSTANTS } from '../../constants/pages/grouper-details';
import { SYNC_CONSTANTS } from '../../constants/sync';
import store, { AppDispatch } from '../../store';
import { startSync, endSync } from '../../store/groupers/slices/grouperSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { GROUPER_SYNC_CONFIG } from '../../constants/config';
import { DetailsSyncParams, SyncParams } from '../../interfaces/sync';

export const syncGrouperDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.syncName || details.name;
    const displayName = details?.name || apiName;
    (store.dispatch as AppDispatch)(startSync(details.name));

    const key = `${GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}`,
      key,
      duration: GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleGrouperSync(apiName);
    const effect = res?.data?.syncEffect ?? GROUPER_DETAILS_CONSTANTS.SYNC.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      resourceDetails: details,
      key,
      message,
      config: GROUPER_SYNC_CONFIG,
    });
  } catch (err: any) {
    // Ensure loading message is closed on error/timeout
    const apiName = details?.syncName || details.name;
    const key = `${GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX}${apiName}`;
    message.destroy(key);
    handleSyncError({ err, message, isDetailsSync: true, config: GROUPER_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(details.name));
  }
};

export const syncGrouper = async ({
  name,
  syncName,
  message,
  setSyncing,
}: SyncParams): Promise<void> => {
  const apiName = syncName || name;
  const key = `${SYNC_CONSTANTS.MESSAGE_KEY_PREFIX}${apiName}`;
  const displayName = name; // Grouper display = name
  try {
    setSyncing(true);
    (store.dispatch as AppDispatch)(startSync(name));
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${displayName}`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerSingleGrouperSync(apiName);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      name,
      key,
      message,
      config: GROUPER_SYNC_CONFIG,
    });
  } catch (err: any) {
    // Ensure loading message is closed on error/timeout
    message.destroy(key);
    handleSyncError({ err, message, isDetailsSync: false, config: GROUPER_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    (store.dispatch as AppDispatch)(endSync(name));
  }
};
