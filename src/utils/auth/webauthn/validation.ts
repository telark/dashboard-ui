import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import { isWebAuthnSupported, base64UrlToArrayBuffer } from './core';
import { isErrorName } from './shared';
import type { LoginStartResponse } from '../../../interfaces/auth/credentials';
import { extractCredentialIds, extractLoginOptions } from './extraction';

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
        userVerification: LOGIN_CONSTANTS.WEBAUTHN.USER_VERIFICATION_DISCOURAGED,
        timeout: LOGIN_CONSTANTS.WEBAUTHN.TIMEOUT.VALIDATION_CHECK,
      },
    });

    return !!credential;
  } catch (error) {
    if (
      isErrorName(error, [
        LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED,
        LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE,
        LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND,
      ])
    ) {
      return false;
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

  const options = extractLoginOptions(loginStartResponse);
  const rpId = options.rpId;

  const orphanedCredentialIds: string[] = [];
  let hasValidPasskeys = false;

  for (const credentialId of credentialIds) {
    const existsInBrowser = await browserHasCredential(credentialId, rpId);
    if (existsInBrowser) {
      hasValidPasskeys = true;
    } else {
      orphanedCredentialIds.push(credentialId);
    }
  }

  return { hasValidPasskeys, orphanedCredentialIds };
};
