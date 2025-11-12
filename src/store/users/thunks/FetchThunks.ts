import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers } from '../../../clients/exporter';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants/store/store';
import type { User } from '../../../interfaces/users';
import type { ResourceListResponse } from '../../../interfaces/api';

const mapUsersData = (response: ResourceListResponse<User>): User[] => {
  return response.data?.items || [];
};

export const fetchAllUsersThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawUsersData = await fetchUsers();
      return mapUsersData(rawUsersData);
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_USERS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_USERS));
    }
  },
);

export const fetchAllUsersSilentThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawUsersData = await fetchUsers(true); // Silent mode
      return mapUsersData(rawUsersData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_USERS));
    }
  },
);

