import { loginStart, loginFinish } from '../../clients/login';
import { logout } from '../../clients/logout';
import { authenticateWithPasskey } from '../webauthn/core';
import {
  extractLoginOptions,
  extractCredentialIds,
  hasBackendPasskeys,
} from '../webauthn/extraction';
import { setCurrentUser } from '../session/user';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import store from '../../../../store';
import { APP_CONFIGS } from '../../../../constants';
import { AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { getLoginRefusalMessage } from '../shared/errors';
import { getClientMetadata } from '../device/metadata';
import type { LoginStartResponse, AuthenticatorAssertionResponse } from '../../models';
import type { MessageInstance } from 'antd/lib/message/interface';
import logger from '../../../../logging';

export const prepareLoginFinishRequest = (
  email: string,
  credential: { id: string; rawId: string; response: AuthenticatorAssertionResponse; type: string },
) => {
  const { browser, device, os, userAgent } = getClientMetadata();
  return {
    email,
    id: credential.id,
    rawId: credential.rawId,
    response: {
      authenticatorData: credential.response.authenticatorData,
      clientDataJSON: credential.response.clientDataJSON,
      signature: credential.response.signature,
      userHandle: credential.response.userHandle || null,
    },
    type: credential.type,
    browser,
    device,
    os,
    userAgent,
  };
};

export interface OrphanedPasskeysInfo {
  credentialIds: string[];
  userId: string;
  errorName?: string;
}

const ORPHANED_PASSKEY_ERROR_NAMES: readonly string[] = [
  LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED,
  LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND,
];

// Only the browser failing to use one of the account's passkeys (none available, prompt
// dismissed) points at orphaned passkeys; a server error at login finish must not.
const getOrphanedPasskeysInfo = (
  error: unknown,
  loginStartResponse: LoginStartResponse | null,
): OrphanedPasskeysInfo | null => {
  const errorName = (error as Error & { originalErrorName?: string })?.originalErrorName;
  if (
    !loginStartResponse ||
    !errorName ||
    !ORPHANED_PASSKEY_ERROR_NAMES.includes(errorName) ||
    !hasBackendPasskeys(loginStartResponse)
  ) {
    return null;
  }
  const credentialIds = extractCredentialIds(loginStartResponse);
  const userId = loginStartResponse.userId;
  return credentialIds.length > 0 && userId ? { credentialIds, userId, errorName } : null;
};

export const performLogin = async (
  email: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  onShowOrphanedModal?: (info: OrphanedPasskeysInfo) => void,
): Promise<void> => {
  let loginStartResponse: LoginStartResponse | null = null;
  try {
    loginStartResponse = await loginStart({ email });

    const options = extractLoginOptions(loginStartResponse);
    const credential = await authenticateWithPasskey({
      challenge: options.challenge,
      timeout: options.timeout,
      rpId: options.rpId,
      allowCredentials: options.allowCredentials,
      userVerification: options.userVerification || LOGIN_CONSTANTS.WEBAUTHN.USER_VERIFICATION,
    });

    const assertionResponse = credential.response as AuthenticatorAssertionResponse;
    const loginFinishResponse = await loginFinish(
      prepareLoginFinishRequest(email, {
        id: credential.id,
        rawId: credential.rawId,
        response: assertionResponse,
        type: credential.type,
      }),
    );

    // The session is in auth's cookie; the stored user is what "signed in" means here.
    if (!loginFinishResponse.user || !setCurrentUser(loginFinishResponse.user)) {
      // Auth set the cookie already: end that session rather than leave it behind.
      logout().catch(() => undefined);
      throw new Error(LOGIN_CONSTANTS.SESSION.SET_FAILED);
    }

    // Permissions before entering the app: the sidebar then renders its gated entries at once
    // instead of popping them in and pushing the rest down.
    await store.dispatch(fetchMyPermissionsThunk());
    messageApi.open({
      type: 'success',
      content: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      duration: APP_CONFIGS.MESSAGE.AUTH_SUCCESS_DURATION_S,
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    // The login card shows every error inline, once: a refused account skips the passkeys modal.
    if (getLoginRefusalMessage(error)) throw error;

    // Backend passkeys the browser could not use: the user confirms cleanup in a modal first.
    const orphanedInfo = getOrphanedPasskeysInfo(error, loginStartResponse);
    if (orphanedInfo && onShowOrphanedModal) {
      onShowOrphanedModal(orphanedInfo);
      return;
    }

    logger.warn(LOGIN_CONSTANTS.LOGS.AUTH_ERROR, error);
    throw error;
  }
};
