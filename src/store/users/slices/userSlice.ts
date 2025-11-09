import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsersState, User } from '../../../interfaces/users';

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
export default userSlice.reducer;
