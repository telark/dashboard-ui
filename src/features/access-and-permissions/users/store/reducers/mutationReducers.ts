import { PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../models';

export const handleCreateUserFulfilled = (state: UsersState, action: PayloadAction<User>) => {
  state.users.push(action.payload);
  state.details = action.payload;
  state.error = null;
};

export const handleCreateUserRejected = (state: UsersState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};

export const handleUpdateUserFulfilled = (state: UsersState, action: PayloadAction<User>) => {
  const index = state.users.findIndex((u) => u.id === action.payload.id);
  if (index !== -1) {
    state.users[index] = action.payload;
  }
  if (state.details?.id === action.payload.id) {
    state.details = action.payload;
  }
  state.error = null;
};

export const handleUpdateUserRejected = (state: UsersState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};

export const handleDeleteUserPending = (state: UsersState, action: { meta: { arg: string } }) => {
  const id = action.meta.arg;
  if (id && !state.deletingIds.includes(id)) {
    state.deletingIds.push(id);
  }
};

export const handleDeleteUserFulfilled = (state: UsersState, action: PayloadAction<string>) => {
  if (state.details?.id === action.payload) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteUserRejected = (
  state: UsersState,
  action: PayloadAction<unknown, string, { arg: string }>,
) => {
  state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
  state.error = action.payload as string;
};
