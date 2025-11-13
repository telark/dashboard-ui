import { message } from 'antd';
import { loginStart, loginFinish } from '../../clients/auth';
import { authenticateWithPasskey } from './webauthn';
import { setSessionToken } from './session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import type {
  LoginStartResponse,
  PublicKeyCredentialRequestOptions,
  AuthenticatorAssertionResponse,
} from '../../interfaces/auth';

export const extractLoginOptions = (
  loginStartResponse: LoginStartResponse,
): PublicKeyCredentialRequestOptions => {
  if (loginStartResponse.options?.publicKey) {
    const publicKey = (loginStartResponse.options as any).publicKey;
    return {
      challenge: publicKey.challenge,
      timeout: publicKey.timeout,
      rpId: publicKey.rpId,
      allowCredentials: publicKey.allowCredentials,
      userVerification: publicKey.userVerification || 'preferred',
    };
  }

  if (loginStartResponse.options?.response) {
    return loginStartResponse.options.response;
  }

  if (loginStartResponse.challenge) {
    return {
      challenge: loginStartResponse.challenge,
      timeout: loginStartResponse.timeout,
      rpId: loginStartResponse.rpId,
      allowCredentials: loginStartResponse.allowCredentials,
      userVerification: 'preferred',
    };
  }

  console.error('Unexpected login response structure:', loginStartResponse);
  throw new Error('Invalid response structure from server. Please check console for details.');
};

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

export const handleLoginError = (
  error: any,
  onNoPasskeys?: () => void,
): void => {
  if (error?.response?.status === 404 || error?.status === 404) {
    const errorMsg = error?.response?.data?.message || error?.message || '';
    if (errorMsg.includes('no passkeys') || errorMsg.includes('No passkeys')) {
      const errorMessage = 'No passkeys found. Please register a passkey first.';
      message.error(errorMessage);
      if (onNoPasskeys) {
        setTimeout(() => {
          onNoPasskeys();
        }, 2000);
      }
      return;
    }
  }

  const errorMessage =
    error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.LOGIN_FINISH_FAILED;
  message.error(errorMessage);
  console.error('Login error:', error);
};

export const performLogin = async (
  username: string,
  onSuccess?: () => void,
  onNoPasskeys?: () => void,
): Promise<void> => {
  try {
    const loginStartResponse = await loginStart({ username });
    const options = extractLoginOptions(loginStartResponse);
    const credential = await authenticateWithPasskey({
      challenge: options.challenge,
      timeout: options.timeout,
      rpId: options.rpId,
      allowCredentials: options.allowCredentials,
      userVerification: options.userVerification || 'preferred',
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

    setSessionToken(loginFinishResponse.sessionToken);

    message.success(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS);
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    handleLoginError(error, onNoPasskeys);
    throw error;
  }
};

