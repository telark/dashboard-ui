import { createSlice } from '@reduxjs/toolkit';
import type { UsersState } from '../../models';
import {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/fetchThunks';
import { createUserThunk, updateUserThunk, deleteUserThunk } from '../thunks/mutationThunks';
import {
  handleFetchUsersPending,
  handleFetchUsersFulfilled,
  handleFetchUsersRejected,
  handleFetchUserDetailsPending,
  handleFetchUserDetailsFulfilled,
  handleFetchUserDetailsRejected,
} from '../reducers/fetchReducers';
import {
  handleCreateUserFulfilled,
  handleUpdateUserFulfilled,
  handleDeleteUserPending,
  handleDeleteUserFulfilled,
  handleDeleteUserRejected,
} from '../reducers/mutationReducers';

export {
  fetchAllUsersThunk,
  fetchAllUsersSilentThunk,
  fetchUserDetailsThunk,
} from '../thunks/fetchThunks';

export { createUserThunk, updateUserThunk, deleteUserThunk } from '../thunks/mutationThunks';

const initialState: UsersState = {
  users: [],
  details: null,
  loading: false,
  loaded: false,
  error: null,
  deletingIds: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsersThunk.pending, handleFetchUsersPending)
      .addCase(fetchAllUsersThunk.fulfilled, handleFetchUsersFulfilled)
      .addCase(fetchAllUsersThunk.rejected, handleFetchUsersRejected)
      .addCase(fetchAllUsersSilentThunk.fulfilled, handleFetchUsersFulfilled)
      .addCase(fetchUserDetailsThunk.pending, handleFetchUserDetailsPending)
      .addCase(fetchUserDetailsThunk.fulfilled, handleFetchUserDetailsFulfilled)
      .addCase(fetchUserDetailsThunk.rejected, handleFetchUserDetailsRejected)
      .addCase(createUserThunk.fulfilled, handleCreateUserFulfilled)
      .addCase(updateUserThunk.fulfilled, handleUpdateUserFulfilled)
      .addCase(deleteUserThunk.pending, handleDeleteUserPending)
      .addCase(deleteUserThunk.fulfilled, handleDeleteUserFulfilled)
      .addCase(deleteUserThunk.rejected, handleDeleteUserRejected);
  },
});

export const { clearDetails } = userSlice.actions;

export default userSlice.reducer;
