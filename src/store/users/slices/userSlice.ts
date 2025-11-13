import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../../interfaces/users';
import {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/FetchThunks';
import {
  handleFetchUsersPending,
  handleFetchUsersFulfilled,
  handleFetchUsersRejected,
  handleFetchUsersSilentPending,
  handleFetchUsersSilentRejected,
  handleFetchUserDetailsPending,
  handleFetchUserDetailsFulfilled,
  handleFetchUserDetailsRejected,
} from '../reducers/FetchReducers';

export {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/FetchThunks';

const initialState: UsersState = {
  users: [],
  details: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null; // Clear previous details to avoid stale data
    },
    // Keep these actions for backward compatibility with existing code
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsersThunk.pending, handleFetchUsersPending)
      .addCase(fetchAllUsersThunk.fulfilled, handleFetchUsersFulfilled)
      .addCase(fetchAllUsersThunk.rejected, handleFetchUsersRejected)
      // Fetch all users (silent)
      .addCase(fetchAllUsersSilentThunk.pending, handleFetchUsersSilentPending)
      .addCase(fetchAllUsersSilentThunk.fulfilled, handleFetchUsersFulfilled)
      .addCase(fetchAllUsersSilentThunk.rejected, handleFetchUsersSilentRejected)
      // Fetch user details
      .addCase(fetchUserDetailsThunk.pending, handleFetchUserDetailsPending)
      .addCase(fetchUserDetailsThunk.fulfilled, handleFetchUserDetailsFulfilled)
      .addCase(fetchUserDetailsThunk.rejected, handleFetchUserDetailsRejected);
  },
});

export const { clearDetails, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
