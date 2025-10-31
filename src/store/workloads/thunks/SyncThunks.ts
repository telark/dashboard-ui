import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAppWorkloadSyncMode } from '../../../clients/exporter';
import { triggerAppsSync } from '../../../clients/sync-manager';
import { mapSingleAppWorkloadData } from '../../../utils/mappers/appMapper';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants';

export const triggerAppsSyncThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.TRIGGER_SYNC,
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerAppsSync();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.TRIGGER_APPS_SYNC);
    }
  },
);

export const updateAppWorkloadSyncModeThunk = createAsyncThunk(
  STORE_ACTIONS.WORKLOADS.UPDATE_APP_SYNC,
  async ({ name, syncMode }: { name: string; syncMode: string }, { rejectWithValue }) => {
    try {
      const response = await updateAppWorkloadSyncMode(name, syncMode);
      return mapSingleAppWorkloadData(response.data);
    } catch (error: any) {
      console.error(STORE_MESSAGES.ERROR_UPDATING_APP_SYNC, error);
      return rejectWithValue(error.message || STORE_ERRORS.UPDATE_APP_SYNC);
    }
  },
);

