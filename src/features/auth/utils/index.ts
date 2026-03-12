// Flow
export { extractRegisterOptions, performRegister } from './flow/register';
export { prepareLoginFinishRequest, cleanupOrphanedPasskeys, performLogin } from './flow/login';
export type { OrphanedPasskeysInfo } from './flow/login';

// Logout
export { handleUserLogout } from './logout/logout';

// Passkey
export { createDeviceNameValidator } from './passkey/validation';
export { handleCreatePasskey, handleUpdatePasskey, handleDeletePasskey } from './passkey/handlers';

// Passkey Device
export { getDeviceInfo } from './passkey/device/detection';
export { generateDeviceNameSuggestions } from './passkey/device/suggestions';

// Session
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
  createSessionTokenInterceptor,
} from './session/token';

// Shared
export { handleAuthError } from './shared/errors';

// WebAuthn
export {
  base64UrlToArrayBuffer,
  base64UrlToBase64,
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
export {
  browserHasCredential,
  detectOrphanedPasskeys,
  validateBackendPasskeysInBrowser,
} from './webauthn/validation';
export {
  isCancelledOrNoCredentialError,
  isUserCancelledError,
  isNoCredentialFoundError,
} from './webauthn/errors';
