import store from '../../../../../store';
import { APPLICATION_SYNC_CONFIG } from '../../../../../config/syncConfig';
import { triggerApplicationSync } from '../../clients';
import { startSync, endSync, setSyncStatus } from '../../store/slices/applicationsSlice';
import {
  clearApplicationSyncInFlight,
  isApplicationSyncInFlight,
  markApplicationSyncInFlight,
} from './syncInFlight';

export const forceSyncApplication = async (name: string): Promise<void> => {
  if (!name) return;

  const state = store.getState();
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return;

  try {
    store.dispatch(startSync(name));
    store.dispatch(setSyncStatus({ name, status: 'syncing' }));
    markApplicationSyncInFlight(name);

    const res = await triggerApplicationSync(name);
    const status = String(res?.data?.status || '').trim();

    if (status !== 'success') {
      store.dispatch(setSyncStatus({ name, status: 'failed' }));
      return;
    }

    store.dispatch(APPLICATION_SYNC_CONFIG.fetchAllResourcesThunk());
    store.dispatch(setSyncStatus({ name, status: 'success' }));
  } catch {
    store.dispatch(setSyncStatus({ name, status: 'failed' }));
  } finally {
    clearApplicationSyncInFlight(name);
    store.dispatch(endSync(name));
  }
};

