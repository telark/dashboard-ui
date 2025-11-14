import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectUserState = (state: RootState) => state.users;
export const selectUserDetails = createSelector([selectUserState], (users) => users.details);
export const selectUserLoading = createSelector([selectUserState], (users) => users.loading);
export const selectUserError = createSelector([selectUserState], (users) => users.error);
export const selectUserDetailsData = createSelector(
  [selectUserDetails, selectUserLoading, selectUserError],
  (details, loading, error) => ({ details, loading, error }),
);
