import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../logging';
import { fetchGroupers, fetchGrouperDetails, checkGrouperMaintenanceMode } from '../../clients';
import {
  mapGroupersData,
  mapSingleGrouperData,
  mapGrouperMaintenanceData,
} from '../../utils/mappers/grouperMapper';
import {
  generateGrouperName,
  generateMaintenanceFeatureName,
  extractErrorMessage,
} from '../../../../utils/helpers/format';
import type { Maintenance } from '../../models';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';

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
      const rawGroupersData = await fetchGroupers(true);
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
      const responseData = response.data as { config?: { maintenance?: unknown } } | undefined;
      const hasMaintenance = Boolean(responseData?.config?.maintenance);
      if (hasMaintenance) {
        try {
          const maintenanceFeatureName = generateMaintenanceFeatureName(name);
          const maintenanceResponse = await checkGrouperMaintenanceMode(maintenanceFeatureName);

          // Map maintenance data if available
          if (maintenanceResponse.data) {
            maintenance = {
              name: maintenanceResponse.data.name,
              status: maintenanceResponse.data.status,
              deleteAction: String(maintenanceResponse.data.delete),
              updateAction: String(maintenanceResponse.data.update),
            };
          }
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
