import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPasskeys, getPasskey } from '../../clients';
import { getMyPermissions } from '../../clients/permissions';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';
import logger from '../../../../logging';

export const fetchAllPasskeysThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const passkeys = await getAllPasskeys();
      return passkeys;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_PASSKEYS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PASSKEYS));
    }
  },
);

export const fetchAllPasskeysSilentThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.FETCH_SILENT,
  async (_, { rejectWithValue }) => {
    try {
      const passkeys = await getAllPasskeys();
      return passkeys;
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PASSKEYS));
    }
  },
);

export const fetchPasskeyDetailsThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.FETCH_DETAILS,
  async (credentialId: string, { rejectWithValue }) => {
    try {
      const passkey = await getPasskey(credentialId);
      return passkey;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_PASSKEY_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PASSKEY_DETAILS));
    }
  },
);

export const fetchMyPermissionsThunk = createAsyncThunk(
  STORE_ACTIONS.PERMISSIONS.FETCH,
  async (_arg: { silent?: boolean } | void, { rejectWithValue }) => {
    try {
      return await getMyPermissions();
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_PERMISSIONS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PERMISSIONS));
    }
  },
);
