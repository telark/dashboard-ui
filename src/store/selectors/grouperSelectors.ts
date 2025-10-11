import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
export const selectGrouperState = (state: RootState) => state.grouper;

// Memoized selectors for better performance
export const selectGrouperDetails = createSelector(
  [selectGrouperState],
  (grouper) => grouper.details,
);

export const selectGrouperLoading = createSelector(
  [selectGrouperState],
  (grouper) => grouper.loading,
);

export const selectGrouperError = createSelector([selectGrouperState], (grouper) => grouper.error);

export const selectGrouperSyncData = createSelector(
  [selectGrouperDetails],
  (details) => details?.sync,
);

export const selectGrouperMaintenanceData = createSelector(
  [selectGrouperDetails],
  (details) => details?.maintenance,
);

// Combined selector for details hook
export const selectGrouperDetailsData = createSelector(
  [selectGrouperDetails, selectGrouperLoading, selectGrouperError],
  (details, loading, error) => ({ details, loading, error }),
);
