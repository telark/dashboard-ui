import { message } from 'antd';
import store from '../../../../../store';
import { SYNC_MESSAGES } from '../../../../../constants/layout/modes';
import { SYNC_CONSTANTS } from '../../../../../constants/config/sync';
import { handleSyncError } from '../../../../../utils/shared/sync';
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
    const status = String(res?.data?.status || '').trim();
    if (status && status !== 'pending' && status !== 'in_progress' && status !== 'success') {
      destroySyncMessage(message, key);
      message.open({
        type: 'error',
        content: res?.data?.error || `Sync failed: ${status}`,
        key,
        duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.ERROR,
      });
      return;
    }

    // Non-blocking: the backend only queues the sync now.
    store.dispatch(APPLICATION_SYNC_CONFIG.fetchAllResourcesThunk());
    destroySyncMessage(message, key);
    message.open({
      type: 'success',
      content: `Sync queued for ${name}.`,
      key,
      duration: SYNC_CONSTANTS.MESSAGE_DURATIONS.SUCCESS,
    });
  } catch (err: unknown) {
    destroySyncMessage(message, key);
    handleSyncError({ err, message, config: APPLICATION_SYNC_CONFIG, isDetailsSync: false });
  } finally {
    clearApplicationSyncInFlight(name);
    store.dispatch(endSync(name));
  }
};

