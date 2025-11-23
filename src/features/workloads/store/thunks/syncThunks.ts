import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../logging';
import { updateAppWorkloadSyncMode, fetchAllAppsWorkloads } from '../../clients';
import { triggerAppsSync } from '../../clients';
import { mapSingleAppWorkloadData, mapAppsWorkloadsData } from '../../utils/mappers/appMapper';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import type { AppWorkload } from '../../models';

export const triggerAppsSyncThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.TRIGGER_GROUPER_SYNC,
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerAppsSync();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.TRIGGER_APPS_SYNC));
    }
  },
);

export const refreshAutoAppsThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.REFRESH_AUTO_GROUPERS,
  async (_, { rejectWithValue }) => {
    try {
      const rawWorkloadsData = await fetchAllAppsWorkloads();
      // Server filters to auto only (similar to groupers)
      return mapAppsWorkloadsData(rawWorkloadsData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.REFRESH_AUTO_GROUPERS_APPS));
    }
  },
);

export const updateAppWorkloadSyncModeThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.UPDATE_APP_SYNC,
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const response = await updateAppWorkloadSyncMode(name, syncMode);
      if (!response.data) {
        throw new Error('Invalid response structure');
      }
      return mapSingleAppWorkloadData(response.data as AppWorkload);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_APP_SYNC, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_APP_SYNC));
    }
  },
);

