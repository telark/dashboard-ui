import { PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../models';
import { keepUnchanged } from '../../../../../store/keepUnchanged';

export const handleFetchUsersPending = (state: UsersState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchUsersFulfilled = (state: UsersState, action: PayloadAction<User[]>) => {
  state.loading = false;
  state.loaded = true;
  state.users = keepUnchanged(state.users, action.payload, (item) => item.id);
  state.error = null;
  const liveIds = new Set(action.payload.map((u) => u.id));
  state.deletingIds = state.deletingIds.filter((id) => liveIds.has(id));
};

export const handleFetchUsersRejected = (state: UsersState, action: PayloadAction<unknown>) => {
  state.loading = false;
  state.error = action.payload as string;
};

export const handleFetchUserDetailsPending = (state: UsersState) => {
  state.loading = true;
  state.details = null;
  state.error = null;
};

export const handleFetchUserDetailsFulfilled = (state: UsersState, action: PayloadAction<User>) => {
  state.loading = false;
  const updatedUser = action.payload;
  state.details = updatedUser;

  const index = state.users.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    state.users[index] = updatedUser;
  }
};

export const handleFetchUserDetailsRejected = (
  state: UsersState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
