import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import type {
  PublicKeyCredentialRequestOptions,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredential,
} from '../../../interfaces/auth/credentials';

export const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  let paddedBase64 = base64;
  while (paddedBase64.length % 4) {
    paddedBase64 += '=';
  }
  
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
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const base64UrlToBase64 = (base64url: string): string => {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
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

  if (options.allowCredentials) {
    publicKey.allowCredentials = options.allowCredentials.map((cred) => ({
      id: base64UrlToArrayBuffer(cred.id),
      type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
      transports: cred.transports,
    }));
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

  if (options.authenticatorSelection) {
    publicKey.authenticatorSelection = options.authenticatorSelection;
  }

  if (options.excludeCredentials) {
    publicKey.excludeCredentials = options.excludeCredentials.map((cred) => ({
      id: base64UrlToArrayBuffer(cred.id),
      type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
      transports: cred.transports,
    }));
  }

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
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_AUTH);
      }
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.OPERATION_NOT_ALLOWED);
      }
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_SUPPORTED) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED_ERROR);
      }
      throw error;
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
    const credential = (await globalThis.navigator.credentials.create(
      convertCreationOptions(options),
    )) as globalThis.PublicKeyCredential | null;

    if (!credential) {
      throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.REGISTRATION_CANCELLED);
    }

    return convertCredential(credential);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.USER_CANCELLED_REGISTRATION);
      }
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.OPERATION_NOT_ALLOWED);
      }
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_SUPPORTED) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.NOT_SUPPORTED_ERROR);
      }
      if (error.name === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.CONSTRAINT) {
        throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.CONSTRAINT_VALIDATION_FAILED);
      }
      throw error;
    }
    throw new Error(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.REGISTRATION_FAILED);
  }
};

export { browserHasCredential, detectOrphanedPasskeys, validateBackendPasskeysInBrowser } from './validation';
export { extractLoginOptions, extractCredentialIds, hasBackendPasskeys } from './extraction';
export { isCancelledOrNoCredentialError } from './errors';