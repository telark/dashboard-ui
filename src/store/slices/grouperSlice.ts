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
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES, SYNC_MODES } from '../../constants';

const initialState: GrouperState = {
  groupers: [],
  details: null,
  loading: false,
  error: null,
  // Track in-flight syncs by grouper name
  syncing: {},
};

// Thunk for fetching groupers
export const fetchAllGroupersThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_GROUPERS, error);
      return rejectWithValue(error.message || STORE_ERRORS.FETCH_GROUPERS);
    }
  },
);

// Silent version for retry attempts
export const fetchAllGroupersSilentThunk = createAsyncThunk(
  'groupers/fetchSilent',
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers(true); // Silent mode
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      // Don't log errors during retry attempts
      return rejectWithValue(error.message || STORE_ERRORS.FETCH_GROUPERS);
    }
  },
);

// Trigger sync on sync-manager
export const triggerGroupersSyncThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.TRIGGER_SYNC,
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerGroupersSync();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.TRIGGER_SYNC);
    }
  },
);

// Refresh only auto-sync groupers (server already filters by auto)
export const refreshAutoGroupersThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.REFRESH_AUTO,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      // Server filters to auto only; mapping keeps same shape
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.REFRESH_AUTO);
    }
  },
);

// Thunk for updating grouper sync mode
export const updateGrouperSyncModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.UPDATE_SYNC,
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const grouperName = generateGrouperName(name);
      const response = await updateGrouperSyncMode(grouperName, syncMode);
      return mapSingleGrouperData(response.data, null);
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.UPDATE_SYNC);
    }
  },
);

// Thunk for checking Grouper Maintenance Mode
export const checkGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.CHECK_MAINTENANCE,
  async (name: string, { rejectWithValue }) => {
    try {
      const maintenanceFeatureName = generateMaintenanceFeatureName(name);
      const response = await checkGrouperMaintenanceMode(maintenanceFeatureName);
      return mapGrouperMaintenanceData(response.data);
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.CHECK_MAINTENANCE);
    }
  },
);

// Thunk for enabling grouper MaintenanceMode
export const enableGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.ENABLE_MAINTENANCE,
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
        name: grouperName,
        status: response.status,
        message: response.message,
        maintenance: response.data ? {
          name: response.data.name,
          status: response.data.status,
          deleteAction: response.data.delete,
          updateAction: response.data.update,
        } : null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.ENABLE_MAINTENANCE);
    }
  },
);

// Thunk for updating Grouper Maintenance Mode
export const updateGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.UPDATE_MAINTENANCE,
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
        name: grouperName,
        status: response.status,
        maintenance: response.data ? {
          name: response.data.name,
          status: response.data.status,
          deleteAction: response.data.delete,
          updateAction: response.data.update,
        } : null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.UPDATE_MAINTENANCE);
    }
  },
);

export const removeGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.REMOVE_MAINTENANCE,
  async (grouperName: string, { rejectWithValue }) => {
    try {
      const response = await removeGrouperMaintenanceMode(
        generateMaintenanceFeatureName(grouperName),
      );
      return {
        name: grouperName,
        status: response.status,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.REMOVE_MAINTENANCE);
    }
  },
);

