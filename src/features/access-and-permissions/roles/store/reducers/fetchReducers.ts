import { PayloadAction } from '@reduxjs/toolkit';
import type { RolesState, Role } from '../../models';

export const handleFetchRolesPending = (state: RolesState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchRolesFulfilled = (state: RolesState, action: PayloadAction<Role[]>) => {
  state.loading = false;
  state.roles = action.payload;
  state.error = null;
};

export const handleFetchRolesRejected = (state: RolesState, action: PayloadAction<unknown>) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleFetchRoleDetailsPending = (state: RolesState) => {
  state.loading = true;
  state.details = null;
  state.error = null;
};

export const handleFetchRoleDetailsFulfilled = (state: RolesState, action: PayloadAction<Role>) => {
  state.loading = false;
  const updatedRole = action.payload;
  state.details = updatedRole;

  const index = state.roles.findIndex((role) => role.id === updatedRole.id);
  if (index !== -1) {
    state.roles[index] = updatedRole;
  }
};

export const handleFetchRoleDetailsRejected = (
  state: RolesState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
