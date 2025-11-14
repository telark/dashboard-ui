import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WorkloadsState } from '../../../interfaces/resources/workload';
import {
  fetchAllAppsWorkloadsThunk,
  fetchAllBatchesWorkloadsThunk,
  fetchAppWorkloadDetailsThunk,
} from '../thunks/FetchThunks';
import {
  triggerAppsSyncThunk,
  refreshAutoAppsThunk,
  updateAppWorkloadSyncModeThunk,
} from '../thunks/SyncThunks';
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
  handleRefreshAutoAppsFulfilled,
  handleRefreshAutoAppsRejected,
  handleUpdateSyncModeFulfilled,
  handleUpdateSyncModeRejected,
} from '../reducers/SyncReducers';

export {
  fetchAllAppsWorkloadsThunk,
  fetchAllBatchesWorkloadsThunk,
  fetchAppWorkloadDetailsThunk,
} from '../thunks/FetchThunks';
export {
  triggerAppsSyncThunk,
  refreshAutoAppsThunk,
  updateAppWorkloadSyncModeThunk,
} from '../thunks/SyncThunks';

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

const workloadSlice = createSlice({
  name: 'workloads',
  initialState,
  reducers: {
    clearWorkloadDetails: (state) => {
      state.appDetails = null;
      state.appError = null;
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
      // Refresh Auto Apps
      .addCase(refreshAutoAppsThunk.fulfilled, handleRefreshAutoAppsFulfilled)
      .addCase(refreshAutoAppsThunk.rejected, handleRefreshAutoAppsRejected)
      // Update Sync Mode
      .addCase(updateAppWorkloadSyncModeThunk.fulfilled, handleUpdateSyncModeFulfilled)
      .addCase(updateAppWorkloadSyncModeThunk.rejected, handleUpdateSyncModeRejected);
  },
});

export const { clearWorkloadDetails, startSync, endSync } = workloadSlice.actions;
export default workloadSlice.reducer;
