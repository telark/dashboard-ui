import { registerStart } from '../../clients/register';
import { registerPasskey } from '../webauthn/core';
import { extractRegisterOptions } from '../flow/register';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { rejectionMessage } from '../../../../utils/helpers/format';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import {
  createPasskeyThunk,
  updatePasskeyThunk,
  deletePasskeyThunk,
} from '../../store/thunks/mutationThunks';
import type {
  UpdatePasskeyRequest,
  CreatePasskeyHandlerParams,
  UpdatePasskeyHandlerParams,
  DeletePasskeyHandlerParams,
  PasskeyDeviceType,
} from '../../models';

export const handleCreatePasskey = async ({
  deviceName,
  dispatch,
  setSubmitting,
  message,
}: CreatePasskeyHandlerParams): Promise<void> => {
  if (!deviceName) {
    throw new Error(PPC.ERRORS.DEVICE_NAME_REQUIRED);
  }

  setSubmitting(true);
  try {
    const registerStartResponse = await registerStart();
    const options = extractRegisterOptions(registerStartResponse);

    const userWithDeviceName = {
      ...options.user,
      name: deviceName,
      displayName: deviceName,
    };

    const credential = await registerPasskey({
      challenge: options.challenge,
      rp: options.rp,
      user: userWithDeviceName,
      pubKeyCredParams: options.pubKeyCredParams,
      timeout: options.timeout,
      attestation: options.attestation,
      authenticatorSelection: options.authenticatorSelection,
    });

    const deviceType: PasskeyDeviceType = PPC.VALUES.DEVICE_TYPE_PLATFORM;
    const result = await dispatch(createPasskeyThunk({ credential, deviceName, deviceType }));

    if (createPasskeyThunk.fulfilled.match(result)) {
      message.success(PPC.LABELS.MESSAGES.CREATED(deviceName));
    } else {
      const errorMessage = rejectionMessage(
        result.payload,
        AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED,
      );
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED;
    message.error(errorMessage);
    throw error;
  } finally {
    setSubmitting(false);
  }
};

export const handleUpdatePasskey = async ({
  passkey,
  deviceName,
  dispatch,
  setSubmitting,
  message,
}: UpdatePasskeyHandlerParams): Promise<void> => {
  if (!deviceName) {
    throw new Error(PPC.ERRORS.DEVICE_NAME_REQUIRED);
  }

  setSubmitting(true);
  try {
    const updateRequest: UpdatePasskeyRequest = {
      deviceName,
    };
    const result = await dispatch(
      updatePasskeyThunk({ credentialId: passkey.credentialId, request: updateRequest }),
    );

    if (updatePasskeyThunk.fulfilled.match(result)) {
      message.success(PPC.LABELS.MESSAGES.UPDATED(deviceName));
    } else {
      const errorMessage = rejectionMessage(
        result.payload,
        AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED,
      );
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
    message.error(errorMessage);
    throw error;
  } finally {
    setSubmitting(false);
  }
};

export const handleDeletePasskey = async ({
  passkey,
  forceLastDelete,
  dispatch,
  message,
}: DeletePasskeyHandlerParams): Promise<void> => {
  try {
    const result = await dispatch(
      deletePasskeyThunk({ credentialId: passkey.credentialId, request: { forceLastDelete } }),
    );
    if (deletePasskeyThunk.fulfilled.match(result)) {
      message.success(PPC.LABELS.MESSAGES.DELETED(passkey.deviceName || ''));
    } else {
      const errorMessage = rejectionMessage(
        result.payload,
        AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED,
      );
      message.error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;
    message.error(errorMessage);
  }
};
