import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers, fetchUserById } from '../../../clients/exporter';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants/store/store';
import logger from '../../../logging';
import type { User } from '../../../interfaces/users';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../interfaces/api';

const mapUsersData = (response: ResourceListResponse<User>): User[] => {
  return response.data?.items || [];
};

const mapUserDetailsData = (response: ResourceDetailsResponse<User>): User => {
  return response.data;
};

export const fetchAllUsersThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawUsersData = await fetchUsers();
      return mapUsersData(rawUsersData);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_USERS, error);
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

export const fetchUserDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.FETCH_DETAILS,
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchUserById(userId);
      return mapUserDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_USER_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_USER_DETAILS));
    }
  },
);
