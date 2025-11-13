import { PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from '../../../interfaces/users';

export const handleFetchUsersPending = (state: UsersState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchUsersFulfilled = (state: UsersState, action: PayloadAction<any[]>) => {
  state.loading = false;
  state.users = action.payload;
  state.error = null;
};

export const handleFetchUsersRejected = (state: UsersState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

export const handleFetchUsersSilentPending = (state: UsersState) => {
  // Don't set loading for silent fetches
};

export const handleFetchUsersSilentRejected = (state: UsersState, action: PayloadAction<any>) => {
  // Don't set error for silent fetches
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

