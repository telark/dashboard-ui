import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectBridgeState = (state: RootState) => state.bridge;

// Memoized selectors for better performance
export const selectBridgeDetails = createSelector([selectBridgeState], (bridge) => bridge.details);

export const selectBridgeLoading = createSelector([selectBridgeState], (bridge) => bridge.loading);

export const selectBridgeError = createSelector([selectBridgeState], (bridge) => bridge.error);

export const selectBridgeSyncData = createSelector(
  [selectBridgeDetails],
  (details) => details?.sync,
);

// Combined selector for details hook
export const selectBridgeDetailsData = createSelector(
  [selectBridgeDetails, selectBridgeLoading, selectBridgeError],
  (details, loading, error) => ({ details, loading, error }),
);
