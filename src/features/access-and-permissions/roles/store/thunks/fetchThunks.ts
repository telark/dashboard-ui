import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRoles, fetchRoleById } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { Role } from '../../models';
import type { ResourceListResponse } from '../../../../../interfaces/http';
import { mapRolesData as mapRolesArray, mapRoleDetailsData } from '../../utils/mappers/roleMapper';

const mapRolesData = (response: ResourceListResponse<Role>): Role[] => {
  const items = response.data?.items || [];
  return mapRolesArray(items);
};

export const fetchAllRolesThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const rawRolesData = await fetchRoles();
      return mapRolesData(rawRolesData);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_ROLES, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_ROLES));
    }
  },
);

export const fetchAllRolesSilentThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const rawRolesData = await fetchRoles(true);
      return mapRolesData(rawRolesData);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_ROLES));
    }
  },
);

export const fetchRoleDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.FETCH_DETAILS,
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await fetchRoleById(roleId);
      return mapRoleDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_ROLE_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_ROLE_DETAILS));
    }
  },
);
