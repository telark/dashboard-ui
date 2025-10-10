import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
export const selectWorkloadState = (state: RootState) => state.workload;

// Memoized selectors for better performance
export const selectWorkloadDetails = createSelector(
  [selectWorkloadState],
  (workload) => workload.details
);

export const selectWorkloadLoading = createSelector(
  [selectWorkloadState],
  (workload) => workload.loading
);

export const selectWorkloadError = createSelector(
  [selectWorkloadState],
  (workload) => workload.error
);

export const selectWorkloadSyncData = createSelector(
  [selectWorkloadDetails],
  (details) => details?.config?.sync
);

// Combined selector for details hook
export const selectWorkloadDetailsData = createSelector(
  [selectWorkloadDetails, selectWorkloadLoading, selectWorkloadError],
  (details, loading, error) => ({ details, loading, error })
);
