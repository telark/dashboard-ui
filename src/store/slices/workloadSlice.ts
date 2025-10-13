import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchAllAppsWorkloads, fetchAllBatchesWorkloads, fetchAppWorkloadDetails, updateAppWorkloadSyncMode } from '../../clients/exporter';
import { mapAppsWorkloadsData, mapSingleAppWorkloadData } from '../../utils/mappers/workloads/appMapper';
import type { WorkloadsState } from '../../interfaces/workload';

const initialState: WorkloadsState = {
  apps: [],
  batches: [],
  appDetails: null,
  batchDetails: null,
  appLoading: false,
  batchLoading: false,
  appError: null,
  batchError: null,
};

export const fetchAllAppsWorkloadsThunk = createAsyncThunk(
  'workloads/fetchAllApps',
  async (_, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchAllAppsWorkloads();
      return mapAppsWorkloadsData(rawWorkloadsData);
    } catch (error: any) {
      console.error('Failed to fetch apps workloads:', error);
      return rejectWithValue(error.message || 'Failed to fetch apps workloads');
    }
  },
);

export const fetchAllBatchesWorkloadsThunk = createAsyncThunk(
  'workloads/fetchAllBatches',
  async (_, { rejectWithValue }) => {
    try {
      const rawBatchesData = await fetchAllBatchesWorkloads();
      return rawBatchesData.data?.items || [];
    } catch (error: any) {
      console.error('Failed to fetch batches workloads:', error);
      return rejectWithValue(error.message || 'Failed to fetch batches workloads');
    }
  },
);

export const fetchAppWorkloadDetailsThunk = createAsyncThunk(
  'workloads/fetchAppDetails',
  async (name: string, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchAppWorkloadDetails(name);

      return mapSingleAppWorkloadData(rawWorkloadsData.data);
    } catch (error: any) {
      console.error('Failed to fetch app workload details:', error);
      return rejectWithValue(error.message || 'Failed to fetch app workload details');
    }
  },
);

export const updateAppWorkloadSyncModeThunk = createAsyncThunk(
  'workloads/updateAppSyncMode',
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const response = await updateAppWorkloadSyncMode(name, syncMode);
      return mapSingleAppWorkloadData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update app workload sync mode');
    }
  },
);

const workloadSlice = createSlice({
  name: 'workloads',
  initialState,
  reducers: {
    clearWorkloads: (state) => {
      state.apps = [];
      state.appDetails = null;
      state.appError = null;
    },
    clearWorkloadDetails: (state) => {
      state.appDetails = null;
      state.appError = null;
    },
    setWorkloadError: (state, action: PayloadAction<string>) => {
      state.appError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppsWorkloadsThunk.pending, (state) => {
        state.appLoading = true;
        state.appError = null;
      })
      .addCase(fetchAllAppsWorkloadsThunk.fulfilled, (state, action) => {
        state.appLoading = false;
        state.apps = action.payload;
        state.appError = null;
      })
      .addCase(fetchAllAppsWorkloadsThunk.rejected, (state, action) => {
        state.appLoading = false;
        state.appError = action.payload as string;
      })
      .addCase(fetchAppWorkloadDetailsThunk.pending, (state) => {
        state.appLoading = true;
        state.appError = null;
      })
      .addCase(fetchAppWorkloadDetailsThunk.fulfilled, (state, action) => {
        state.appLoading = false;
        state.appDetails = action.payload;
        state.appError = null;
      })
      .addCase(fetchAppWorkloadDetailsThunk.rejected, (state, action) => {
        state.appLoading = false;
        state.appError = action.payload as string;
      })
      .addCase(updateAppWorkloadSyncModeThunk.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.apps.findIndex(
          (workload) => workload.name === updatedItem.fasid?.name,
        );
        if (index !== -1) {
          state.apps[index] = {
            ...state.apps[index],
            lastUpdate:
              updatedItem.config?.sync?.lastUpdateTime || state.apps[index].lastUpdate,
          };
        }

        // Update the details to reflect the most recent data
        state.appDetails = updatedItem;
      })
      .addCase(updateAppWorkloadSyncModeThunk.rejected, (state, action) => {
        state.appError = action.payload as string;
      })
      .addCase(fetchAllBatchesWorkloadsThunk.pending, (state) => {
        state.batchLoading = true;
        state.batchError = null;
      })
      .addCase(fetchAllBatchesWorkloadsThunk.fulfilled, (state, action) => {
        state.batchLoading = false;
        state.batches = action.payload;
        state.batchError = null;
      })
      .addCase(fetchAllBatchesWorkloadsThunk.rejected, (state, action) => {
        state.batchLoading = false;
        state.batchError = action.payload as string;
      });
  },
});

export const { clearWorkloads, clearWorkloadDetails, setWorkloadError } = workloadSlice.actions;
export default workloadSlice.reducer;
