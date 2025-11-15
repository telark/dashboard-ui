import { loginStart, loginFinish, deletePasskey } from '../../../clients/auth';
import {
  authenticateWithPasskey,
  extractLoginOptions,
  extractCredentialIds,
  hasBackendPasskeys,
  isNoCredentialFoundError,
} from '../webauthn';
import { setSessionToken } from '../session/token';
import { setCurrentUser } from '../../user/session';
import { AUTH_SUCCESS_MESSAGES, AUTH_ERROR_MESSAGES } from '../../../constants/auth';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import { HTTP_STATUS } from '../../../constants/rest/http';
import { handleAuthError } from '../shared/errors';
import type {
  LoginStartResponse,
  AuthenticatorAssertionResponse,
} from '../../../interfaces/auth/credentials';
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

const cleanupOrphanedPasskeys = async (
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
        await deletePasskey(
          credentialId,
          { cleanupOrphaned: true, forceLastDelete: true },
          userId,
        );
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
    return isUnauthorizedError(error);
  }
};

export const performLogin = async (
  username: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  onNoPasskeys?: () => void,
  onUserNotFound?: () => void,
): Promise<void> => {
  let loginStartResponse: LoginStartResponse | null = null;
  try {
    loginStartResponse = await loginStart({ username });
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
    if (loginStartResponse && isNoCredentialFoundError(error)) {
      const backendHasPasskeys = hasBackendPasskeys(loginStartResponse);
      if (backendHasPasskeys) {
        messageApi.open({
          type: 'warning',
          content: AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_LOGIN_WARNING,
          duration: 6,
        });

        const credentialIds = extractCredentialIds(loginStartResponse);
        const userId = loginStartResponse.userId;
        if (credentialIds.length > 0 && userId) {
          const requiresAuth = await cleanupOrphanedPasskeys(credentialIds, userId, messageApi);
          if (requiresAuth) {
            messageApi.open({
              type: 'info',
              content: AUTH_ERROR_MESSAGES.CLEANUP_REQUIRES_AUTH,
              duration: 8,
            });
          }
        }

        throw error;
      }
    }

    handleAuthError(error, messageApi, {
      onUserNotFound,
      onNoPasskeys,
    });
    throw error;
  }
};
