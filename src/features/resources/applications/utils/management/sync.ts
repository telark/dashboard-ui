import store from '../../../../../store';
import { triggerApplicationSync } from '../../clients';
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
