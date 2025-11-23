import { PayloadAction } from '@reduxjs/toolkit';
import type { BridgeState } from '../../models';

export const handleFetchBridgesPending = (state: BridgeState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchBridgesFulfilled = (state: BridgeState, action: PayloadAction<any[]>) => {
  state.loading = false;
  state.bridges = action.payload;
};

export const handleFetchBridgesRejected = (state: BridgeState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchBridgesSilentPending = (state: BridgeState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchBridgesSilentFulfilled = (
  state: BridgeState,
  action: PayloadAction<any[]>,
) => {
  state.loading = false;
  state.bridges = action.payload;
};

export const handleFetchBridgesSilentRejected = (
  state: BridgeState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchBridgeDetailsPending = (state: BridgeState) => {
  state.loading = true;
  state.details = null; // Clear details on new fetch
  state.error = null;
};

export const handleFetchBridgeDetailsFulfilled = (
  state: BridgeState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  const updatedBridge = action.payload;
  state.details = updatedBridge; // Populate details with fresh data

  // Also update the bridge in the list if it exists (for card view refresh)
  const index = state.bridges.findIndex((bridge) => bridge.name === updatedBridge.name);
  if (index !== -1) {
    state.bridges[index] = updatedBridge;
  }
};

export const handleFetchBridgeDetailsRejected = (
  state: BridgeState,
  action: PayloadAction<any>,
) => {
  state.loading = false;
  state.error = action.payload;
};
