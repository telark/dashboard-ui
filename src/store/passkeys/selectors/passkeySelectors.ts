import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';

export const selectPasskeyState = (state: RootState) => state.passkeys;
export const selectPasskeys = createSelector([selectPasskeyState], (passkeys) => passkeys.passkeys);
export const selectPasskeyDetails = createSelector(
  [selectPasskeyState],
  (passkeys) => passkeys.details,
);
export const selectPasskeyLoading = createSelector(
  [selectPasskeyState],
  (passkeys) => passkeys.loading,
);
export const selectPasskeyError = createSelector(
  [selectPasskeyState],
  (passkeys) => passkeys.error,
);
export const selectPasskeyDetailsData = createSelector(
  [selectPasskeyDetails, selectPasskeyLoading, selectPasskeyError],
  (details, loading, error) => ({ details, loading, error }),
);

