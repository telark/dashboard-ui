import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUser } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { CreateUserFormValues } from '../../models';
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
