import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPasskeys, getPasskey } from '../../../clients/auth';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants/store/store';

export const fetchAllPasskeysThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      const passkeys = await getAllPasskeys();
      return passkeys;
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_FETCHING_PASSKEYS, error);
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
      console.error(STORE_MESSAGES.ERROR_FETCHING_PASSKEY_DETAILS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PASSKEY_DETAILS));
    }
  },
);

