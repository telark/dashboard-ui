import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGroups, fetchGroupById } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { Group } from '../../models';
import type { ResourceListResponse } from '../../../../../interfaces/http';
import {
  mapGroupsData as mapGroupsArray,
  mapGroupDetailsData,
} from '../../utils/mappers/groupMapper';

const mapGroupsData = (response: ResourceListResponse<Group>): Group[] => {
  const items = response.data?.items || [];
  return mapGroupsArray(items as any[]);
};

export const fetchAllGroupsThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupsData = await fetchGroups();
      return mapGroupsData(rawGroupsData);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_GROUPS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_GROUPS));
    }
  },
);

export const fetchAllGroupsSilentThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawGroupsData = await fetchGroups(true);
      return mapGroupsData(rawGroupsData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_GROUPS));
    }
  },
);

export const fetchGroupDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.FETCH_DETAILS,
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await fetchGroupById(groupId);
      return mapGroupDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_GROUP_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_GROUP_DETAILS));
    }
  },
);
