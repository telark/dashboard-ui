import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store/index';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';

export const selectPermissionsState = (state: RootState) => state.permissions;

export const selectPermissionsLoading = createSelector([selectPermissionsState], (p) => p.loading);

export const selectPermissionsError = createSelector([selectPermissionsState], (p) => p.error);

export const selectResolvedRoles = createSelector([selectPermissionsState], (p) => p.roles);

export const selectScopeIndex = createSelector([selectPermissionsState], (p) => p.scopeIndex);

/** Returns true if user has the scope at >= minimumLevel and the given deny-rule is absent. */
export const makeSelectHasPermission = (
  scope: string,
  minimumLevel: PermissionLevel,
  denyRule?: string,
) =>
  createSelector([selectScopeIndex], (index) => {
    const entry = index[scope];
    if (!entry) return false;
    if (PERMISSION_LEVEL_RANK[entry.level] < PERMISSION_LEVEL_RANK[minimumLevel]) return false;
    if (denyRule && entry.rules.includes(denyRule)) return false;
    return true;
  });
