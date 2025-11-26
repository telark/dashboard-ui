import { PayloadAction } from '@reduxjs/toolkit';
import type { GroupsState, Group } from '../../models';

export const handleCreateGroupFulfilled = (state: GroupsState, action: PayloadAction<Group>) => {
  state.groups.push(action.payload);
  state.details = action.payload;
  state.error = null;
};

export const handleCreateGroupRejected = (state: GroupsState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
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

export const handleUpdateGroupRejected = (state: GroupsState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};

export const handleDeleteGroupFulfilled = (state: GroupsState, action: PayloadAction<string>) => {
  const deletedId = action.payload;
  state.groups = state.groups.filter((group) => group.id !== deletedId);
  if (state.details?.id === deletedId) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteGroupRejected = (state: GroupsState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};
