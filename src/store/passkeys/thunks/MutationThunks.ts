import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPasskey,
  updatePasskey,
  deletePasskey,
} from '../../../clients/auth';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../constants/store/store';
import type {
  Passkey,
  CreatePasskeyResponse,
  UpdatePasskeyRequest,
  UpdatePasskeyResponse,
  DeletePasskeyRequest,
  PublicKeyCredential,
} from '../../../interfaces/auth';

interface CreatePasskeyParams {
  credential: PublicKeyCredential;
  deviceName: string;
  deviceType: 'platform' | 'cross-platform';
  username?: string;
}

export const createPasskeyThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.CREATE,
  async (params: CreatePasskeyParams, { rejectWithValue }) => {
    try {
      const response: CreatePasskeyResponse = await createPasskey(
        params.credential,
        params.deviceName,
        params.deviceType,
        params.username,
      );
      // Convert CreatePasskeyResponse to Passkey format
      const passkey: Passkey = {
        id: response.id,
        credentialId: response.credentialId,
        deviceName: response.deviceName,
        deviceType: response.deviceType,
        creationTimestamp: response.creationTimestamp,
      };
      return passkey;
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_CREATING_PASSKEY, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CREATE_PASSKEY));
    }
  },
);

export const updatePasskeyThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.UPDATE,
  async (
    { credentialId, request }: { credentialId: string; request: UpdatePasskeyRequest },
    { rejectWithValue },
  ) => {
    try {
      const updatedPasskey: UpdatePasskeyResponse = await updatePasskey(credentialId, request);
      return updatedPasskey;
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_UPDATING_PASSKEY, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_PASSKEY));
    }
  },
);

export const deletePasskeyThunk = createAsyncThunk(
  STORE_ACTIONS.PASSKEYS.DELETE,
  async (
    { credentialId, request }: { credentialId: string; request?: DeletePasskeyRequest },
    { rejectWithValue },
  ) => {
    try {
      await deletePasskey(credentialId, request);
      return credentialId;
    } catch (error: unknown) {
      console.error(STORE_MESSAGES.ERROR_DELETING_PASSKEY, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_PASSKEY));
    }
  },
);

