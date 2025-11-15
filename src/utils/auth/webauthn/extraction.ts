import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import type {
  LoginStartResponse,
  PublicKeyCredentialRequestOptions,
  PublicKeyCredentialDescriptor,
} from '../../../interfaces/auth/credentials';

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
      userVerification: publicKey.userVerification || LOGIN_CONSTANTS.WEBAUTHN.USER_VERIFICATION,
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
      userVerification: LOGIN_CONSTANTS.WEBAUTHN.USER_VERIFICATION,
    };
  }

  throw new Error(LOGIN_CONSTANTS.MESSAGES.INVALID_RESPONSE);
};

export const extractCredentialIds = (loginStartResponse: LoginStartResponse): string[] => {
  const options = extractLoginOptions(loginStartResponse);
  const credentials: PublicKeyCredentialDescriptor[] =
    options.allowCredentials || loginStartResponse.allowCredentials || [];

  return credentials
    .map((cred) => (typeof cred.id === 'string' ? cred.id : ''))
    .filter((id) => id.length > 0);
};

export const hasBackendPasskeys = (loginStartResponse: LoginStartResponse): boolean => {
  const options = extractLoginOptions(loginStartResponse);
  const hasInOptions = options.allowCredentials && options.allowCredentials.length > 0;
  const hasInResponse =
    loginStartResponse.allowCredentials && loginStartResponse.allowCredentials.length > 0;
  return !!(hasInOptions || hasInResponse);
};
