export {
  extractRegisterOptions,
  performRegister,
  buildEnrollUrl,
  isEnrollLink,
} from './flow/register';
export { prepareLoginFinishRequest, performLogin } from './flow/login';
export type { OrphanedPasskeysInfo } from './flow/login';

export { handleUserLogout } from './logout/logout';

export { createDeviceNameValidator } from './passkey/validation';
export { handleCreatePasskey, handleUpdatePasskey, handleDeletePasskey } from './passkey/handlers';

export { getDeviceInfo } from './passkey/device/detection';
export { generateDeviceNameSuggestions } from './passkey/device/suggestions';

export {
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  CURRENT_USER_UPDATED_EVENT,
} from './session/user';
export { isSessionExpired, validateSession } from './session/validation';
export { useSessionExpirationCheck } from './session/expiration';
export type { UseSessionExpirationCheckOptions } from './session/expiration';
export {
  getSessionToken,
  setSessionToken,
  removeSessionToken,
  hasSessionToken,
  getCurrentSessionName,
  createSessionTokenInterceptor,
} from './session/token';

export { handleAuthError } from './shared/errors';

export {
  base64UrlToArrayBuffer,
  isWebAuthnSupported,
  authenticateWithPasskey,
  registerPasskey,
} from './webauthn/core';
export {
  extractLoginOptions,
  extractCredentialIds,
  hasBackendPasskeys,
} from './webauthn/extraction';
export {
  addBase64Padding,
  convertCredentialDescriptor,
  convertCredentialDescriptors,
  handleWebAuthnError,
  isErrorName,
} from './webauthn/shared';
export { browserHasCredential } from './webauthn/validation';
