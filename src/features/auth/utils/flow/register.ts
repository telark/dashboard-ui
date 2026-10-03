import { registerStart } from '../../clients/register';
import { createPasskey } from '../../clients/passkeys';
import { registerPasskey } from '../webauthn/core';
import { AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { APP_ROUTES } from '../../../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import type {
  EnrollLink,
  RegisterStartResponse,
  PublicKeyCredentialCreationOptions,
  PasskeyDeviceType,
} from '../../models';
import type { MessageInstance } from 'antd/lib/message/interface';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';

// The page strips the link from the address bar; the tab keeps it so a reload still enrolls.
export const resolveEnrollLink = (token: string | null, email: string | null): EnrollLink => {
  const fromLink: EnrollLink = token === null ? {} : { token, email: email || undefined };
  try {
    if (token === null) {
      const stored = globalThis.sessionStorage.getItem(REGISTER_CONSTANTS.ENROLL_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as EnrollLink) : {};
    }
    globalThis.sessionStorage.setItem(
      REGISTER_CONSTANTS.ENROLL_STORAGE_KEY,
      JSON.stringify(fromLink),
    );
  } catch {
    // Storage blocked or unreadable: only the link itself, held in page state, is used.
  }
  return fromLink;
};

// Auth spends a link on first use, so any 401 while enrolling means the link can't be used again.
export const isEnrollLinkRefused = (error: unknown): boolean =>
  (error as ExtendedAxiosError | undefined)?.normalized?.isUnauthenticated === true;

// The email only fills in the register form; the server still checks it against the link's account.
export const buildEnrollUrl = (token: string, email?: string): string => {
  const query = new URLSearchParams({ [REGISTER_CONSTANTS.QUERY.ENROLL]: token });
  if (email) {
    query.set(REGISTER_CONSTANTS.QUERY.EMAIL, email);
  }
  return `${globalThis.location.origin}${APP_ROUTES.REGISTER}?${query.toString()}`;
};

const clearEnrollToken = (): void => {
  try {
    globalThis.sessionStorage.removeItem(REGISTER_CONSTANTS.ENROLL_STORAGE_KEY);
  } catch {
    // Storage blocked: nothing was stored.
  }
};

export const extractRegisterOptions = (
  registerStartResponse: RegisterStartResponse,
): PublicKeyCredentialCreationOptions => {
  // excludeCredentials is intentionally excluded - using discoverable credentials (resident keys)

  let options: PublicKeyCredentialCreationOptions;
  if (registerStartResponse.options?.publicKey) {
    const publicKey = registerStartResponse.options.publicKey;
    options = {
      challenge: publicKey.challenge,
      rp: publicKey.rp,
      user: publicKey.user,
      pubKeyCredParams: publicKey.pubKeyCredParams,
      timeout: publicKey.timeout,
      attestation: publicKey.attestation,
      authenticatorSelection: publicKey.authenticatorSelection,
    };
  } else if (registerStartResponse.options?.response) {
    options = { ...registerStartResponse.options.response };
    delete options.excludeCredentials;
  } else if (registerStartResponse.challenge) {
    options = {
      challenge: registerStartResponse.challenge,
      rp: registerStartResponse.rp!,
      user: registerStartResponse.user!,
      pubKeyCredParams: registerStartResponse.pubKeyCredParams!,
      timeout: registerStartResponse.timeout,
      attestation: registerStartResponse.attestation,
      authenticatorSelection: registerStartResponse.authenticatorSelection,
    };
  } else {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.INVALID_RESPONSE_STRUCTURE, registerStartResponse);
    }
    throw new Error(LOGIN_CONSTANTS.MESSAGES.INVALID_RESPONSE);
  }

  return options;
};

export const performRegister = async (
  email: string,
  deviceName: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  enrollToken?: string,
): Promise<void> => {
  // The server spends the token on first presentation, so a reload can't reuse it after this.
  const registerStartResponse = await registerStart(email, enrollToken).finally(clearEnrollToken);
  const options = extractRegisterOptions(registerStartResponse);

  // Override user.name and user.displayName with device name so browser shows device name in selection popup
  const userWithDeviceName = {
    ...options.user,
    name: deviceName,
    displayName: deviceName,
  };

  const credential = await registerPasskey({
    challenge: options.challenge,
    rp: options.rp,
    user: userWithDeviceName,
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    authenticatorSelection: options.authenticatorSelection,
    excludeCredentials: options.excludeCredentials,
  });

  const deviceType: PasskeyDeviceType = 'platform';
  await createPasskey(credential, deviceName, deviceType, email);

  messageApi.open({
    type: 'success',
    content: AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS,
    duration: 2,
  });

  if (onSuccess) {
    onSuccess();
  }
};
