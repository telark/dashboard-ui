import { createAsyncThunk } from '@reduxjs/toolkit';
import { createRole, updateRole, deleteRole } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { RoleFormData } from '../../models';
import { mapRoleDetailsData } from '../../utils/mappers/roleMapper';

export const createRoleThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.CREATE,
  async (role: RoleFormData, { rejectWithValue }) => {
    try {
      const response = await createRole(role);
      return mapRoleDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_CREATING_ROLE, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CREATE_ROLE));
    }
  },
);

export const updateRoleThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.UPDATE,
  async ({ id, role }: { id: string; role: Partial<RoleFormData> }, { rejectWithValue }) => {
    try {
      const response = await updateRole(id, role);
      return mapRoleDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_ROLE, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_ROLE));
    }
  },
);

export const deleteRoleThunk = createAsyncThunk(
  STORE_ACTIONS.ROLES.DELETE,
  async (roleId: string, { rejectWithValue }) => {
    try {
      await deleteRole(roleId);
      return roleId;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_ROLE, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_ROLE));
    }
  },
);
