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

export const handleDeleteUserFulfilled = (state: UsersState, action: PayloadAction<string>) => {
  state.users = state.users.filter((u) => u.id !== action.payload);
  if (state.details?.id === action.payload) {
    state.details = null;
  }
  state.error = null;
};

export const handleDeleteUserRejected = (state: UsersState, action: PayloadAction<unknown>) => {
  state.error = action.payload as string;
};
