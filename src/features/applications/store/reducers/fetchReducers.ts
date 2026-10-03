import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Application,
  ApplicationsState,
  SnapshotManifestState,
  SyncStatusValue,
} from '../../models';
import { FORCE_SYNC_PHASE, SNAPSHOT_MANIFEST_CACHE_LIMIT } from '../../constants';
import { STORE_ERRORS } from '../../../../constants/store/store';
import { keepUnchanged } from '../../../../store/keepUnchanged';

// Re-inserting the key on every open moves it to the end of the object's key
// order, which is what lets "oldest key" == "least recently opened" below.
function setSnapshotManifestEntry(
  state: ApplicationsState,
  manifestKey: string,
  entry: SnapshotManifestState,
): void {
  delete state.snapshotManifests[manifestKey];
  state.snapshotManifests[manifestKey] = entry;
  const keys = Object.keys(state.snapshotManifests);
  for (let i = 0; i < keys.length - SNAPSHOT_MANIFEST_CACHE_LIMIT; i += 1) {
    delete state.snapshotManifests[keys[i]];
  }
}

function applyForceSyncStateFromApplications(state: ApplicationsState, apps: Application[]): void {
  if (!state.syncStatus) state.syncStatus = {};
  if (!state.syncCompletedAt) state.syncCompletedAt = {};
  if (!state.syncLastError) state.syncLastError = {};
  for (const app of apps || []) {
    const block = app?.lastForceSync;
    if (!app?.name || !block?.phase) continue;
    if (state.syncing?.[app.name]) continue;
    const mapped: SyncStatusValue | null = mapPhaseToSyncStatus(block.phase);
    if (!mapped) continue;
    state.syncStatus[app.name] = mapped;
    if (block.completedAt) state.syncCompletedAt[app.name] = block.completedAt;
    if (block.phase === FORCE_SYNC_PHASE.FAILED && block.error) {
      state.syncLastError[app.name] = block.error;
    } else if (block.phase === FORCE_SYNC_PHASE.COMPLETED) {
      delete state.syncLastError[app.name];
    }
  }
}

function mapPhaseToSyncStatus(phase: string): SyncStatusValue | null {
  switch (phase) {
    case FORCE_SYNC_PHASE.QUEUED:
    case FORCE_SYNC_PHASE.RUNNING:
      return 'syncing';
    case FORCE_SYNC_PHASE.COMPLETED:
      return 'success';
    case FORCE_SYNC_PHASE.FAILED:
      return 'failed';
    default:
      return null;
  }
}

export const handleFetchApplicationsPending = (state: ApplicationsState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchApplicationsFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application[]>,
) => {
  state.loading = false;
  state.loaded = true;
  state.applications = keepUnchanged(state.applications, action.payload, (app) => app.name);
  state.error = null;
  applyForceSyncStateFromApplications(state, action.payload);
};

export const handleFetchApplicationsSilentFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application[]>,
) => {
  state.loading = false;
  state.loaded = true;
  state.applications = keepUnchanged(state.applications, action.payload, (app) => app.name);
  state.error = null;
  applyForceSyncStateFromApplications(state, action.payload);
};

export const handleFetchApplicationsRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATIONS);
};

export const handleFetchApplicationsSilentPending = (state: ApplicationsState) => {
  void state;
};

export const handleFetchApplicationsSilentRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  if (!state.applications || state.applications.length === 0) {
    state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATIONS);
  }
};

export const handleFetchApplicationDetailsPending = (state: ApplicationsState) => {
  // Only the first load (or a genuine navigation, which clears details first) shows
  // the full-page skeleton. A same-app refetch (poll interval, post-rollback
  // refresh) must not flip this, or the page unmounts and closes any open panel.
  if (!state.details) {
    state.loading = true;
  }
  state.error = null;
};

export const handleFetchApplicationDetailsFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application>,
) => {
  state.loading = false;
  state.details = action.payload;
  state.error = null;
  if (action.payload) {
    applyForceSyncStateFromApplications(state, [action.payload]);
  }
};

export const handleFetchApplicationDetailsRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = String(action.payload || STORE_ERRORS.FETCH_APPLICATION_DETAILS);
};

export const handleUpdateApplicationFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<Application>,
) => {
  const updated = action.payload;
  const idx = state.applications.findIndex((a) => a.name === updated.name);
  if (idx >= 0) {
    state.applications[idx] = updated;
  }
  if (state.details?.name === updated.name) {
    state.details = updated;
  }
  state.error = null;
};

export const handleResetApplicationFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<string>,
) => {
  const name = action.payload;
  state.applications = state.applications.filter((a) => a.name !== name);
  if (state.details?.name === name) {
    state.details = null;
  }
  state.error = null;
};

export const handleFetchSnapshotManifestPending = (
  state: ApplicationsState,
  action: { meta: { arg: { manifestKey: string } } },
) => {
  const { manifestKey } = action.meta.arg;
  setSnapshotManifestEntry(state, manifestKey, { loading: true, error: null, data: null });
};

export const handleFetchSnapshotManifestFulfilled = (
  state: ApplicationsState,
  action: PayloadAction<{ manifestKey: string; data: unknown }>,
) => {
  const { manifestKey, data } = action.payload;
  setSnapshotManifestEntry(state, manifestKey, { loading: false, error: null, data });
};

export const handleFetchSnapshotManifestRejected = (
  state: ApplicationsState,
  action: PayloadAction<unknown, string, { arg: { manifestKey: string } }>,
) => {
  const { manifestKey } = action.meta.arg;
  setSnapshotManifestEntry(state, manifestKey, {
    loading: false,
    error: String(action.payload || ''),
    data: null,
  });
};
