import { LOGIN_CONSTANTS } from '../../../constants/pages/login';

export const isCancelledOrNoCredentialError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes(LOGIN_CONSTANTS.WEBAUTHN.ERROR_PATTERNS.USER_CANCELLED_AUTH) ||
    errorMessage.includes(LOGIN_CONSTANTS.WEBAUTHN.ERROR_PATTERNS.NO_CREDENTIAL_FOUND) ||
    errorMessage === LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_AUTH.toLowerCase() ||
    errorMessage === LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NO_CREDENTIAL_FOUND.toLowerCase()
  );
};

export const isUserCancelledError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes(LOGIN_CONSTANTS.WEBAUTHN.ERROR_PATTERNS.USER_CANCELLED_AUTH) ||
    errorMessage === LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_AUTH.toLowerCase()
  );
};

export const isNoCredentialFoundError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes(LOGIN_CONSTANTS.WEBAUTHN.ERROR_PATTERNS.NO_CREDENTIAL_FOUND) ||
    errorMessage === LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NO_CREDENTIAL_FOUND.toLowerCase()
  );
};
