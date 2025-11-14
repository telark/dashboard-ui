import { registerStart, createPasskey } from '../../clients/auth';
import { registerPasskey } from './webauthn';
import { AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import { LOGIN_CONSTANTS } from '../../constants/pages/login';
import { isDevelopment } from '../helpers/env';
import type {
  RegisterStartResponse,
  PublicKeyCredentialCreationOptions,
} from '../../interfaces/auth';
import type { MessageInstance } from 'antd/es/message/interface';

export const extractRegisterOptions = (
  registerStartResponse: RegisterStartResponse,
): PublicKeyCredentialCreationOptions => {
  if (registerStartResponse.options?.publicKey) {
    const publicKey = (registerStartResponse.options as any).publicKey;
    return {
      challenge: publicKey.challenge,
      rp: publicKey.rp,
      user: publicKey.user,
      pubKeyCredParams: publicKey.pubKeyCredParams,
      timeout: publicKey.timeout,
      attestation: publicKey.attestation,
      authenticatorSelection: publicKey.authenticatorSelection,
    };
  }

  if (registerStartResponse.options?.response) {
    return registerStartResponse.options.response;
  }

  if (registerStartResponse.challenge) {
    return {
      challenge: registerStartResponse.challenge,
      rp: registerStartResponse.rp!,
      user: registerStartResponse.user!,
      pubKeyCredParams: registerStartResponse.pubKeyCredParams!,
      timeout: registerStartResponse.timeout,
      attestation: registerStartResponse.attestation,
      authenticatorSelection: registerStartResponse.authenticatorSelection,
    };
  }

  if (isDevelopment()) {
    console.error(LOGIN_CONSTANTS.LOGS.INVALID_RESPONSE_STRUCTURE, registerStartResponse);
  }

  throw new Error(LOGIN_CONSTANTS.MESSAGES.INVALID_RESPONSE);
};

export const performRegister = async (
  username: string,
  deviceName: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
): Promise<void> => {
  const registerStartResponse = await registerStart(username);
  const options = extractRegisterOptions(registerStartResponse);

  const credential = await registerPasskey({
    challenge: options.challenge,
    rp: options.rp,
    user: options.user,
    pubKeyCredParams: options.pubKeyCredParams,
    timeout: options.timeout,
    attestation: options.attestation,
    authenticatorSelection: options.authenticatorSelection,
  });

  const deviceType: 'platform' | 'cross-platform' = 'platform';
  await createPasskey(credential, deviceName, deviceType, username);

  messageApi.open({
    type: 'success',
    content: AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS,
    duration: 2,
  });

  if (onSuccess) {
    onSuccess();
  }
};
