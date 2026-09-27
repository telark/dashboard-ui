import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../store/index';

export const selectPasskeyState = (state: RootState) => state.passkeys;
export const selectPasskeys = createSelector([selectPasskeyState], (passkeys) => passkeys.passkeys);
export const selectPasskeyLoading = createSelector(
  [selectPasskeyState],
  (passkeys) => passkeys.loading,
);
export const selectPasskeyError = createSelector(
  [selectPasskeyState],
  (passkeys) => passkeys.error,
);
