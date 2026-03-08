import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUser, updateUser, deleteUser } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { CreateUserFormValues, User } from '../../models';
import { mapUserDetailsData } from '../thunks/fetchThunks';

export const createUserThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.CREATE,
  async (user: CreateUserFormValues, { rejectWithValue }) => {
    try {
      const response = await createUser(user);
      return mapUserDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_CREATING_USER, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CREATE_USER));
    }
  },
);

export const updateUserThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.UPDATE,
  async ({ id, user }: { id: string; user: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, user);
      return mapUserDetailsData(response);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_USER, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_USER));
    }
  },
);

export const deleteUserThunk = createAsyncThunk(
  STORE_ACTIONS.USERS.DELETE,
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUser(userId);
      return userId;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_USER, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_USER));
    }
  },
);
