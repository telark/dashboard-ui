import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../../store';

export const selectApplicationsState = (state: RootState) => state.applications;

export const selectApplications = createSelector(
  [selectApplicationsState],
  (s) => s.applications,
);

export const selectApplicationDetails = createSelector(
  [selectApplicationsState],
  (s) => s.details,
);

export const selectApplicationsLoading = createSelector(
  [selectApplicationsState],
  (s) => s.loading,
);

export const selectApplicationsError = createSelector(
  [selectApplicationsState],
  (s) => s.error,
);

export const selectApplicationDetailsData = createSelector(
  [selectApplicationDetails, selectApplicationsLoading, selectApplicationsError],
  (details, loading, error) => ({ details, loading, error }),
);

