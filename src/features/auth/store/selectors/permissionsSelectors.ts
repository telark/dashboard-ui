import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/index';

export const selectPermissionsState = (state: RootState) => state.permissions;

export const selectPermissionsLoading = createSelector([selectPermissionsState], (p) => p.loading);

export const selectPermissionsError = createSelector([selectPermissionsState], (p) => p.error);

export const selectPermissionsReady = createSelector([selectPermissionsState], (p) => p.ready);
