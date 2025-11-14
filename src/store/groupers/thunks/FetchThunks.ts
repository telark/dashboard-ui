import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../logging';
import {
  fetchGroupers,
  fetchGrouperDetails,
  checkGrouperMaintenanceMode,
} from '../../../clients/exporter';
import {
  mapGroupersData,
  mapSingleGrouperData,
  mapGrouperMaintenanceData,
} from '../../../utils/mappers/grouperMapper';
import {
  generateGrouperName,
  generateMaintenanceFeatureName,
  extractErrorMessage,
} from '../../../utils/helpers/format';
import { Maintenance } from '../../../interfaces/grouper';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants/store/store';

export const fetchAllGroupersThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      return mapGroupersData(rawGroupersData);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_GROUPERS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_GROUPERS));
    }
  },
);

export const fetchAllGroupersSilentThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers(true); // Silent mode
      return mapGroupersData(rawGroupersData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_GROUPERS));
    }
  },
);

export const fetchGrouperDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.FETCH_DETAILS,
  async (name: string, { rejectWithValue }) => {
    try {
      const grouperName = generateGrouperName(name);
      const response = await fetchGrouperDetails(grouperName);

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
            : null;
        } catch (maintenanceError) {
          logger.warn(STORE_MESSAGES.FETCH_MAINTENANCE_FAILED, maintenanceError);
          maintenance = null;
        }
      }

      return mapSingleGrouperData(response.data, maintenance);
    } catch (error) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_GROUPER_DETAILS, error);
      return rejectWithValue(STORE_ERRORS.FETCH_DETAILS);
    }
  },
);

export const checkGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.CHECK_MAINTENANCE,
  async (name: string, { rejectWithValue }) => {
    try {
      const maintenanceFeatureName = generateMaintenanceFeatureName(name);
      const response = await checkGrouperMaintenanceMode(maintenanceFeatureName);
      return mapGrouperMaintenanceData(response.data);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CHECK_MAINTENANCE));
    }
  },
);
