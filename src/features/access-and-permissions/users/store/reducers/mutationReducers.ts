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
