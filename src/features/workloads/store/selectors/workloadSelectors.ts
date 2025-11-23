import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../store/index';

export const selectWorkloadState = (state: RootState) => state.workload;
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

export const selectWorkloadDetailsData = createSelector(
  [selectAppWorkloadDetails, selectAppWorkloadLoading, selectAppWorkloadError],
  (details, loading, error) => ({ details, loading, error }),
);
