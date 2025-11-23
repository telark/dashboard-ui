import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BridgeState } from '../../models';
import {
  fetchAllBridgesThunk,
  fetchAllBridgesSilentThunk,
  fetchBridgeDetailsThunk,
} from '../thunks/fetchThunks';
import {
  triggerBridgesSyncThunk,
  refreshAutoBridgesThunk,
  updateBridgeSyncModeThunk,
} from '../thunks/syncThunks';
import {
  handleFetchBridgesPending,
  handleFetchBridgesFulfilled,
  handleFetchBridgesRejected,
  handleFetchBridgesSilentPending,
  handleFetchBridgesSilentFulfilled,
  handleFetchBridgesSilentRejected,
  handleFetchBridgeDetailsPending,
  handleFetchBridgeDetailsFulfilled,
  handleFetchBridgeDetailsRejected,
} from '../reducers/fetchReducers';
import {
  handleTriggerSyncRejected,
  handleRefreshAutoBridgesFulfilled,
  handleRefreshAutoBridgesRejected,
  handleUpdateSyncModeFulfilled,
  handleUpdateSyncModeRejected,
} from '../reducers/syncReducers';

const initialState: BridgeState = {
  bridges: [],
  details: null,
  loading: false,
  error: null,
  syncing: {},
};

const bridgeSlice = createSlice({
  name: 'bridge',
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
      // Fetch Bridges
      .addCase(fetchAllBridgesThunk.pending, handleFetchBridgesPending)
      .addCase(fetchAllBridgesThunk.fulfilled, handleFetchBridgesFulfilled)
      .addCase(fetchAllBridgesThunk.rejected, handleFetchBridgesRejected)
      // Silent Fetch Bridges (for retry attempts)
      .addCase(fetchAllBridgesSilentThunk.pending, handleFetchBridgesSilentPending)
      .addCase(fetchAllBridgesSilentThunk.fulfilled, handleFetchBridgesSilentFulfilled)
      .addCase(fetchAllBridgesSilentThunk.rejected, handleFetchBridgesSilentRejected)
      // Trigger Sync (no state changes, but could be used for UI feedback)
      .addCase(triggerBridgesSyncThunk.rejected, handleTriggerSyncRejected)
      // Refresh Auto Bridges
      .addCase(refreshAutoBridgesThunk.fulfilled, handleRefreshAutoBridgesFulfilled)
      .addCase(refreshAutoBridgesThunk.rejected, handleRefreshAutoBridgesRejected)
      // Update Bridge Sync
      .addCase(updateBridgeSyncModeThunk.fulfilled, handleUpdateSyncModeFulfilled)
      .addCase(updateBridgeSyncModeThunk.rejected, handleUpdateSyncModeRejected)
      // Fetch Bridge Details
      .addCase(fetchBridgeDetailsThunk.pending, handleFetchBridgeDetailsPending)
      .addCase(fetchBridgeDetailsThunk.fulfilled, handleFetchBridgeDetailsFulfilled)
      .addCase(fetchBridgeDetailsThunk.rejected, handleFetchBridgeDetailsRejected);
  },
});

export const { clearDetails, startSync, endSync } = bridgeSlice.actions;
export default bridgeSlice.reducer;

