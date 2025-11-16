import { message } from 'antd';
import { registerStart } from '../../../clients/auth';
import { registerPasskey } from '../webauthn';
import { extractRegisterOptions } from '../flows/register';
import { AUTH_ERROR_MESSAGES } from '../../../constants/auth';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../constants/pages/passkeys';
import {
  createPasskeyThunk,
  updatePasskeyThunk,
  deletePasskeyThunk,
} from '../../../store/passkeys/slices/passkeySlice';
import type {
  UpdatePasskeyRequest,
  CreatePasskeyHandlerParams,
  UpdatePasskeyHandlerParams,
  DeletePasskeyHandlerParams,
} from '../../../interfaces/auth/passkeys';
import type { PasskeyDeviceType } from '../../../interfaces/auth/types';

export const handleCreatePasskey = async ({
  deviceName,
  dispatch,
  setSubmitting,
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
      const errorMessage =
        result.payload instanceof Error
          ? result.payload.message
          : AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED;
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
}: UpdatePasskeyHandlerParams): Promise<void> => {
  if (!deviceName) {
    throw new Error(PPC.ERRORS.DEVICE_NAME_REQUIRED);
  }

  const deviceNameChanged = deviceName !== passkey.deviceName;

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

      if (deviceNameChanged) {
        message.info(PPC.LABELS.MESSAGES.BROWSER_NAME_WONT_UPDATE, 6);
      }
    } else {
      const errorMessage =
        result.payload instanceof Error
          ? result.payload.message
          : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
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
}: DeletePasskeyHandlerParams): Promise<void> => {
  try {
    const result = await dispatch(
      deletePasskeyThunk({ credentialId: passkey.credentialId, request: { forceLastDelete } }),
    );
    if (deletePasskeyThunk.fulfilled.match(result)) {
      message.success(PPC.LABELS.MESSAGES.DELETED(passkey.deviceName || ''));
    } else {
      const errorMessage =
        result.payload instanceof Error
          ? result.payload.message
          : AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;
      message.error(errorMessage);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;
    message.error(errorMessage);
  }
};

