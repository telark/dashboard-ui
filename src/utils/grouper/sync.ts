import { triggerSingleGrouperSync } from '../../clients/sync-manager';
import { SYNC_MESSAGES } from '../../constants/layout/modes';
import { GROUPER_DETAILS_CONSTANTS } from '../../constants/pages/grouper-details';
import { SYNC_CONSTANTS } from '../../constants/config/sync';
import store from '../../store';
import { startSync, endSync } from '../../store/groupers/slices/grouperSlice';
import { handleSyncEffect, handleSyncError } from '../shared/sync';
import { buildDetailsSyncKey, buildCardSyncKey, destroySyncMessage } from '../helpers/sync';
import { GROUPER_SYNC_CONFIG } from '../../config/syncConfig';
import { DetailsSyncParams, SyncParams } from '../../interfaces/resources/sync';

export const syncGrouperDetails = async ({
  details,
  setSyncing,
  message,
}: DetailsSyncParams): Promise<void> => {
  try {
    setSyncing(true);
    const apiName = details?.syncName || details.name;
    const displayName = details?.name;
    store.dispatch(startSync(details.name));

    const key = buildDetailsSyncKey(GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX, apiName);
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
  } catch (err: unknown) {
    const apiName = details?.syncName || details.name;
    const key = buildDetailsSyncKey(GROUPER_DETAILS_CONSTANTS.SYNC.MESSAGE_KEY_PREFIX, apiName);
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: GROUPER_SYNC_CONFIG });
  } finally {
    setSyncing(false);
    store.dispatch(endSync(details.name));
  }
};

export const syncGrouper = async ({
  name,
  syncName,
  message,
  setSyncing,
}: SyncParams): Promise<void> => {
  const apiName = syncName || name;
  const key = buildCardSyncKey(apiName);

  try {
    setSyncing(true);
    store.dispatch(startSync(name));
    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${name}`,
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
  } catch (err: unknown) {
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: GROUPER_SYNC_CONFIG, isDetailsSync: false });
  } finally {
    setSyncing(false);
    store.dispatch(endSync(name));
  }
};
