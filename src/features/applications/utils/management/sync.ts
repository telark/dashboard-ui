import store from '../../../../store';
import { triggerApplicationSync } from '../../clients';
import { APPLICATIONS_UI } from '../../constants/texts';
import { extractErrorMessage } from '../../../../utils/helpers/format';
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

// Resolves to the failure message so callers can surface it; undefined on success or skip.
export const forceSyncApplication = async (name: string): Promise<string | undefined> => {
  if (!name) return undefined;

  const state = store.getState();
  if (state.applications.syncing?.[name] || isApplicationSyncInFlight(name)) return undefined;

  try {
    store.dispatch(startSync(name));
    store.dispatch(setSyncStatus({ name, status: 'syncing' }));
    store.dispatch(setSyncCompletedAt({ name }));
    store.dispatch(setSyncLastError({ name }));
    markApplicationSyncInFlight(name);

    await triggerApplicationSync(name);
    return undefined;
  } catch (err) {
    const error = extractErrorMessage(err, APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC_FAILED);
    store.dispatch(setSyncStatus({ name, status: 'failed' }));
    store.dispatch(setSyncCompletedAt({ name, completedAt: new Date().toISOString() }));
    store.dispatch(setSyncLastError({ name, error }));
    return error;
  } finally {
    clearApplicationSyncInFlight(name);
    store.dispatch(endSync(name));
  }
};
