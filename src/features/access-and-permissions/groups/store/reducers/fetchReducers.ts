import { PayloadAction } from '@reduxjs/toolkit';
import type { GroupsState, Group } from '../../models';

export const handleFetchGroupsPending = (state: GroupsState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchGroupsFulfilled = (state: GroupsState, action: PayloadAction<Group[]>) => {
  state.loading = false;
  state.groups = action.payload;
  state.error = null;
  const liveIds = new Set(action.payload.map((g) => g.id));
  state.deletingIds = state.deletingIds.filter((id) => liveIds.has(id));
};

export const handleFetchGroupsRejected = (state: GroupsState, action: PayloadAction<unknown>) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleFetchGroupDetailsPending = (state: GroupsState) => {
  state.loading = true;
  state.details = null;
  state.error = null;
};

export const handleFetchGroupDetailsFulfilled = (
  state: GroupsState,
  action: PayloadAction<Group>,
) => {
  state.loading = false;
  const updatedGroup = action.payload;
  state.details = updatedGroup;

  const index = state.groups.findIndex((group) => group.id === updatedGroup.id);
  if (index !== -1) {
    state.groups[index] = updatedGroup;
  }
};

export const handleFetchGroupDetailsRejected = (
  state: GroupsState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
