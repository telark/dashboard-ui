import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../store/index';

export const selectBridgeState = (state: RootState) => state.bridge;
export const selectBridgeDetails = createSelector([selectBridgeState], (bridge) => bridge.details);
export const selectBridgeLoading = createSelector([selectBridgeState], (bridge) => bridge.loading);
export const selectBridgeError = createSelector([selectBridgeState], (bridge) => bridge.error);
export const selectBridgeDetailsData = createSelector(
  [selectBridgeDetails, selectBridgeLoading, selectBridgeError],
  (details, loading, error) => ({ details, loading, error }),
);

