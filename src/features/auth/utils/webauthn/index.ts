export {
  base64UrlToArrayBuffer,
  base64UrlToBase64,
  isWebAuthnSupported,
  authenticateWithPasskey,
  registerPasskey,
} from './core';
export { extractLoginOptions, extractCredentialIds, hasBackendPasskeys } from './extraction';
export {
  addBase64Padding,
  convertCredentialDescriptor,
  convertCredentialDescriptors,
  handleWebAuthnError,
  isErrorName,
} from './shared';
export {
  browserHasCredential,
  detectOrphanedPasskeys,
  validateBackendPasskeysInBrowser,
} from './validation';
export {
  isCancelledOrNoCredentialError,
  isUserCancelledError,
  isNoCredentialFoundError,
} from './errors';
