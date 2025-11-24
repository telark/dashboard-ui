import { loginStart, loginFinish } from '../../clients/login';
import { deletePasskey } from '../../clients/passkeys';
import { authenticateWithPasskey } from '../webauthn/core';
import {
  extractLoginOptions,
  extractCredentialIds,
  hasBackendPasskeys,
} from '../webauthn/extraction';
import { setSessionToken } from '../session/token';
import { setCurrentUser } from '../session/user';
import { AUTH_SUCCESS_MESSAGES, AUTH_ERROR_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { HTTP_STATUS } from '../../../../constants/rest/http';
import { handleAuthError } from '../shared/errors';
import type { LoginStartResponse, AuthenticatorAssertionResponse } from '../../models';
import type { MessageInstance } from 'antd/es/message/interface';

export const prepareLoginFinishRequest = (
  username: string,
  credential: { id: string; rawId: string; response: AuthenticatorAssertionResponse; type: string },
) => {
  return {
    username,
    id: credential.id,
    rawId: credential.rawId,
    response: {
      authenticatorData: credential.response.authenticatorData,
      clientDataJSON: credential.response.clientDataJSON,
      signature: credential.response.signature,
      userHandle: credential.response.userHandle || null,
    },
    type: credential.type,
  };
};

const isUnauthorizedError = (error: unknown): boolean => {
  const axiosError = error as any;
  const status = axiosError?.response?.status || axiosError?.normalized?.status;
  return status === HTTP_STATUS.UNAUTHORIZED;
};

const isNotFoundError = (error: unknown): boolean => {
  const axiosError = error as any;
  const status = axiosError?.response?.status || axiosError?.normalized?.status;
  return status === HTTP_STATUS.NOT_FOUND || status === HTTP_STATUS.BAD_REQUEST;
};

export const cleanupOrphanedPasskeys = async (
  credentialIds: string[],
  userId: string,
  messageApi: MessageInstance,
): Promise<boolean> => {
  if (credentialIds.length === 0) {
    return false;
  }

  const loadingMessage = messageApi.loading(AUTH_ERROR_MESSAGES.CLEANUP_STORED_PASSKEYS, 0);

  let hasUnauthorizedError = false;

  try {
    const deletePromises = credentialIds.map(async (credentialId) => {
      try {
        await deletePasskey(credentialId, { cleanupOrphaned: true, forceLastDelete: true }, userId);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          hasUnauthorizedError = true;
        } else if (isNotFoundError(error)) {
          // Passkey not found - may be due to format mismatch, continue cleanup
        }
      }
    });

    await Promise.all(deletePromises);
    loadingMessage();
    return hasUnauthorizedError;
  } catch (error) {
    loadingMessage();
    messageApi.error(AUTH_ERROR_MESSAGES.ORPHANED_PASSKEY_CLEANUP_FAILED, 5);
    return isUnauthorizedError(error);
  }
};

export interface OrphanedPasskeysInfo {
  credentialIds: string[];
  userId: string;
  errorName?: string;
}

export const performLogin = async (
  username: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  onNoPasskeys?: () => void,
  onUserNotFound?: () => void,
  onShowOrphanedModal?: (info: OrphanedPasskeysInfo) => void,
): Promise<void> => {
  let loginStartResponse: LoginStartResponse | null = null;
  try {
    loginStartResponse = await loginStart({ username });

    // Call authentication normally - one attempt only
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
      prepareLoginFinishRequest(username, {
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

    messageApi.open({
      type: 'success',
      content: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      duration: 2,
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    // On authentication failure, show modal if backend has passkeys
    // User must explicitly confirm before cleanup
    if (loginStartResponse && hasBackendPasskeys(loginStartResponse) && onShowOrphanedModal) {
      const originalErrorName = (error as Error & { originalErrorName?: string })
        ?.originalErrorName;
      const credentialIds = extractCredentialIds(loginStartResponse);
      const userId = loginStartResponse.userId;

      if (credentialIds.length > 0 && userId) {
        // Show modal - user must explicitly choose to cleanup
        onShowOrphanedModal({
          credentialIds,
          userId,
          errorName: originalErrorName,
        });
        // Don't throw error here - let modal handle retry/cleanup
        return;
      }
    }

    // Handle other errors normally
    handleAuthError(error, messageApi, {
      onUserNotFound,
      onNoPasskeys,
    });
    throw error;
  }
};
