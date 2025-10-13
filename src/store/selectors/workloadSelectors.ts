import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
export const selectWorkloadState = (state: RootState) => state.workload;

// Memoized selectors for better performance
export const selectAppWorkloadDetails = createSelector(
  [selectWorkloadState],
  (workload) => workload.appDetails,
);

export const selectAppWorkloadLoading = createSelector(
  [selectWorkloadState],
  (workload) => workload.appLoading,
);

export const selectAppWorkloadError = createSelector(
  [selectWorkloadState],
  (workload) => workload.appError,
);

export const selectWorkloadSyncData = createSelector(
  [selectAppWorkloadDetails],
  (details) => details?.config?.sync,
);

// Combined selector for details hook
export const selectWorkloadDetailsData = createSelector(
  [selectAppWorkloadDetails, selectAppWorkloadLoading, selectAppWorkloadError],
  (details, loading, error) => ({ details, loading, error }),
);
