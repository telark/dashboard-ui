import { createSlice } from '@reduxjs/toolkit';
import type { ApplicationsState } from '../../models';
import {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  updateApplicationThunk,
  deleteApplicationThunk,
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
  handleUpdateApplicationFulfilled,
  handleDeleteApplicationFulfilled,
} from '../reducers/fetchReducers';

export {
  fetchAllApplicationsThunk,
  fetchAllApplicationsSilentThunk,
  fetchApplicationDetailsThunk,
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  updateApplicationThunk,
  deleteApplicationThunk,
} from '../thunks/fetchThunks';

const initialState: ApplicationsState = {
  applications: [],
  details: null,
  loading: false,
  error: null,
  snapshots: [],
  snapshotsLoading: false,
  snapshotsError: null,
  snapshotManifests: {},
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
      .addCase(fetchApplicationDetailsThunk.rejected, handleFetchApplicationDetailsRejected)
      .addCase(fetchApplicationSnapshotsThunk.pending, (state) => {
        state.snapshotsLoading = true;
        state.snapshotsError = null;
      })
      .addCase(fetchApplicationSnapshotsThunk.fulfilled, (state, action) => {
        state.snapshotsLoading = false;
        state.snapshots = action.payload;
        state.snapshotsError = null;
      })
      .addCase(fetchApplicationSnapshotsThunk.rejected, (state, action) => {
        state.snapshotsLoading = false;
        state.snapshotsError = String(action.payload || '');
      })
      .addCase(fetchSnapshotManifestThunk.pending, (state, action) => {
        const { manifestKey } = action.meta.arg;
        state.snapshotManifests[manifestKey] = { loading: true, error: null, data: null };
      })
      .addCase(fetchSnapshotManifestThunk.fulfilled, (state, action) => {
        const { manifestKey, data } = action.payload;
        state.snapshotManifests[manifestKey] = { loading: false, error: null, data };
      })
      .addCase(fetchSnapshotManifestThunk.rejected, (state, action) => {
        const { manifestKey } = action.meta.arg;
        state.snapshotManifests[manifestKey] = {
          loading: false,
          error: String(action.payload || ''),
          data: null,
        };
      })
      .addCase(updateApplicationThunk.fulfilled, handleUpdateApplicationFulfilled)
      .addCase(deleteApplicationThunk.fulfilled, handleDeleteApplicationFulfilled);
  },
});

export const { clearDetails } = applicationsSlice.actions;
export default applicationsSlice.reducer;

