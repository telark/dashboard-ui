import type {
  PublicKeyCredentialRequestOptions,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredential,
} from '../../interfaces/auth';

/**
 * Convert base64url string to ArrayBuffer
 */
const base64UrlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Convert ArrayBuffer to base64url string
 */
const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = globalThis.btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Convert PublicKeyCredentialRequestOptions to WebAuthn format
 */
const convertRequestOptions = (
  options: PublicKeyCredentialRequestOptions,
): CredentialRequestOptions => {
  const publicKey: globalThis.PublicKeyCredentialRequestOptions = {
    challenge: base64UrlToArrayBuffer(options.challenge),
    timeout: options.timeout,
    rpId: options.rpId,
    userVerification: options.userVerification || 'preferred',
  };

  if (options.allowCredentials) {
    publicKey.allowCredentials = options.allowCredentials.map((cred) => ({
      id: base64UrlToArrayBuffer(cred.id),
      type: 'public-key' as const,
      transports: cred.transports,
    }));
  }

  return { publicKey };
};

/**
 * Convert PublicKeyCredentialCreationOptions to WebAuthn format
 */
const convertCreationOptions = (
  options: PublicKeyCredentialCreationOptions,
): CredentialCreationOptions => {
  const publicKey: globalThis.PublicKeyCredentialCreationOptions = {
    challenge: base64UrlToArrayBuffer(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: base64UrlToArrayBuffer(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation || 'none',
  };

  if (options.authenticatorSelection) {
    publicKey.authenticatorSelection = options.authenticatorSelection;
  }

  if (options.excludeCredentials) {
    publicKey.excludeCredentials = options.excludeCredentials.map((cred) => ({
      id: base64UrlToArrayBuffer(cred.id),
      type: 'public-key' as const,
      transports: cred.transports,
    }));
  }

  return { publicKey };
};

/**
 * Convert WebAuthn credential to our format
 */
const convertCredential = (credential: globalThis.PublicKeyCredential): PublicKeyCredential => {
  const response = credential.response;

  if (response instanceof globalThis.AuthenticatorAttestationResponse) {
    return {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: 'public-key',
      response: {
        attestationObject: arrayBufferToBase64Url(response.attestationObject),
        clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      },
    };
  } else if (response instanceof globalThis.AuthenticatorAssertionResponse) {
    return {
      id: credential.id,
      rawId: arrayBufferToBase64Url(credential.rawId),
      type: 'public-key',
      response: {
        authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
        clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
        signature: arrayBufferToBase64Url(response.signature),
        userHandle: response.userHandle
          ? arrayBufferToBase64Url(response.userHandle)
          : null,
      },
    };
  }

  throw new Error('Unsupported credential response type');
};

/**
 * Check if WebAuthn is supported in the browser
 */
export const isWebAuthnSupported = (): boolean => {
  return (
    typeof globalThis.PublicKeyCredential !== 'undefined' &&
    typeof globalThis.navigator?.credentials?.create === 'function' &&
    typeof globalThis.navigator?.credentials?.get === 'function'
  );
};

/**
 * Authenticate user with passkey (login)
 */
export const authenticateWithPasskey = async (
  options: PublicKeyCredentialRequestOptions,
): Promise<PublicKeyCredential> => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  try {
    const credential = (await globalThis.navigator.credentials.get(
      convertRequestOptions(options),
    )) as globalThis.PublicKeyCredential | null;

    if (!credential) {
      throw new Error('User cancelled authentication or no credential found');
    }

    return convertCredential(credential);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('User cancelled authentication');
      }
      if (error.name === 'InvalidStateError') {
        throw new Error('The operation is not allowed');
      }
      if (error.name === 'NotSupportedError') {
        throw new Error('WebAuthn is not supported');
      }
      throw error;
    }
    throw new Error('Authentication failed');
  }
};

/**
 * Register new passkey (create credential)
 */
export const registerPasskey = async (
  options: PublicKeyCredentialCreationOptions,
): Promise<PublicKeyCredential> => {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn is not supported in this browser');
  }

  try {
    const credential = (await globalThis.navigator.credentials.create(
      convertCreationOptions(options),
    )) as globalThis.PublicKeyCredential | null;

    if (!credential) {
      throw new Error('User cancelled registration or credential creation failed');
    }

    return convertCredential(credential);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('User cancelled registration');
      }
      if (error.name === 'InvalidStateError') {
        throw new Error('The operation is not allowed');
      }
      if (error.name === 'NotSupportedError') {
        throw new Error('WebAuthn is not supported');
      }
      if (error.name === 'ConstraintError') {
        throw new Error('Constraint validation failed');
      }
      throw error;
    }
    throw new Error('Registration failed');
  }
};

