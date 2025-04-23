import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchGroupers, fetchGrouperDetails, updateGrouperSyncSettings, enableMaintenanceForGrouper } from '../clients/grouper';
import { mapGroupersData, mapSingleGrouperData } from '../utils/mappers/grouper';
import { GrouperState } from '../interfaces/grouper';

const initialState: GrouperState = {
  groupers: [],
  details: null,
  loading: false,
  error: null,
};

// Thunk for fetching groupers
export const fetchGroupersThunk = createAsyncThunk('groupers/fetch', async (_, { rejectWithValue }) => {
  try {
    const rawGroupersData = await fetchGroupers();
    return mapGroupersData(rawGroupersData);
  } catch (error: any) {
    console.error('Error fetching groupers:', error);
    return rejectWithValue(error.message || 'Failed to fetch groupers');
  }
});

// Thunk for updating grouper sync settings
export const updateGrouperSyncThunk = createAsyncThunk(
  'grouper/updateGrouperSync',
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const response = await updateGrouperSyncSettings(name, syncMode);
      console.log('API Response:', response);
      return mapSingleGrouperData(response.item); // Ensure the data mapping is correct
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update sync settings.');
    }
  }
);

// Thunk for enabling grouper MaintenanceMode
export const enableMaintenanceModeThunk = createAsyncThunk(
  'grouper/enableMaintenanceMode',
  async ({ scopeName, scopeType, allowUpdates}: { scopeName: string; scopeType: string, allowUpdates: boolean }, { rejectWithValue }) => {
    try {
      const response = await enableMaintenanceForGrouper(scopeName, scopeType, allowUpdates);
      console.log('API Response:', response);
      return mapSingleGrouperData(response.item); // Ensure the data mapping is correct
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable maintenance mode.');
    }
  }
);

// Thunk to fetch grouper details
export const fetchGrouperDetailsThunk = createAsyncThunk(
  'groupers/fetchDetails',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await fetchGrouperDetails(name);
      return mapSingleGrouperData(response.item); // Ensure proper data mapping
    } catch (error) {
      console.error('Error fetching grouper details:', error);
      return rejectWithValue('Failed to fetch grouper details');
    }
  }
);

const grouperSlice = createSlice({
  name: 'grouper',
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null; // Clear previous details to avoid stale data
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groupers
      .addCase(fetchGroupersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupersThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.groupers = action.payload;
      })
      .addCase(fetchGroupersThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Grouper Sync
      .addCase(updateGrouperSyncThunk.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedItem = action.payload;

        // Update the groupers list with the updated sync settings
        const index = state.groupers.findIndex((grouper) => grouper.name === updatedItem.name);
        if (index !== -1) {
          // Update relevant fields for the specific grouper
          state.groupers[index] = {
            ...state.groupers[index],
            sync: updatedItem.sync,
            history: updatedItem.history,
          };
        }

        // Update the details to reflect the most recent data
        state.details = updatedItem;
      })
      .addCase(updateGrouperSyncThunk.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      // Fetch Grouper Details
      .addCase(fetchGrouperDetailsThunk.pending, (state) => {
        state.loading = true;
        state.details = null; // Clear details on new fetch
        state.error = null;
      })
      .addCase(fetchGrouperDetailsThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.details = action.payload; // Populate details with fresh data
      })
      .addCase(fetchGrouperDetailsThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDetails } = grouperSlice.actions;
export default grouperSlice.reducer;
