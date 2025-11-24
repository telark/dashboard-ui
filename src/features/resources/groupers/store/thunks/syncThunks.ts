import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateGrouperSyncMode, triggerGroupersSync, fetchGroupers } from '../../clients';
import { mapSingleGrouperData, mapGroupersData } from '../../utils/mappers/grouperMapper';
import { generateGrouperName, extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS } from '../../../../../constants/store/store';

export const triggerGroupersSyncThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.TRIGGER_GROUPER_SYNC,
  async (_, { rejectWithValue }) => {
    try {
      const response = await triggerGroupersSync();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.TRIGGER_GROUPER_SYNC));
    }
  },
);

export const refreshAutoGroupersThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPERS.REFRESH_AUTO_GROUPERS,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupersData = await fetchGroupers();
      // Server filters to auto only
      return mapGroupersData(rawGroupersData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.REFRESH_AUTO_GROUPERS));
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
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_SYNC));
    }
  },
);
