import { PayloadAction } from '@reduxjs/toolkit';
import type { RolesState, Role } from '../../models';

export const handleCreateRoleFulfilled = (state: RolesState, action: PayloadAction<Role>) => {
  state.roles.push(action.payload);
  state.details = action.payload;
  state.error = null;
};

export const handleUpdateRoleFulfilled = (state: RolesState, action: PayloadAction<Role>) => {
  const updatedRole = action.payload;
  const index = state.roles.findIndex((role) => role.id === updatedRole.id);
  if (index !== -1) {
    state.roles[index] = updatedRole;
  }
  if (state.details?.id === updatedRole.id) {
    state.details = updatedRole;
  }
  state.error = null;
};

export const handleDeleteRolePending = (state: RolesState, action: { meta: { arg: string } }) => {
  const id = action.meta.arg;
  if (id && !state.deletingIds.includes(id)) {
    state.deletingIds.push(id);
  }
};

export const handleDeleteRoleFulfilled = (state: RolesState, action: PayloadAction<string>) => {
  const deletedId = action.payload;
  state.roles = state.roles.filter((role) => role.id !== deletedId);
  state.deletingIds = state.deletingIds.filter((id) => id !== deletedId);
  if (state.details?.id === deletedId) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteRoleRejected = (
  state: RolesState,
  action: PayloadAction<unknown, string, { arg: string }>,
) => {
  state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
};
