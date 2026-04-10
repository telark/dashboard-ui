import store from '../../../../../store';
import { APPLICATION_SYNC_CONFIG } from '../../../../../config/syncConfig';
import { triggerApplicationSync } from '../../clients';
import { APPLICATIONS_PERSIST_KEY } from '../../constants';
import { startSync, endSync, setSyncStatus } from '../../store/slices/applicationsSlice';
import {
  clearApplicationSyncInFlight,
  isApplicationSyncInFlight,
  markApplicationSyncInFlight,
} from './syncInFlight';

function persistSyncStateImmediately(name: string): void {
  try {
    const raw = localStorage.getItem(APPLICATIONS_PERSIST_KEY);
    const root = raw ? JSON.parse(raw) : {};
    const status = root.syncStatus ? JSON.parse(root.syncStatus as string) : {};
    status[name] = 'syncing';
    root.syncStatus = JSON.stringify(status);
    const syncing = root.syncing ? JSON.parse(root.syncing as string) : {};
    syncing[name] = true;
    root.syncing = JSON.stringify(syncing);
    localStorage.setItem(APPLICATIONS_PERSIST_KEY, JSON.stringify(root));
  } catch {
    /* best-effort — redux-persist handles the normal path */
  }
}

export const forceSyncApplication = async (name: string): Promise<void> => {
  if (!name) return;

  const state = store.getState();
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return;

  try {
    store.dispatch(startSync(name));
    store.dispatch(setSyncStatus({ name, status: 'syncing' }));
    persistSyncStateImmediately(name);
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

