import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../../store/index';

export const selectGrouperState = (state: RootState) => state.grouper;
export const selectGrouperDetails = createSelector(
  [selectGrouperState],
  (grouper) => grouper.details,
);
export const selectGrouperLoading = createSelector(
  [selectGrouperState],
  (grouper) => grouper.loading,
);
export const selectGrouperError = createSelector([selectGrouperState], (grouper) => grouper.error);
export const selectGrouperDetailsData = createSelector(
  [selectGrouperDetails, selectGrouperLoading, selectGrouperError],
  (details, loading, error) => ({ details, loading, error }),
);
