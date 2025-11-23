import { createAsyncThunk } from '@reduxjs/toolkit';
import { createPasskey, updatePasskey, deletePasskey, getAllPasskeys } from '../../clients';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../constants/store/store';
import { HTTP_STATUS } from '../../../../constants/rest/http';
import { AUTH_ERROR_MESSAGES } from '../../constants/messages';
import { browserHasCredential } from '../../utils';
import logger from '../../../../logging';
import type {
  Passkey,
  CreatePasskeyResponse,
  UpdatePasskeyRequest,
  UpdatePasskeyResponse,
  DeletePasskeyRequest,
  CreatePasskeyParams,
} from '../../models/passkeys';

const mapResponseToPasskey = (response: CreatePasskeyResponse): Passkey => {
  return {
    id: response.id,
    credentialId: response.credentialId,
    deviceName: response.deviceName,
    deviceType: response.deviceType,
    creationTimestamp: response.creationTimestamp,
  };
};

const handleOrphanedPasskeyCleanup = async (
  params: CreatePasskeyParams,
  existingPasskey: Passkey,
  rejectWithValue: (value: string) => unknown,
): Promise<Passkey | unknown> => {
  try {
    await deletePasskey(existingPasskey.credentialId, {});
    const retryResponse: CreatePasskeyResponse = await createPasskey(
      params.credential,
      params.deviceName,
      params.deviceType,
      params.username,
    );
    return mapResponseToPasskey(retryResponse);
  } catch (cleanupError) {
    logger.error(AUTH_ERROR_MESSAGES.ORPHANED_PASSKEY_CLEANUP_FAILED, cleanupError);
    return rejectWithValue(AUTH_ERROR_MESSAGES.ORPHANED_PASSKEY_CLEANUP_FAILED);
  }
};

const handleConflictCase = async (
  params: CreatePasskeyParams,
  rejectWithValue: (value: string) => unknown,
): Promise<Passkey | unknown | null> => {
  try {
    const allPasskeys = await getAllPasskeys();
    const existingPasskey = allPasskeys.find((p) => p.deviceName === params.deviceName);

    if (!existingPasskey) {
      return null;
    }

    const hasInBrowser = await browserHasCredential(existingPasskey.credentialId);
    if (!hasInBrowser) {
      return handleOrphanedPasskeyCleanup(params, existingPasskey, rejectWithValue);
    }

    return null;
  } catch {
    // Fall through to return PASSKEY_ALREADY_EXISTS
    return null;
  }
};

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
      return mapResponseToPasskey(response);
    } catch (error: unknown) {
      const axiosError = error as any;
      const status = axiosError?.response?.status || axiosError?.normalized?.status;

      if (status === HTTP_STATUS.CONFLICT) {
        const conflictResult = await handleConflictCase(params, rejectWithValue);
        if (conflictResult !== null) {
          return conflictResult;
        }
        return rejectWithValue(AUTH_ERROR_MESSAGES.PASSKEY_ALREADY_EXISTS);
      }
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
      logger.error(STORE_MESSAGES.ERROR_UPDATING_PASSKEY, error);
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
      logger.error(STORE_MESSAGES.ERROR_DELETING_PASSKEY, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_PASSKEY));
    }
  },
);
