import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrouperState } from '../../../interfaces/grouper';
import {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  fetchGrouperDetailsThunk,
  checkGrouperMaintenanceModeThunk,
} from '../thunks/FetchThunks';
import {
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
  updateGrouperSyncModeThunk,
} from '../thunks/SyncThunks';
import {
  enableGrouperMaintenanceModeThunk,
  updateGrouperMaintenanceModeThunk,
  removeGrouperMaintenanceModeThunk,
} from '../thunks/MaintenanceThunks';
import {
  handleFetchGroupersPending,
  handleFetchGroupersFulfilled,
  handleFetchGroupersRejected,
  handleFetchGroupersSilentPending,
  handleFetchGroupersSilentRejected,
  handleFetchGrouperDetailsPending,
  handleFetchGrouperDetailsFulfilled,
  handleFetchGrouperDetailsRejected,
  handleCheckMaintenanceModeFulfilled,
} from '../reducers/FetchReducers';
import {
  handleTriggerSyncRejected,
  handleRefreshAutoGroupersFulfilled,
  handleRefreshAutoGroupersRejected,
  handleUpdateSyncModeFulfilled,
  handleUpdateSyncModeRejected,
} from '../reducers/SyncReducers';
import {
  handleUpdateMaintenanceModePending,
  handleUpdateMaintenanceModeFulfilled,
  handleUpdateMaintenanceModeRejected,
  handleEnableMaintenanceModeFulfilled,
  handleEnableMaintenanceModeRejected,
  handleRemoveMaintenanceModeFulfilled,
  handleRemoveMaintenanceModeRejected,
} from '../reducers/MaintenanceReducer';

export {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  fetchGrouperDetailsThunk,
  checkGrouperMaintenanceModeThunk,
} from '../thunks/FetchThunks';
export {
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
  updateGrouperSyncModeThunk,
} from '../thunks/SyncThunks';
export {
  enableGrouperMaintenanceModeThunk,
  updateGrouperMaintenanceModeThunk,
  removeGrouperMaintenanceModeThunk,
} from '../thunks/MaintenanceThunks';

const initialState: GrouperState = {
  groupers: [],
  details: null,
  loading: false,
  error: null,
  syncing: {},
};

const grouperSlice = createSlice({
  name: 'grouper',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null; // Clear previous details to avoid stale data
    },
    startSync(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name) state.syncing[name] = true;
    },
    endSync(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name && state.syncing[name]) delete state.syncing[name];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groupers
      .addCase(fetchAllGroupersThunk.pending, handleFetchGroupersPending)
      .addCase(fetchAllGroupersThunk.fulfilled, handleFetchGroupersFulfilled)
      .addCase(fetchAllGroupersThunk.rejected, handleFetchGroupersRejected)
      // Silent Fetch Groupers (for retry attempts)
      .addCase(fetchAllGroupersSilentThunk.pending, handleFetchGroupersSilentPending)
      .addCase(fetchAllGroupersSilentThunk.fulfilled, handleFetchGroupersFulfilled)
      .addCase(fetchAllGroupersSilentThunk.rejected, handleFetchGroupersSilentRejected)
      // Trigger Sync (no state changes, but could be used for UI feedback)
      .addCase(triggerGroupersSyncThunk.rejected, handleTriggerSyncRejected)
      // Refresh Auto Groupers
      .addCase(refreshAutoGroupersThunk.fulfilled, handleRefreshAutoGroupersFulfilled)
      .addCase(refreshAutoGroupersThunk.rejected, handleRefreshAutoGroupersRejected)
      // Update Grouper Sync
      .addCase(updateGrouperSyncModeThunk.fulfilled, handleUpdateSyncModeFulfilled)
      .addCase(updateGrouperSyncModeThunk.rejected, handleUpdateSyncModeRejected)
      // Fetch Grouper Details
      .addCase(fetchGrouperDetailsThunk.pending, handleFetchGrouperDetailsPending)
      .addCase(fetchGrouperDetailsThunk.fulfilled, handleFetchGrouperDetailsFulfilled)
      .addCase(fetchGrouperDetailsThunk.rejected, handleFetchGrouperDetailsRejected)
      // Check Maintenance Mode
      .addCase(checkGrouperMaintenanceModeThunk.fulfilled, handleCheckMaintenanceModeFulfilled)
      // Update Maintenance Mode
      .addCase(updateGrouperMaintenanceModeThunk.pending, handleUpdateMaintenanceModePending)
      .addCase(updateGrouperMaintenanceModeThunk.fulfilled, handleUpdateMaintenanceModeFulfilled)
      .addCase(updateGrouperMaintenanceModeThunk.rejected, handleUpdateMaintenanceModeRejected)
      // Enable Maintenance Mode
      .addCase(enableGrouperMaintenanceModeThunk.fulfilled, handleEnableMaintenanceModeFulfilled)
      .addCase(enableGrouperMaintenanceModeThunk.rejected, handleEnableMaintenanceModeRejected)
      // Remove Maintenance Mode
      .addCase(removeGrouperMaintenanceModeThunk.fulfilled, handleRemoveMaintenanceModeFulfilled)
      .addCase(removeGrouperMaintenanceModeThunk.rejected, handleRemoveMaintenanceModeRejected);
  },
});

export const { clearDetails, startSync, endSync } = grouperSlice.actions;
export default grouperSlice.reducer;
