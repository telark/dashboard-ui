import { loginStart, loginFinish } from '../../clients/auth';
import { authenticateWithPasskey } from './webauthn';
import { setSessionToken } from './session';
import { AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import { handleAuthError } from './errors';
import type {
  LoginStartResponse,
  PublicKeyCredentialRequestOptions,
  AuthenticatorAssertionResponse,
} from '../../interfaces/auth';
import type { MessageInstance } from 'antd/es/message/interface';

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


export const performLogin = async (
  username: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
  onNoPasskeys?: () => void,
  onUserNotFound?: () => void,
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

    messageApi.open({
      type: 'success',
      content: AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS,
      duration: 2,
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    handleAuthError(error, messageApi, {
      onUserNotFound,
      onNoPasskeys,
    });
    throw error;
  }
};

