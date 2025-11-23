import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants/passkeys';
import type { ValidateDeviceNameOptions, Passkey } from '../../models/passkeys';

export const validateDeviceName = ({
  value,
  existingPasskeys,
  isEditMode = false,
  currentDeviceName,
}: ValidateDeviceNameOptions): Promise<void> => {
  if (!value || value.trim() === '') {
    return Promise.resolve();
  }

  const trimmedName = value.trim();
  const exists = existingPasskeys.some((passkey) => {
    if (isEditMode && currentDeviceName === passkey.deviceName) {
      return false;
    }
    return passkey.deviceName?.toLowerCase() === trimmedName.toLowerCase();
  });

  if (exists) {
    return Promise.reject(new Error(PPC.FORM.DEVICE_NAME_DUPLICATE));
  }

  return Promise.resolve();
};

export const createDeviceNameValidator = (
  existingPasskeys: Passkey[],
  isEditMode: boolean,
  currentDeviceName?: string,
) => {
  return (_: unknown, value: string) =>
    validateDeviceName({
      value,
      existingPasskeys,
      isEditMode,
      currentDeviceName,
    });
};
