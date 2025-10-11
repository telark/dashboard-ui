import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchWorkloads, updateWorkloadSyncMode } from '../../clients/exporter';
import { mapWorkloadsData, mapSingleWorkloadData } from '../../utils/mappers/workload';
import type { Workload, WorkloadCardData } from '../../interfaces/workload';

interface WorkloadState {
  workloads: WorkloadCardData[];
  details: Workload | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkloadState = {
  workloads: [],
  details: null,
  loading: false,
  error: null,
};

// Thunk for fetching all workloads
export const fetchAllWorkloadsThunk = createAsyncThunk(
  'workloads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchWorkloads();
      return mapWorkloadsData(rawWorkloadsData);
    } catch (error: any) {
      console.error('Failed to fetch workloads:', error);
      return rejectWithValue(error.message || 'Failed to fetch workloads');
    }
  },
);

// Thunk for fetching single workload details
export const fetchWorkloadDetailsThunk = createAsyncThunk(
  'workloads/fetchDetails',
  async (name: string, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchWorkloads();
      const foundWorkload = rawWorkloadsData.data.items.find(
        (w: Workload) => w.fasid.name === name,
      );

      if (!foundWorkload) {
        throw new Error('Workload not found');
      }

      return mapSingleWorkloadData(foundWorkload);
    } catch (error: any) {
      console.error('Failed to fetch workload details:', error);
      return rejectWithValue(error.message || 'Failed to fetch workload details');
    }
  },
);

// Thunk for updating workload sync mode
export const updateWorkloadSyncModeThunk = createAsyncThunk(
  'workloads/updateSyncMode',
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const response = await updateWorkloadSyncMode(name, syncMode);
      return mapSingleWorkloadData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update workload sync mode');
    }
  },
);

const workloadSlice = createSlice({
  name: 'workloads',
  initialState,
  reducers: {
    clearWorkloads: (state) => {
      state.workloads = [];
      state.details = null;
      state.error = null;
    },
    clearWorkloadDetails: (state) => {
      state.details = null;
      state.error = null;
    },
    setWorkloadError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workloads
      .addCase(fetchAllWorkloadsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkloadsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.workloads = action.payload;
        state.error = null;
      })
      .addCase(fetchAllWorkloadsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch workload details
      .addCase(fetchWorkloadDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkloadDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkloadDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Workload Sync Mode
      .addCase(updateWorkloadSyncModeThunk.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        // Update the workloads list with the updated sync settings
        const index = state.workloads.findIndex(
          (workload) => workload.name === updatedItem.fasid?.name,
        );
        if (index !== -1) {
          // Update relevant fields for the specific workload
          state.workloads[index] = {
            ...state.workloads[index],
            // Update sync-related fields if they exist in the workload card data
            lastUpdate:
              updatedItem.config?.sync?.lastUpdateTime || state.workloads[index].lastUpdate,
          };
        }

        // Update the details to reflect the most recent data
        state.details = updatedItem;
      })
      .addCase(updateWorkloadSyncModeThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWorkloads, clearWorkloadDetails, setWorkloadError } = workloadSlice.actions;
export default workloadSlice.reducer;
