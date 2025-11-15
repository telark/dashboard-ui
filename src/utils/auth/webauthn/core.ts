import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import type {
  PublicKeyCredentialRequestOptions,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredential,
} from '../../../interfaces/auth/credentials';

import { addBase64Padding, convertCredentialDescriptors, handleWebAuthnError } from './shared';

export const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_DASH,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_WITH_PLUS,
    )
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_UNDERSCORE,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_WITH_SLASH,
    );
  const paddedBase64 = addBase64Padding(base64);

  const binary = globalThis.atob(paddedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = globalThis.btoa(binary);
  return base64
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64_TO_BASE64URL.REPLACE_PLUS,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64_TO_BASE64URL.REPLACE_WITH_DASH,
    )
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64_TO_BASE64URL.REPLACE_SLASH,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64_TO_BASE64URL.REPLACE_WITH_UNDERSCORE,
    )
    .replace(LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64_TO_BASE64URL.REPLACE_TRAILING_EQUALS, '');
};

export const base64UrlToBase64 = (base64url: string): string => {
  const base64 = base64url
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_DASH,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_WITH_PLUS,
    )
    .replace(
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_UNDERSCORE,
      LOGIN_CONSTANTS.WEBAUTHN.REGEX.BASE64URL_TO_BASE64.REPLACE_WITH_SLASH,
    );
  return addBase64Padding(base64);
};

const convertRequestOptions = (
  options: PublicKeyCredentialRequestOptions,
): globalThis.CredentialRequestOptions => {
  const publicKey: globalThis.PublicKeyCredentialRequestOptions = {
    challenge: base64UrlToArrayBuffer(options.challenge),
    timeout: options.timeout,
    rpId: options.rpId,
    userVerification: options.userVerification || LOGIN_CONSTANTS.WEBAUTHN.USER_VERIFICATION,
  };

  if (options.allowCredentials && options.allowCredentials.length > 0) {
    const converted = convertCredentialDescriptors(
      options.allowCredentials,
      base64UrlToArrayBuffer,
    );
  }

  return { publicKey };
};

const convertCreationOptions = (
  options: PublicKeyCredentialCreationOptions,
): globalThis.CredentialCreationOptions => {
  const publicKey: globalThis.PublicKeyCredentialCreationOptions = {
    challenge: base64UrlToArrayBuffer(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: base64UrlToArrayBuffer(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation || LOGIN_CONSTANTS.WEBAUTHN.ATTESTATION,
  };

  publicKey.authenticatorSelection = {
    ...options.authenticatorSelection,
    requireResidentKey: true,
    residentKey: 'required',
  };

  return { publicKey };
};

const convertCredential = (credential: globalThis.PublicKeyCredential): PublicKeyCredential => {
  const response = credential.response;

  if (response instanceof globalThis.AuthenticatorAttestationResponse) {
    const result: PublicKeyCredential = {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
      response: {
        attestationObject: arrayBufferToBase64Url(response.attestationObject),
        clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      },
    };

    if (credential.getClientExtensionResults) {
      result.getClientExtensionResults = credential.getClientExtensionResults() as Record<
        string,
        unknown
      >;
    }

    return result;
  } else if (response instanceof globalThis.AuthenticatorAssertionResponse) {
    return {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
      response: {
        authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
        clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
        signature: arrayBufferToBase64Url(response.signature),
        userHandle: response.userHandle ? arrayBufferToBase64Url(response.userHandle) : null,
      },
    };
  }

  throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.UNSUPPORTED_RESPONSE_TYPE);
};

export const isWebAuthnSupported = (): boolean => {
  return (
    typeof globalThis.PublicKeyCredential !== 'undefined' &&
    typeof globalThis.navigator?.credentials?.create === 'function' &&
    typeof globalThis.navigator?.credentials?.get === 'function'
  );
};

export const authenticateWithPasskey = async (
  options: PublicKeyCredentialRequestOptions,
): Promise<PublicKeyCredential> => {
  if (!isWebAuthnSupported()) {
    throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED);
  }

  try {
    const credential = (await globalThis.navigator.credentials.get(
      convertRequestOptions(options),
    )) as globalThis.PublicKeyCredential | null;

    if (!credential) {
      throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NO_CREDENTIAL_FOUND);
    }

    return convertCredential(credential);
  } catch (error) {
    if (error instanceof Error) {
      const errorMap: Record<string, string> = {
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_AUTH,
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.OPERATION_NOT_ALLOWED,
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_SUPPORTED]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED_ERROR,
      };
      throw handleWebAuthnError(
        error,
        errorMap,
        LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.AUTHENTICATION_FAILED,
      );
    }
    throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.AUTHENTICATION_FAILED);
  }
};

export const registerPasskey = async (
  options: PublicKeyCredentialCreationOptions,
): Promise<PublicKeyCredential> => {
  if (!isWebAuthnSupported()) {
    throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED);
  }

  try {
    const creationOptions = convertCreationOptions(options);
    const credential = (await globalThis.navigator.credentials.create(
      creationOptions,
    )) as globalThis.PublicKeyCredential | null;
    if (!credential) {
      throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.REGISTRATION_CANCELLED);
    }

    return convertCredential(credential);
  } catch (error) {
    if (error instanceof Error) {
      const errorMap: Record<string, string> = {
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_REGISTRATION,
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.OPERATION_NOT_ALLOWED,
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_SUPPORTED]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED_ERROR,
        [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.CONSTRAINT]:
          LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.CONSTRAINT_VALIDATION_FAILED,
      };
      throw handleWebAuthnError(
        error,
        errorMap,
        LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.REGISTRATION_FAILED,
      );
    }
    throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.REGISTRATION_FAILED);
  }
};

export {
  browserHasCredential,
  detectOrphanedPasskeys,
  validateBackendPasskeysInBrowser,
} from './validation';
export { extractLoginOptions, extractCredentialIds, hasBackendPasskeys } from './extraction';
export { isCancelledOrNoCredentialError, isNoCredentialFoundError, isUserCancelledError } from './errors';
