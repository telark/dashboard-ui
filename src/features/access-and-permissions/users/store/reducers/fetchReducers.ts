import { PayloadAction } from '@reduxjs/toolkit';
import type { UsersState } from '../../models';

export const handleFetchUsersPending = (state: UsersState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchUsersFulfilled = (state: UsersState, action: PayloadAction<any[]>) => {
  state.loading = false;
  state.users = action.payload;
  state.error = null;
  const liveIds = new Set(action.payload.map((u) => u.id));
  state.deletingIds = state.deletingIds.filter((id) => liveIds.has(id));
};

export const handleFetchUsersRejected = (state: UsersState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchUserDetailsPending = (state: UsersState) => {
  state.loading = true;
  state.details = null; // Clear details on new fetch
  state.error = null;
};

export const handleFetchUserDetailsFulfilled = (state: UsersState, action: PayloadAction<any>) => {
  state.loading = false;
  const updatedUser = action.payload;
  state.details = updatedUser; // Populate details with fresh data

  // Also update the user in the list if it exists
  const index = state.users.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    state.users[index] = updatedUser;
  }
};

export const handleFetchUserDetailsRejected = (state: UsersState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};
