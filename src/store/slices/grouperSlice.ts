import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchGroupers,
  fetchGrouperDetails,
  updateGrouperSyncMode,
  checkGrouperMaintenanceMode,
} from '../../clients/exporter';
import { triggerGroupersSync } from '../../clients/sync-manager';
import {
  enableGrouperMaintenanceMode,
  updateGrouperMaintenanceMode,
  removeGrouperMaintenanceMode,
} from '../../clients/configurator';
import {
  mapGrouperMaintenanceData,
  mapGroupersData,
  mapSingleGrouperData,
} from '../../utils/mappers/grouper';
import { GrouperState, Maintenance } from '../../interfaces/grouper';
import { generateGrouperName, generateMaintenanceFeatureName } from '../../utils/helpers';

const initialState: GrouperState = {
  groupers: [],
  details: null,
  loading: false,
  error: null,
};

// Thunk for fetching groupers
export const fetchAllGroupersThunk = createAsyncThunk(
  'groupers/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      console.error('Error fetching groupers:', error);
      return rejectWithValue(error.message || 'Failed to fetch groupers');
    }
  },
);

// Trigger sync on sync-manager
export const triggerGroupersSyncThunk = createAsyncThunk(
  'groupers/triggerSync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerGroupersSync();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to trigger groupers sync');
    }
  },
);

// Refresh only auto-sync groupers (server already filters by auto)
export const refreshAutoGroupersThunk = createAsyncThunk(
  'groupers/refreshAuto',
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      // Server filters to auto only; mapping keeps same shape
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh auto groupers');
    }
  },
);

// Thunk for updating grouper sync mode
export const updateGrouperSyncModeThunk = createAsyncThunk(
  'grouper/updateGrouperSync',
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const grouperName = generateGrouperName(name);
      const response = await updateGrouperSyncMode(grouperName, syncMode);
      return mapSingleGrouperData(response.data, null);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update sync settings.');
    }
  },
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
  },
);

// Thunk for enabling grouper MaintenanceMode
export const enableGrouperMaintenanceModeThunk = createAsyncThunk(
  'grouper/enableMaintenanceMode',
  async (
    {
      grouperName,
      resourceType,
      updateAction,
      deleteAction,
    }: {
      grouperName: string;
      resourceType: string;
      updateAction: boolean;
      deleteAction: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await enableGrouperMaintenanceMode(
        generateGrouperName(grouperName),
        resourceType,
        updateAction,
        deleteAction,
      );
      return {
        status: response.status,
        message: response.message,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable maintenance mode.');
    }
  },
);

// Thunk for updating Grouper Maintenance Mode
export const updateGrouperMaintenanceModeThunk = createAsyncThunk(
  'grouper/updateMaintenanceMode',
  async (
    {
      grouperName,
      updateAction,
      deleteAction,
    }: {
      grouperName: string;
      updateAction: boolean;
      deleteAction: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateGrouperMaintenanceMode(
        generateMaintenanceFeatureName(grouperName),
        updateAction,
        deleteAction,
      );
      return {
        status: response.status,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update maintenance mode.');
    }
  },
);

export const removeGrouperMaintenanceModeThunk = createAsyncThunk(
  'grouper/removeMaintenanceMode',
  async (grouperName: string, { rejectWithValue }) => {
    try {
      const response = await removeGrouperMaintenanceMode(
        generateMaintenanceFeatureName(grouperName),
      );
      return {
        status: response.status,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete maintenance mode.');
    }
  },
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
      const hasMaintenance = Boolean(response.data?.config?.maintenance);
      if (hasMaintenance) {
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
      }

      return mapSingleGrouperData(response.data, maintenance);
    } catch (error) {
      console.error('Error fetching grouper details:', error);
      return rejectWithValue('Failed to fetch grouper details');
    }
  },
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
      .addCase(fetchAllGroupersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroupersThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.groupers = action.payload;
      })
      .addCase(fetchAllGroupersThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Trigger Sync (no state changes, but could be used for UI feedback)
      .addCase(triggerGroupersSyncThunk.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      // Refresh Auto Groupers merges list; respects manual by omission
      .addCase(refreshAutoGroupersThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        const incoming = action.payload || [];
        const autoIncoming = incoming.filter((g: any) => g?.sync?.mode === 'auto');
        // Merge by name: auto items replaced from server; manual items preserved as-is
        const autoByName: Record<string, any> = {};
        for (const g of autoIncoming) {
          if (g?.name) autoByName[g.name] = g;
        }

        // Keep manual entries that aren't also present as auto with same name
        const manualExistingFiltered = state.groupers.filter((g: any) => {
          const isManual = g?.sync?.mode === 'manual';
          const name = g?.name;
          return isManual && name && !autoByName[name];
        });

        state.groupers = [...Object.values(autoByName), ...manualExistingFiltered];
      })
      .addCase(refreshAutoGroupersThunk.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(
        checkGrouperMaintenanceModeThunk.fulfilled,
        (state, action: PayloadAction<Maintenance>) => {
          const maintenanceData = action.payload;
          const index = state.groupers.findIndex(
            (grouper) => generateMaintenanceFeatureName(grouper.name) === maintenanceData.name,
          );
          if (index !== -1) {
            state.groupers[index].maintenance = maintenanceData;
          }
        },
      )
      .addCase(updateGrouperMaintenanceModeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGrouperMaintenanceModeThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('Maintenance Mode updated:', action.payload);
      })
      .addCase(updateGrouperMaintenanceModeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeGrouperMaintenanceModeThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.groupers = state.groupers.filter((g) => g.name !== action.payload.name);
        if (state.details?.name === action.payload.name) {
          state.details = null;
        }
      })
      .addCase(removeGrouperMaintenanceModeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export const { clearDetails } = grouperSlice.actions;
export default grouperSlice.reducer;
