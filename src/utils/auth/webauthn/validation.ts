import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import { isWebAuthnSupported, base64UrlToArrayBuffer } from './core';
import type { LoginStartResponse } from '../../../interfaces/auth/credentials';
import { extractCredentialIds } from './extraction';

export const browserHasCredential = async (
  credentialId: string,
  rpId?: string,
): Promise<boolean> => {
  if (!isWebAuthnSupported()) {
    return false;
  }

  try {
    const challenge = new Uint8Array(32);
    globalThis.crypto.getRandomValues(challenge);
    const credentialIdBuffer = base64UrlToArrayBuffer(credentialId);

    const credential = await globalThis.navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: rpId || globalThis.location.hostname,
        allowCredentials: [
          {
            id: credentialIdBuffer,
            type: LOGIN_CONSTANTS.WEBAUTHN.CREDENTIAL_TYPE,
          },
        ],
        userVerification: 'discouraged', // Don't require user interaction
        timeout: 1000, // Short timeout since we're just checking existence
      },
    });

    return !!credential;
  } catch (error) {
    if (error instanceof Error) {
      const errorName = error.name;
      if (
        errorName === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED ||
        errorName === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE ||
        errorName === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND
      ) {
        return false;
      }
    }
    return false;
  }
};

export const detectOrphanedPasskeys = async (
  passkeys: Array<{ credentialId: string }>,
  rpId?: string,
): Promise<string[]> => {
  if (!isWebAuthnSupported() || passkeys.length === 0) {
    return [];
  }

  const orphanedCredentialIds: string[] = [];

  for (const passkey of passkeys) {
    const hasInBrowser = await browserHasCredential(passkey.credentialId, rpId);
    if (!hasInBrowser) {
      orphanedCredentialIds.push(passkey.credentialId);
    }
  }

  return orphanedCredentialIds;
};

export const validateBackendPasskeysInBrowser = async (
  loginStartResponse: LoginStartResponse,
): Promise<{ hasValidPasskeys: boolean; orphanedCredentialIds: string[] }> => {
  const credentialIds = extractCredentialIds(loginStartResponse);
  if (credentialIds.length === 0) {
    return { hasValidPasskeys: false, orphanedCredentialIds: [] };
  }

  const orphanedCredentialIds: string[] = [];
  let hasValidPasskeys = false;

  for (const credentialId of credentialIds) {
    const existsInBrowser = await browserHasCredential(credentialId);
    if (!existsInBrowser) {
      orphanedCredentialIds.push(credentialId);
    } else {
      hasValidPasskeys = true;
    }
  }

  return { hasValidPasskeys, orphanedCredentialIds };
};

