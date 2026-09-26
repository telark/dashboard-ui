import { createSlice } from '@reduxjs/toolkit';
import type { GroupsState } from '../../models';
import {
  fetchAllGroupsThunk,
  fetchAllGroupsSilentThunk,
  fetchGroupDetailsThunk,
} from '../thunks/fetchThunks';
import { createGroupThunk, updateGroupThunk, deleteGroupThunk } from '../thunks/mutationThunks';
import {
  handleFetchGroupsPending,
  handleFetchGroupsFulfilled,
  handleFetchGroupsRejected,
  handleFetchGroupDetailsPending,
  handleFetchGroupDetailsFulfilled,
  handleFetchGroupDetailsRejected,
} from '../reducers/fetchReducers';
import {
  handleCreateGroupFulfilled,
  handleUpdateGroupFulfilled,
  handleDeleteGroupPending,
  handleDeleteGroupFulfilled,
  handleDeleteGroupRejected,
} from '../reducers/mutationReducers';

const initialState: GroupsState = {
  groups: [],
  details: null,
  loading: false,
  error: null,
  deletingIds: [],
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroupDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroupsThunk.pending, handleFetchGroupsPending)
      .addCase(fetchAllGroupsThunk.fulfilled, handleFetchGroupsFulfilled)
      .addCase(fetchAllGroupsThunk.rejected, handleFetchGroupsRejected)
      .addCase(fetchAllGroupsSilentThunk.pending, handleFetchGroupsPending)
      .addCase(fetchAllGroupsSilentThunk.fulfilled, handleFetchGroupsFulfilled)
      .addCase(fetchAllGroupsSilentThunk.rejected, handleFetchGroupsRejected)
      .addCase(fetchGroupDetailsThunk.pending, handleFetchGroupDetailsPending)
      .addCase(fetchGroupDetailsThunk.fulfilled, handleFetchGroupDetailsFulfilled)
      .addCase(fetchGroupDetailsThunk.rejected, handleFetchGroupDetailsRejected)
      .addCase(createGroupThunk.fulfilled, handleCreateGroupFulfilled)
      .addCase(updateGroupThunk.fulfilled, handleUpdateGroupFulfilled)
      .addCase(deleteGroupThunk.pending, handleDeleteGroupPending)
      .addCase(deleteGroupThunk.fulfilled, handleDeleteGroupFulfilled)
      .addCase(deleteGroupThunk.rejected, handleDeleteGroupRejected);
  },
});

export const { clearGroupDetails } = groupSlice.actions;
export default groupSlice.reducer;
