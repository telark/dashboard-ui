import { LOGIN_CONSTANTS } from '../../constants/login';
import { isWebAuthnSupported, base64UrlToArrayBuffer } from './core';

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
  } catch {
    return false;
  }
};
