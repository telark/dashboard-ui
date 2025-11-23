import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  enableGrouperMaintenanceMode,
  updateGrouperMaintenanceMode,
  removeGrouperMaintenanceMode,
} from '../../clients';
import {
  generateGrouperName,
  generateMaintenanceFeatureName,
  extractErrorMessage,
} from '../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS } from '../../../../constants/store/store';

export const enableGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.ENABLE_MAINTENANCE,
  async (
    {
      grouperName,
      resourceType,
      updateAction,
      deleteAction,
    }: {
      grouperName: string;
      resourceType: string;
      updateAction: boolean;
      deleteAction: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await enableGrouperMaintenanceMode(
        generateGrouperName(grouperName),
        resourceType,
        updateAction,
        deleteAction,
      );
      return {
        name: grouperName,
        status: response.status,
        message: response.message,
        maintenance: response.data
          ? {
              name: response.data.name,
              status: response.data.status,
              deleteAction: response.data.delete,
              updateAction: response.data.update,
            }
          : null,
      };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.ENABLE_MAINTENANCE));
    }
  },
);

export const updateGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.UPDATE_MAINTENANCE,
  async (
    {
      grouperName,
      updateAction,
      deleteAction,
    }: {
      grouperName: string;
      updateAction: boolean;
      deleteAction: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateGrouperMaintenanceMode(
        generateMaintenanceFeatureName(grouperName),
        updateAction,
        deleteAction,
      );
      return {
        name: grouperName,
        status: response.status,
        maintenance: response.data
          ? {
              name: response.data.name,
              status: response.data.status,
              deleteAction: response.data.delete,
              updateAction: response.data.update,
            }
          : null,
      };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_MAINTENANCE));
    }
  },
);

export const removeGrouperMaintenanceModeThunk = createAsyncThunk(
  STORE_ACTIONS.GROUPER.REMOVE_MAINTENANCE,
  async (grouperName: string, { rejectWithValue }) => {
    try {
      const response = await removeGrouperMaintenanceMode(
        generateMaintenanceFeatureName(grouperName),
      );
      return {
        name: grouperName,
        status: response.status,
      };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.REMOVE_MAINTENANCE));
    }
  },
);

