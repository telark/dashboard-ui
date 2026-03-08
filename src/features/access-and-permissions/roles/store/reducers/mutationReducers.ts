import { PayloadAction } from '@reduxjs/toolkit';
import type { RolesState, Role } from '../../models';

export const handleCreateRoleFulfilled = (state: RolesState, action: PayloadAction<Role>) => {
  state.roles.push(action.payload);
  state.details = action.payload;
  state.error = null;
};

export const handleCreateRoleRejected = (state: RolesState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
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

export const handleUpdateRoleRejected = (state: RolesState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};

export const handleDeleteRoleFulfilled = (state: RolesState, action: PayloadAction<string>) => {
  const deletedId = action.payload;
  state.roles = state.roles.filter((role) => role.id !== deletedId);
  if (state.details?.id === deletedId) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteRoleRejected = (state: RolesState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};
