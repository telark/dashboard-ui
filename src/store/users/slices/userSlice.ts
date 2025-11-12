import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../../interfaces/users';
import {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
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
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
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
    setUserDetails: (state, action: PayloadAction<User | null>) => {
      state.details = action.payload;
    },
    clearUserDetails: (state) => {
      state.details = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch all users (silent)
      .addCase(fetchAllUsersSilentThunk.pending, (state) => {
        // Don't set loading for silent fetches
      })
      .addCase(fetchAllUsersSilentThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllUsersSilentThunk.rejected, (state) => {
        // Don't set error for silent fetches
      });
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setUserDetails,
  clearUserDetails,
  setLoading,
  setError,
} = userSlice.actions;

export { fetchAllUsersThunk, fetchAllUsersSilentThunk } from '../thunks/FetchThunks';

export default userSlice.reducer;