// Thunk to fetch grouper details
export const fetchGrouperDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.FETCH_DETAILS,
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
          console.warn(STORE_MESSAGES.FETCH_MAINTENANCE_FAILED, maintenanceError);
          maintenance = null; // Set maintenance to null if request fails
        }
      }

      return mapSingleGrouperData(response.data, maintenance);
    } catch (error) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_GROUPER_DETAILS, error);
      return rejectWithValue(STORE_ERRORS.FETCH_DETAILS);
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
    startSync(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name) state.syncing[name] = true;
    },
    endSync(state, action: PayloadAction<string>) {
      const name = action.payload;
      if (!state.syncing) state.syncing = {};
      if (name && state.syncing[name]) delete state.syncing[name];
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
        
        // Preserve maintenance state when updating groupers list
        const existingByName: Record<string, any> = {};
        for (const g of state.groupers) {
          if (g?.name) existingByName[g.name] = g;
        }
        
        const updatedGroupers = action.payload.map((g: any) => {
          const existingGrouper = existingByName[g.name];
          return {
            ...g,
            // Preserve maintenance data from existing state
            maintenance: existingGrouper?.maintenance || g.maintenance,
            hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
          };
        });
        
        state.groupers = updatedGroupers;
      })
      .addCase(fetchAllGroupersThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Silent Fetch Groupers (for retry attempts)
      .addCase(fetchAllGroupersSilentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllGroupersSilentThunk.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        
        // Preserve maintenance state when updating groupers list
        const existingByName: Record<string, any> = {};
        for (const g of state.groupers) {
          if (g?.name) existingByName[g.name] = g;
        }
        
        const updatedGroupers = action.payload.map((g: any) => {
          const existingGrouper = existingByName[g.name];
          return {
            ...g,
            // Preserve maintenance data from existing state
            maintenance: existingGrouper?.maintenance || g.maintenance,
            hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
          };
        });
        
        state.groupers = updatedGroupers;
      })
      .addCase(fetchAllGroupersSilentThunk.rejected, (state, action: PayloadAction<any>) => {
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
        const autoIncoming = incoming.filter((g: any) => g?.sync?.mode === SYNC_MODES.AUTO);
        
        // Create a map of existing groupers by name to preserve maintenance state
        const existingByName: Record<string, any> = {};
        for (const g of state.groupers) {
          if (g?.name) existingByName[g.name] = g;
        }
        
        // Merge by name: auto items replaced from server; manual items preserved as-is
        const autoByName: Record<string, any> = {};
        for (const g of autoIncoming) {
          if (g?.name) {
            // Preserve maintenance state from existing grouper if it exists
            const existingGrouper = existingByName[g.name];
            autoByName[g.name] = {
              ...g,
              // Preserve maintenance data from existing state
              maintenance: existingGrouper?.maintenance || g.maintenance,
              hasMaintenance: existingGrouper?.hasMaintenance || g.hasMaintenance,
            };
          }
        }

        // Keep manual entries that aren't also present as auto with same name
        const manualExistingFiltered = state.groupers.filter((g: any) => {
          const isManual = g?.sync?.mode === SYNC_MODES.MANUAL;
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

        // Update the details to reflect the most recent data while preserving maintenance data
        if (state.details) {
          state.details = {
            ...updatedItem,
            maintenance: state.details.maintenance, // Preserve existing maintenance data
          };
        } else {
          state.details = updatedItem;
        }
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
        console.log(STORE_MESSAGES.MAINTENANCE_UPDATED, action.payload);
        
        // Update the grouper in the list with the new maintenance data
        const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
        if (grouperIndex !== -1 && action.payload.maintenance) {
          state.groupers[grouperIndex].maintenance = action.payload.maintenance;
          state.groupers[grouperIndex].hasMaintenance = true;
        }
        
        // Update details if it's the same grouper
        if (state.details?.name === action.payload.name && action.payload.maintenance) {
          state.details.maintenance = action.payload.maintenance;
          state.details.hasMaintenance = true;
        }
      })
      .addCase(updateGrouperMaintenanceModeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enableGrouperMaintenanceModeThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // Update the grouper in the list with the new maintenance data
        const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
        if (grouperIndex !== -1 && action.payload.maintenance) {
          state.groupers[grouperIndex].maintenance = action.payload.maintenance;
          state.groupers[grouperIndex].hasMaintenance = true;
        }
        
        // Update details if it's the same grouper
        if (state.details?.name === action.payload.name && action.payload.maintenance) {
          state.details.maintenance = action.payload.maintenance;
          state.details.hasMaintenance = true;
        }
      })
      .addCase(enableGrouperMaintenanceModeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeGrouperMaintenanceModeThunk.fulfilled, (state, action: PayloadAction<any>) => {
        // Update the grouper in the list to remove maintenance data instead of filtering it out
        const grouperIndex = state.groupers.findIndex((g) => g.name === action.payload.name);
        if (grouperIndex !== -1) {
          state.groupers[grouperIndex].maintenance = null;
          state.groupers[grouperIndex].hasMaintenance = false;
        }
        
        // Update details if it's the same grouper
        if (state.details?.name === action.payload.name) {
          state.details.maintenance = null;
          state.details.hasMaintenance = false;
        }
      })
      .addCase(removeGrouperMaintenanceModeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export const { clearDetails, startSync, endSync } = grouperSlice.actions;
export default grouperSlice.reducer;
