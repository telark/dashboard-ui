import { LOGIN_CONSTANTS } from '../../constants/login';
import logger from '../../../../logging';
import type { PublicKeyCredentialDescriptor } from '../../models/credentials';

export const addBase64Padding = (base64: string): string => {
  let padded = base64;
  while (padded.length % 4) {
    padded += '=';
  }
  return padded;
};

export const convertCredentialDescriptor = (
  cred: PublicKeyCredentialDescriptor,
  base64UrlToArrayBufferFn: (base64url: string) => ArrayBuffer,
): globalThis.PublicKeyCredentialDescriptor => {
  try {
    const arrayBuffer = base64UrlToArrayBufferFn(cred.id);
    return {
      id: arrayBuffer,
      type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
      transports: cred.transports,
    };
  } catch (error) {
    logger.error('[WebAuthn] Failed to convert credential ID:', cred.id, error);
    throw error;
  }
};

export const convertCredentialDescriptors = (
  credentials: PublicKeyCredentialDescriptor[],
  base64UrlToArrayBufferFn: (base64url: string) => ArrayBuffer,
): globalThis.PublicKeyCredentialDescriptor[] => {
  return credentials.map((cred) => convertCredentialDescriptor(cred, base64UrlToArrayBufferFn));
};

type ErrorHandlerMap = Record<string, string>;

export const handleWebAuthnError = (
  error: Error,
  errorMap: ErrorHandlerMap,
  defaultMessage: string,
): Error => {
  const errorMessage = errorMap[error.name];
  if (errorMessage) {
    return new Error(errorMessage);
  }
  return new Error(defaultMessage);
};

export const isErrorName = (error: unknown, errorNames: string[]): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  return errorNames.includes(error.name);
};
