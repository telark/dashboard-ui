import { APP_ROUTES } from '../../../constants';
import type { Passkey } from '../../../interfaces/auth/passkeys';

export const navigateToPasskeyView = (deviceName: string): string => {
  return APP_ROUTES.PASSKEY_VIEW.replace(':id', encodeURIComponent(deviceName));
};

export const validatePasskeyForNavigation = (passkey: Passkey): boolean => {
  return !!passkey.deviceName;
};
