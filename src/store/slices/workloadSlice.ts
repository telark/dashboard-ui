import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchWorkloads, fetchBatches, updateWorkloadSyncMode } from '../../clients/exporter';
import { mapWorkloadsData, mapSingleWorkloadData } from '../../utils/mappers/workload';
import type { Workload, WorkloadCardData } from '../../interfaces/workload';

export interface BatchCardData {
  name: string;
  status: string;
  lastUpdate: string;
  instances?: {
    available: number;
    total: number;
  };
  containers?: number;
  bridges?: number;
  grouper?: string;
  sourceType?: string;
}

interface WorkloadState {
  workloads: WorkloadCardData[];
  batches: BatchCardData[];
  details: Workload | null;
  loading: boolean;
  batchesLoading: boolean;
  error: string | null;
}

const initialState: WorkloadState = {
  workloads: [],
  batches: [],
  details: null,
  loading: false,
  batchesLoading: false,
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

// Thunk for fetching all batches
export const fetchAllBatchesThunk = createAsyncThunk(
  'workloads/fetchBatches',
  async (_, { rejectWithValue }) => {
    try {
      const rawBatchesData = await fetchBatches();
      // For now, return empty array since API returns empty items
      // TODO: Add proper mapping when batch data structure is known
      return rawBatchesData.data?.items || [];
    } catch (error: any) {
      console.error('Failed to fetch batches:', error);
      return rejectWithValue(error.message || 'Failed to fetch batches');
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
      })
      // Fetch all batches
      .addCase(fetchAllBatchesThunk.pending, (state) => {
        state.batchesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBatchesThunk.fulfilled, (state, action) => {
        state.batchesLoading = false;
        state.batches = action.payload;
        state.error = null;
      })
      .addCase(fetchAllBatchesThunk.rejected, (state, action) => {
        state.batchesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWorkloads, clearWorkloadDetails, setWorkloadError } = workloadSlice.actions;
export default workloadSlice.reducer;
