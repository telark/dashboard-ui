import { createSlice } from '@reduxjs/toolkit';
import type { RolesState } from '../../models';
import {
  fetchAllRolesThunk,
  fetchAllRolesSilentThunk,
  fetchRoleDetailsThunk,
} from '../thunks/fetchThunks';
import { createRoleThunk, updateRoleThunk, deleteRoleThunk } from '../thunks/mutationThunks';
import {
  handleFetchRolesPending,
  handleFetchRolesFulfilled,
  handleFetchRolesRejected,
  handleFetchRoleDetailsPending,
  handleFetchRoleDetailsFulfilled,
  handleFetchRoleDetailsRejected,
} from '../reducers/fetchReducers';
import {
  handleCreateRoleFulfilled,
  handleCreateRoleRejected,
  handleUpdateRoleFulfilled,
  handleUpdateRoleRejected,
  handleDeleteRoleFulfilled,
  handleDeleteRoleRejected,
} from '../reducers/mutationReducers';

const initialState: RolesState = {
  roles: [],
  details: null,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoleDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRolesThunk.pending, handleFetchRolesPending)
      .addCase(fetchAllRolesThunk.fulfilled, handleFetchRolesFulfilled)
      .addCase(fetchAllRolesThunk.rejected, handleFetchRolesRejected)
      .addCase(fetchAllRolesSilentThunk.pending, handleFetchRolesPending)
      .addCase(fetchAllRolesSilentThunk.fulfilled, handleFetchRolesFulfilled)
      .addCase(fetchAllRolesSilentThunk.rejected, handleFetchRolesRejected)
      .addCase(fetchRoleDetailsThunk.pending, handleFetchRoleDetailsPending)
      .addCase(fetchRoleDetailsThunk.fulfilled, handleFetchRoleDetailsFulfilled)
      .addCase(fetchRoleDetailsThunk.rejected, handleFetchRoleDetailsRejected)
      .addCase(createRoleThunk.fulfilled, handleCreateRoleFulfilled)
      .addCase(createRoleThunk.rejected, handleCreateRoleRejected)
      .addCase(updateRoleThunk.fulfilled, handleUpdateRoleFulfilled)
      .addCase(updateRoleThunk.rejected, handleUpdateRoleRejected)
      .addCase(deleteRoleThunk.fulfilled, handleDeleteRoleFulfilled)
      .addCase(deleteRoleThunk.rejected, handleDeleteRoleRejected);
  },
});

export const { clearRoleDetails } = roleSlice.actions;
export default roleSlice.reducer;
