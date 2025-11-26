import { createAsyncThunk } from '@reduxjs/toolkit';
import { createGroup, updateGroup, deleteGroup } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { Group, GroupFormData } from '../../models';
import type { ResourceDetailsResponse } from '../../../../../interfaces/http';
import { mapGroupData } from '../../utils/mappers/groupMapper';

const mapGroupDetailsData = (response: ResourceDetailsResponse<Group>): Group => {
  return mapGroupData(response.data as any);
};

export const createGroupThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.CREATE,
  async (group: GroupFormData, { rejectWithValue }) => {
    try {
      const response = await createGroup(group);
      return mapGroupDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_CREATING_GROUP, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CREATE_GROUP));
    }
  },
);

export const updateGroupThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.UPDATE,
  async ({ id, group }: { id: string; group: Partial<GroupFormData> }, { rejectWithValue }) => {
    try {
      const response = await updateGroup(id, group);
      return mapGroupDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_GROUP, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_GROUP));
    }
  },
);

export const deleteGroupThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPS.DELETE,
  async (groupId: string, { rejectWithValue }) => {
    try {
      await deleteGroup(groupId);
      return groupId;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_GROUP, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_GROUP));
    }
  },
);
