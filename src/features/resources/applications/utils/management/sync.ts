import { message } from 'antd';
import store from '../../../../../store';
import { SYNC_MESSAGES } from '../../../../../constants/layout/modes';
import { SYNC_CONSTANTS } from '../../../../../constants/config/sync';
import { handleSyncEffect, handleSyncError } from '../../../../../utils/shared/sync';
import { buildCardSyncKey, destroySyncMessage } from '../../../../../utils/helpers/sync';
import { APPLICATION_SYNC_CONFIG } from '../../../../../config/syncConfig';
import { triggerApplicationSync } from '../../clients';
import { startSync, endSync } from '../../store/slices/applicationsSlice';
import {
  clearApplicationSyncInFlight,
  isApplicationSyncInFlight,
  markApplicationSyncInFlight,
} from './syncInFlight';

export const forceSyncApplication = async (name: string): Promise<void> => {
  if (!name) return;

  const state = store.getState();
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return;

  const key = buildCardSyncKey(name);

  try {
    store.dispatch(startSync(name));
    markApplicationSyncInFlight(name);

    message.open({
      type: 'loading',
      content: `${SYNC_MESSAGES.loading} ${name}…`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.LOADING,
    });

    const res = await triggerApplicationSync(name);
    const effect = res?.data?.syncEffect ?? SYNC_CONSTANTS.DEFAULT_SYNC_EFFECT;

    await handleSyncEffect({
      effect,
      name,
      key,
      message,
      config: APPLICATION_SYNC_CONFIG,
    });
  } catch (err: unknown) {
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: APPLICATION_SYNC_CONFIG, isDetailsSync: false });
  } finally {
    clearApplicationSyncInFlight(name);
    store.dispatch(endSync(name));
  }
};

