import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ApplicationHealthQuickFilter,
  ApplicationsState,
  SyncStatusValue,
} from '../../models';
import {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  updateApplicationThunk,
  deleteApplicationThunk,
  triggerApplicationRollbackThunk,
  abortApplicationRollbackThunk,
} from '../thunks/fetchThunks';
import {
  handleFetchApplicationsPending,
  handleFetchApplicationsFulfilled,
  handleFetchApplicationsSilentFulfilled,
  handleFetchApplicationsRejected,
  handleFetchApplicationsSilentPending,
  handleFetchApplicationsSilentRejected,
  handleFetchApplicationDetailsPending,
  handleFetchApplicationDetailsFulfilled,
  handleFetchApplicationDetailsRejected,
  handleFetchSnapshotManifestPending,
  handleFetchSnapshotManifestFulfilled,
  handleFetchSnapshotManifestRejected,
  handleUpdateApplicationFulfilled,
  handleDeleteApplicationFulfilled,
} from '../reducers/fetchReducers';

export {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  updateApplicationThunk,
  deleteApplicationThunk,
  triggerApplicationRollbackThunk,
  abortApplicationRollbackThunk,
} from '../thunks/fetchThunks';

const initialState: ApplicationsState = {
  applications: [],
  details: null,
  loading: false,
  error: null,
  snapshots: [],
  snapshotsLoading: false,
  snapshotsError: null,
  snapshotManifests: {},
  syncing: {},
  syncStatus: {},
  syncCompletedAt: {},
  syncLastError: {},
  searchValue: '',
  currentPage: 1,
  appliedFilters: {},
  layoutMode: 'single',
  bulkMode: false,
  selectedNames: [],
  healthQuickFilter: 'all',
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null;
    },
    startSync: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name) state.syncing[name] = true;
    },
    endSync: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name && state.syncing[name]) delete state.syncing[name];
    },
    clearOrphanedSyncing: (state, action: PayloadAction<string[]>) => {
      const live = new Set(action.payload || []);
      if (!state.syncing) state.syncing = {};
      Object.keys(state.syncing).forEach((name) => {
        if (!live.has(name)) delete state.syncing[name];
      });
    },
    setSyncStatus: (state, action: PayloadAction<{ name: string; status: SyncStatusValue }>) => {
      if (!state.syncStatus) state.syncStatus = {};
      const { name, status } = action.payload;
      if (name) state.syncStatus[name] = status;
    },
    setSyncCompletedAt: (state, action: PayloadAction<{ name: string; completedAt?: string }>) => {
      if (!state.syncCompletedAt) state.syncCompletedAt = {};
      const { name, completedAt } = action.payload;
      if (!name) return;
      if (!completedAt) {
        delete state.syncCompletedAt[name];
        return;
      }
      state.syncCompletedAt[name] = completedAt;
    },
    setSyncLastError: (state, action: PayloadAction<{ name: string; error?: string }>) => {
      if (!state.syncLastError) state.syncLastError = {};
      const { name, error } = action.payload;
      if (!name) return;
      if (!error) {
        delete state.syncLastError[name];
        return;
      }
      state.syncLastError[name] = error;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setAppliedFilters: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.appliedFilters = action.payload;
      state.currentPage = 1;
    },
    clearAllFilters: (state) => {
      state.appliedFilters = {};
      state.currentPage = 1;
    },
    removeFilterValue: (
      state,
      action: PayloadAction<{ key: string; value?: string; clearAll?: boolean }>,
    ) => {
      const { key, value, clearAll } = action.payload;
      if (clearAll) {
        state.appliedFilters = {};
        state.currentPage = 1;
        return;
      }
      const current = state.appliedFilters[key];
      if (Array.isArray(current)) {
        state.appliedFilters[key] = current.filter((item) => String(item) !== String(value));
      } else if (current && typeof current === 'object' && key === 'dateRange') {
        state.appliedFilters[key] = {};
      } else {
        delete state.appliedFilters[key];
      }
      state.currentPage = 1;
    },
    downgradeOrphanedSyncStatus: (state, action: PayloadAction<string[]>) => {
      if (!state.syncStatus) return;
      const live = new Set(action.payload || []);
      for (const name of Object.keys(state.syncStatus)) {
        if (state.syncStatus[name] === 'syncing' && !live.has(name)) {
          state.syncStatus[name] = 'failed';
        }
      }
    },
    setLayoutMode: (state, action: PayloadAction<'single' | 'double'>) => {
      state.layoutMode = action.payload;
    },
    setBulkMode: (state, action: PayloadAction<boolean>) => {
      state.bulkMode = action.payload;
    },
    setSelectedNames: (state, action: PayloadAction<string[]>) => {
      state.selectedNames = action.payload || [];
    },
    toggleSelectedName: (state, action: PayloadAction<{ name: string; checked: boolean }>) => {
      const { name, checked } = action.payload;
      if (!name) return;
      const current = new Set(state.selectedNames || []);
      if (checked) {
        current.add(name);
      } else {
        current.delete(name);
      }
      state.selectedNames = Array.from(current);
    },
    setHealthQuickFilter: (state, action: PayloadAction<ApplicationHealthQuickFilter>) => {
      state.healthQuickFilter = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllApplicationsThunk.pending, handleFetchApplicationsPending)
      .addCase(fetchAllApplicationsThunk.fulfilled, handleFetchApplicationsFulfilled)
      .addCase(fetchAllApplicationsThunk.rejected, handleFetchApplicationsRejected)
      .addCase(fetchAllApplicationsSilentThunk.pending, handleFetchApplicationsSilentPending)
      .addCase(fetchAllApplicationsSilentThunk.fulfilled, handleFetchApplicationsSilentFulfilled)
      .addCase(fetchAllApplicationsSilentThunk.rejected, handleFetchApplicationsSilentRejected)
      .addCase(fetchApplicationDetailsThunk.pending, handleFetchApplicationDetailsPending)
      .addCase(fetchApplicationDetailsThunk.fulfilled, handleFetchApplicationDetailsFulfilled)
      .addCase(fetchApplicationDetailsThunk.rejected, handleFetchApplicationDetailsRejected)
      .addCase(fetchApplicationSnapshotsThunk.pending, (state) => {
        state.snapshotsLoading = true;
        state.snapshotsError = null;
      })
      .addCase(fetchApplicationSnapshotsThunk.fulfilled, (state, action) => {
        state.snapshotsLoading = false;
        state.snapshots = action.payload;
        state.snapshotsError = null;
      })
      .addCase(fetchApplicationSnapshotsThunk.rejected, (state, action) => {
        state.snapshotsLoading = false;
        state.snapshotsError = String(action.payload || '');
      })
      .addCase(fetchSnapshotManifestThunk.pending, handleFetchSnapshotManifestPending)
      .addCase(fetchSnapshotManifestThunk.fulfilled, handleFetchSnapshotManifestFulfilled)
      .addCase(fetchSnapshotManifestThunk.rejected, handleFetchSnapshotManifestRejected)
      .addCase(updateApplicationThunk.fulfilled, handleUpdateApplicationFulfilled)
      .addCase(deleteApplicationThunk.fulfilled, handleDeleteApplicationFulfilled)
      .addCase(triggerApplicationRollbackThunk.fulfilled, handleUpdateApplicationFulfilled)
      .addCase(abortApplicationRollbackThunk.fulfilled, handleUpdateApplicationFulfilled);
  },
});

export const {
  clearDetails,
  startSync,
  endSync,
  clearOrphanedSyncing,
  setSyncStatus,
  setSyncCompletedAt,
  setSyncLastError,
  setSearchValue,
  setCurrentPage,
  setAppliedFilters,
  clearAllFilters,
  removeFilterValue,
  downgradeOrphanedSyncStatus,
  setLayoutMode,
  setBulkMode,
  setSelectedNames,
  toggleSelectedName,
  setHealthQuickFilter,
} = applicationsSlice.actions;
export default applicationsSlice.reducer;
