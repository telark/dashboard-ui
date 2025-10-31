import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WorkloadsState } from '../../../interfaces/workload';

// Import thunks
import {
  fetchAllAppsWorkloadsThunk,
  fetchAllBatchesWorkloadsThunk,
  fetchAppWorkloadDetailsThunk,
} from '../thunks/FetchThunks';
import {
  triggerAppsSyncThunk,
  updateAppWorkloadSyncModeThunk,
} from '../thunks/SyncThunks';

// Import reducers
import {
  handleFetchAppsPending,
  handleFetchAppsFulfilled,
  handleFetchAppsRejected,
  handleFetchAppDetailsPending,
  handleFetchAppDetailsFulfilled,
  handleFetchAppDetailsRejected,
  handleFetchBatchesPending,
  handleFetchBatchesFulfilled,
  handleFetchBatchesRejected,
} from '../reducers/FetchReducers';
import {
  handleTriggerSyncRejected,
  handleUpdateSyncModeFulfilled,
  handleUpdateSyncModeRejected,
} from '../reducers/SyncReducers';

const initialState: WorkloadsState = {
  apps: [],
  batches: [],
  appDetails: null,
  batchDetails: null,
  appLoading: false,
  batchLoading: false,
  appError: null,
  batchError: null,
  syncing: {},
};

// Re-export thunks for external use
export {
  fetchAllAppsWorkloadsThunk,
  fetchAllBatchesWorkloadsThunk,
  fetchAppWorkloadDetailsThunk,
  triggerAppsSyncThunk,
  updateAppWorkloadSyncModeThunk,
};

const workloadSlice = createSlice({
  name: 'workloads',
  initialState,
  reducers: {
    clearWorkloads: (state) => {
      state.apps = [];
      state.appDetails = null;
      state.appError = null;
    },
    clearWorkloadDetails: (state) => {
      state.appDetails = null;
      state.appError = null;
    },
    setWorkloadError: (state, action: PayloadAction<string>) => {
      state.appError = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch Apps
      .addCase(fetchAllAppsWorkloadsThunk.pending, handleFetchAppsPending)
      .addCase(fetchAllAppsWorkloadsThunk.fulfilled, handleFetchAppsFulfilled)
      .addCase(fetchAllAppsWorkloadsThunk.rejected, handleFetchAppsRejected)
      // Fetch App Details
      .addCase(fetchAppWorkloadDetailsThunk.pending, handleFetchAppDetailsPending)
      .addCase(fetchAppWorkloadDetailsThunk.fulfilled, handleFetchAppDetailsFulfilled)
      .addCase(fetchAppWorkloadDetailsThunk.rejected, handleFetchAppDetailsRejected)
      // Fetch Batches
      .addCase(fetchAllBatchesWorkloadsThunk.pending, handleFetchBatchesPending)
      .addCase(fetchAllBatchesWorkloadsThunk.fulfilled, handleFetchBatchesFulfilled)
      .addCase(fetchAllBatchesWorkloadsThunk.rejected, handleFetchBatchesRejected)
      // Trigger Sync
      .addCase(triggerAppsSyncThunk.rejected, handleTriggerSyncRejected)
      // Update Sync Mode
      .addCase(updateAppWorkloadSyncModeThunk.fulfilled, handleUpdateSyncModeFulfilled)
      .addCase(updateAppWorkloadSyncModeThunk.rejected, handleUpdateSyncModeRejected);
  },
});

export const { clearWorkloads, clearWorkloadDetails, setWorkloadError, startSync, endSync } = workloadSlice.actions;
export default workloadSlice.reducer;
