import { registerStart } from '../../clients/register';
import { createPasskey } from '../../clients/passkeys';
import { registerPasskey } from '../webauthn/core';
import { AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { APP_CONFIGS, APP_ROUTES } from '../../../../constants';
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

// The token rides in the fragment, which no server or access log sees; older links carry it in the query.
const enrollLinkParams = (search: string, hash: string): URLSearchParams => {
  const query = new URLSearchParams(search);
  return query.has(REGISTER_CONSTANTS.QUERY.ENROLL) ? query : new URLSearchParams(hash.slice(1));
};

// The page strips the link from the address bar; the tab keeps it so a reload still enrolls.
export const resolveEnrollLink = (search: string, hash: string): EnrollLink => {
  const params = enrollLinkParams(search, hash);
  const token = params.get(REGISTER_CONSTANTS.QUERY.ENROLL);
  const email = params.get(REGISTER_CONSTANTS.QUERY.EMAIL);
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

// A failed passkey verification is a 401 too and keeps the link: auth's message tells them apart.
export const isEnrollLinkRefused = (error: unknown): boolean => {
  const normalized = (error as ExtendedAxiosError | undefined)?.normalized;
  return (
    normalized?.isUnauthenticated === true &&
    normalized.message.toLowerCase().includes(REGISTER_CONSTANTS.ERROR_PATTERNS.ENROLL_LINK_REFUSED)
  );
};

// A signed-in browser keeps the register page for an enrollment link instead of leaving with its token.
export const isEnrollLink = (pathname: string, search: string, hash: string): boolean =>
  pathname === APP_ROUTES.REGISTER &&
  enrollLinkParams(search, hash).has(REGISTER_CONSTANTS.QUERY.ENROLL);

// The email only fills in the register form; the server still checks it against the link's account.
export const buildEnrollUrl = (token: string, email?: string): string => {
  const params = new URLSearchParams({ [REGISTER_CONSTANTS.QUERY.ENROLL]: token });
  if (email) {
    params.set(REGISTER_CONSTANTS.QUERY.EMAIL, email);
  }
  return `${globalThis.location.origin}${APP_ROUTES.REGISTER}#${params.toString()}`;
};

export const clearEnrollToken = (): void => {
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
  const registerStartResponse = await registerStart(email, enrollToken);
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
  // Auth spends the link only here, so a failed ceremony can retry with it, even after a reload.
  clearEnrollToken();

  messageApi.open({
    type: 'success',
    content: AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS,
    duration: APP_CONFIGS.MESSAGE.AUTH_SUCCESS_DURATION_S,
  });

  if (onSuccess) {
    onSuccess();
  }
};
