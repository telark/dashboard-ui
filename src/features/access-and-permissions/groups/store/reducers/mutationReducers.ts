import { PayloadAction } from '@reduxjs/toolkit';
import type { GroupsState, Group } from '../../models';

export const handleCreateGroupFulfilled = (state: GroupsState, action: PayloadAction<Group>) => {
  state.groups.push(action.payload);
  state.details = action.payload;
  state.error = null;
};

export const handleUpdateGroupFulfilled = (state: GroupsState, action: PayloadAction<Group>) => {
  const updatedGroup = action.payload;
  const index = state.groups.findIndex((group) => group.id === updatedGroup.id);
  if (index !== -1) {
    state.groups[index] = updatedGroup;
  }
  if (state.details?.id === updatedGroup.id) {
    state.details = updatedGroup;
  }
  state.error = null;
};

export const handleDeleteGroupPending = (state: GroupsState, action: { meta: { arg: string } }) => {
  const id = action.meta.arg;
  if (id && !state.deletingIds.includes(id)) {
    state.deletingIds.push(id);
  }
};

export const handleDeleteGroupFulfilled = (state: GroupsState, action: PayloadAction<string>) => {
  const deletedId = action.payload;
  state.groups = state.groups.filter((group) => group.id !== deletedId);
  state.deletingIds = state.deletingIds.filter((id) => id !== deletedId);
  if (state.details?.id === deletedId) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteGroupRejected = (
  state: GroupsState,
  action: PayloadAction<unknown, string, { arg: string }>,
) => {
  state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
};
