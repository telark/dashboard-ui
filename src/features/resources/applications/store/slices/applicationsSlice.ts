import { createSlice } from '@reduxjs/toolkit';
import type { ApplicationsState } from '../../models';
import {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
} from '../thunks/fetchThunks';
import {
  handleFetchApplicationsPending,
  handleFetchApplicationsFulfilled,
  handleFetchApplicationsRejected,
  handleFetchApplicationsSilentPending,
  handleFetchApplicationsSilentRejected,
  handleFetchApplicationDetailsPending,
  handleFetchApplicationDetailsFulfilled,
  handleFetchApplicationDetailsRejected,
} from '../reducers/fetchReducers';

export {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
} from '../thunks/fetchThunks';

const initialState: ApplicationsState = {
  applications: [],
  details: null,
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllApplicationsThunk.pending, handleFetchApplicationsPending)
      .addCase(fetchAllApplicationsThunk.fulfilled, handleFetchApplicationsFulfilled)
      .addCase(fetchAllApplicationsThunk.rejected, handleFetchApplicationsRejected)
      .addCase(fetchAllApplicationsSilentThunk.pending, handleFetchApplicationsSilentPending)
      .addCase(fetchAllApplicationsSilentThunk.fulfilled, handleFetchApplicationsFulfilled)
      .addCase(fetchAllApplicationsSilentThunk.rejected, handleFetchApplicationsSilentRejected)
      .addCase(fetchApplicationDetailsThunk.pending, handleFetchApplicationDetailsPending)
      .addCase(fetchApplicationDetailsThunk.fulfilled, handleFetchApplicationDetailsFulfilled)
      .addCase(fetchApplicationDetailsThunk.rejected, handleFetchApplicationDetailsRejected);
  },
});

export const { clearDetails } = applicationsSlice.actions;
export default applicationsSlice.reducer;

