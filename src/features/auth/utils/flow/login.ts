import { loginStart, loginFinish } from '../../clients/login';
import { authenticateWithPasskey } from '../webauthn/core';
import {
  extractLoginOptions,
  extractCredentialIds,
  hasBackendPasskeys,
} from '../webauthn/extraction';
import { setSessionToken } from '../session/token';
import { setCurrentUser } from '../session/user';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import store from '../../../../store';
import { AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { getLoginRefusalMessage, handleAuthError } from '../shared/errors';
import { getClientMetadata } from '../device/metadata';
import type { LoginStartResponse, AuthenticatorAssertionResponse } from '../../models';
import type { MessageInstance } from 'antd/lib/message/interface';

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

export const performLogin = async (
  email: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  onUserNotFound?: () => void,
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

    try {
      setSessionToken(loginFinishResponse.sessionToken);
      if (loginFinishResponse.user) {
        setCurrentUser(loginFinishResponse.user);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }

    // Permissions before entering the app: the sidebar then renders its gated entries at once
    // instead of popping them in and pushing the rest down.
    await store.dispatch(fetchMyPermissionsThunk());
    messageApi.open({
      type: 'success',
      content: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      duration: 2,
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    // The login card shows a refused account inline: no passkeys modal, no toast.
    if (getLoginRefusalMessage(error)) throw error;

    // Backend passkeys the browser could not use: the user confirms cleanup in a modal first.
    if (loginStartResponse && hasBackendPasskeys(loginStartResponse) && onShowOrphanedModal) {
      const originalErrorName = (error as Error & { originalErrorName?: string })
        ?.originalErrorName;
      const credentialIds = extractCredentialIds(loginStartResponse);
      const userId = loginStartResponse.userId;

      if (credentialIds.length > 0 && userId) {
        onShowOrphanedModal({
          credentialIds,
          userId,
          errorName: originalErrorName,
        });
        return;
      }
    }

    handleAuthError(error, messageApi, {
      onUserNotFound,
    });
    throw error;
  }
};
