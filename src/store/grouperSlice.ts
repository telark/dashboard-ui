import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchGroupers, fetchGrouperDetails, updateGrouperSyncMode, checkGrouperMaintenanceMode } from '../clients/exporter';
import { enableGrouperMaintenanceMode } from '../clients/configurator';
import { mapGrouperMaintenanceData, mapGroupersData, mapSingleGrouperData } from '../utils/mappers/grouper';
import { GrouperState, Maintenance } from '../interfaces/grouper';
import { generateGrouperName, generateMaintenanceFeatureName } from '../utils/helpers';

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

// Thunk for updating grouper sync mode
export const updateGrouperSyncModeThunk = createAsyncThunk(
  'grouper/updateGrouperSync',
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const grouperName = generateGrouperName(name)
      const response = await updateGrouperSyncMode(grouperName, syncMode);
      return mapSingleGrouperData(response.data, null);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update sync settings.');
    }
  }
);

// Thunk for checking Grouper Maintenance Mode
export const checkGrouperMaintenanceModeThunk = createAsyncThunk(
  'grouper/checkMaintenanceMode',
  async (name: string, { rejectWithValue }) => {
    try {
      const maintenanceFeatureName = generateMaintenanceFeatureName(name);
      const response = await checkGrouperMaintenanceMode(maintenanceFeatureName);
      return mapGrouperMaintenanceData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance mode status.');
    }
  }
);

// Thunk for enabling grouper MaintenanceMode
export const enableGrouperMaintenanceModeThunk = createAsyncThunk(
  'grouper/enableMaintenanceMode',
  async ({ 
    grouperName, 
    resourceType, 
    updateAction, 
    deleteAction}: { 
      grouperName: string; 
      resourceType: string, 
      updateAction: boolean, 
      deleteAction: boolean
    }, { rejectWithValue }) => {
    try {
      const response = await enableGrouperMaintenanceMode(
        generateGrouperName(grouperName), 
        resourceType,
         updateAction, 
         deleteAction
        );
        return {
          status: response.status,
          message: response.message,
        };
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
      const grouperName = generateGrouperName(name);
      const response = await fetchGrouperDetails(grouperName);

      // Fetch the maintenance data separately
      let maintenance: Maintenance | null = null;
      try {
        const maintenanceFeatureName = generateMaintenanceFeatureName(name);
        const maintenanceResponse = await checkGrouperMaintenanceMode(maintenanceFeatureName);

        // Map maintenance data if available
        maintenance = maintenanceResponse.data
          ? {
              name: maintenanceResponse.data.name,
              status: maintenanceResponse.data.status,
              deleteAction: maintenanceResponse.data.delete,
              updateAction: maintenanceResponse.data.update,
            }
          : null; // If no maintenance data, pass null
      } catch (maintenanceError) {
        console.warn('Failed to fetch maintenance data:', maintenanceError);
        maintenance = null; // Set maintenance to null if request fails
      }

      return mapSingleGrouperData(response.data, maintenance);
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
      .addCase(updateGrouperSyncModeThunk.fulfilled, (state, action: PayloadAction<any>) => {
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
      .addCase(updateGrouperSyncModeThunk.rejected, (state, action: PayloadAction<any>) => {
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
      })
      .addCase(checkGrouperMaintenanceModeThunk.fulfilled, (state, action: PayloadAction<Maintenance>) => {
        const maintenanceData = action.payload;
        const index = state.groupers.findIndex((grouper) => generateMaintenanceFeatureName(grouper.name) === maintenanceData.name);
        if (index !== -1) {
          state.groupers[index].maintenance = maintenanceData;
        }
      });
  },
});

export const { clearDetails } = grouperSlice.actions;
export default grouperSlice.reducer;
