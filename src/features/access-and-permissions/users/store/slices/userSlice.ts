import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../models';
import {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/fetchThunks';
import { createUserThunk } from '../thunks/mutationThunks';
import {
  handleFetchUsersPending,
  handleFetchUsersFulfilled,
  handleFetchUsersRejected,
  handleFetchUserDetailsPending,
  handleFetchUserDetailsFulfilled,
  handleFetchUserDetailsRejected,
} from '../reducers/fetchReducers';
import { handleCreateUserFulfilled, handleCreateUserRejected } from '../reducers/mutationReducers';

export {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/fetchThunks';

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
      // Fetch all users (silent) - only handle fulfilled, skip pending/rejected to avoid UI updates
      .addCase(fetchAllUsersSilentThunk.fulfilled, handleFetchUsersFulfilled)
      // Fetch user details
      .addCase(fetchUserDetailsThunk.pending, handleFetchUserDetailsPending)
      .addCase(fetchUserDetailsThunk.fulfilled, handleFetchUserDetailsFulfilled)
      .addCase(fetchUserDetailsThunk.rejected, handleFetchUserDetailsRejected)
      // Create user
      .addCase(createUserThunk.fulfilled, handleCreateUserFulfilled)
      .addCase(createUserThunk.rejected, handleCreateUserRejected);
  },
});

export const { clearDetails, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
