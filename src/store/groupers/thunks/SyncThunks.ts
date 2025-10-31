import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateGrouperSyncMode, fetchGroupers } from '../../../clients/exporter';
import { triggerGroupersSync } from '../../../clients/sync-manager';
import { mapSingleGrouperData, mapGroupersData } from '../../../utils/mappers/grouperMapper';
import { generateGrouperName } from '../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS } from '../../../constants';

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

export const refreshAutoGroupersThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.REFRESH_AUTO,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      // Server filters to auto only
      return mapGroupersData(rawGroupersData);
    } catch (error: any) {
      return rejectWithValue(error.message || STORE_ERRORS.REFRESH_AUTO);
    }
  },
);

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
