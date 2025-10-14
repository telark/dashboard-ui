import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrouperState } from '../../interfaces/grouper';

// Import thunks
import {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  fetchGrouperDetailsThunk,
  checkGrouperMaintenanceModeThunk,
} from '../thunks/grouperFetchThunks';
import {
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
  updateGrouperSyncModeThunk,
} from '../thunks/grouperSyncThunks';
import {
  enableGrouperMaintenanceModeThunk,
  updateGrouperMaintenanceModeThunk,
  removeGrouperMaintenanceModeThunk,
} from '../thunks/grouperMaintenanceThunks';

// Import reducers
import {
  handleFetchGroupersPending,
  handleFetchGroupersFulfilled,
  handleFetchGroupersRejected,
  handleFetchGroupersSilentPending,
  handleFetchGroupersSilentFulfilled,
  handleFetchGroupersSilentRejected,
  handleFetchGrouperDetailsPending,
  handleFetchGrouperDetailsFulfilled,
  handleFetchGrouperDetailsRejected,
  handleCheckMaintenanceModeFulfilled,
} from '../reducers/grouperFetchReducers';
import {
  handleTriggerSyncRejected,
  handleRefreshAutoGroupersFulfilled,
  handleRefreshAutoGroupersRejected,
  handleUpdateSyncModeFulfilled,
  handleUpdateSyncModeRejected,
} from '../reducers/grouperSyncReducers';
import {
  handleUpdateMaintenanceModePending,
  handleUpdateMaintenanceModeFulfilled,
  handleUpdateMaintenanceModeRejected,
  handleEnableMaintenanceModeFulfilled,
  handleEnableMaintenanceModeRejected,
  handleRemoveMaintenanceModeFulfilled,
  handleRemoveMaintenanceModeRejected,
} from '../reducers/grouperMaintenanceReducers';

const initialState: GrouperState = {
  groupers: [],
  details: null,
  loading: false,
  error: null,
  // Track in-flight syncs by grouper name
  syncing: {},
};

// Re-export thunks for external use
export {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  fetchGrouperDetailsThunk,
  checkGrouperMaintenanceModeThunk,
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
  updateGrouperSyncModeThunk,
  enableGrouperMaintenanceModeThunk,
  updateGrouperMaintenanceModeThunk,
  removeGrouperMaintenanceModeThunk,
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
      .addCase(fetchAllGroupersSilentThunk.fulfilled, handleFetchGroupersSilentFulfilled)
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
