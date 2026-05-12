import store from '../../../../../store';
import { triggerApplicationSync } from '../../clients';
import { APPLICATIONS_PERSIST_KEY } from '../../constants';
import {
  startSync,
  endSync,
  setSyncCompletedAt,
  setSyncStatus,
  setSyncLastError,
} from '../../store/slices/applicationsSlice';
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

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err.length > 0) return err;
  return 'Force sync request failed.';
}

export const forceSyncApplication = async (name: string): Promise<void> => {
  if (!name) return;

  const state = store.getState();
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return;

  try {
    store.dispatch(startSync(name));
    store.dispatch(setSyncStatus({ name, status: 'syncing' }));
    store.dispatch(setSyncCompletedAt({ name }));
    store.dispatch(setSyncLastError({ name }));
    persistSyncStateImmediately(name);
    markApplicationSyncInFlight(name);

    await triggerApplicationSync(name);
  } catch (err) {
    store.dispatch(setSyncStatus({ name, status: 'failed' }));
    store.dispatch(setSyncCompletedAt({ name, completedAt: new Date().toISOString() }));
    store.dispatch(setSyncLastError({ name, error: extractErrorMessage(err) }));
  } finally {
    clearApplicationSyncInFlight(name);
    store.dispatch(endSync(name));
  }
};

export const retryFailedSyncApplication = async (name: string): Promise<void> => {
  if (!name) return;

  const state = store.getState();
  if (state.applications.syncStatus?.[name] !== 'failed') return;
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return;

  try {
    markApplicationSyncInFlight(name);
    await triggerApplicationSync(name);
    store.dispatch(setSyncStatus({ name, status: 'syncing' }));
    store.dispatch(setSyncLastError({ name }));
  } catch (err) {
    store.dispatch(setSyncStatus({ name, status: 'failed' }));
    store.dispatch(setSyncCompletedAt({ name, completedAt: new Date().toISOString() }));
    store.dispatch(setSyncLastError({ name, error: extractErrorMessage(err) }));
  } finally {
    clearApplicationSyncInFlight(name);
  }
};
