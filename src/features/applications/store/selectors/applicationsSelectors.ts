import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export const selectApplicationsState = (state: RootState) => state.applications;

export const selectApplications = createSelector([selectApplicationsState], (s) => s.applications);

export const selectApplicationsLoading = createSelector(
  [selectApplicationsState],
  (s) => s.loading,
);
