import { registerStart, createPasskey } from '../../../clients/auth';
import { registerPasskey } from '../webauthn';
import { AUTH_SUCCESS_MESSAGES } from '../../../constants/auth';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import { isDevelopment } from '../../helpers/env';
import logger from '../../../logging';
import type {
  RegisterStartResponse,
  PublicKeyCredentialCreationOptions,
} from '../../../interfaces/auth/credentials';
import type { MessageInstance } from 'antd/es/message/interface';

export const extractRegisterOptions = (
  registerStartResponse: RegisterStartResponse,
): PublicKeyCredentialCreationOptions => {
  let options: PublicKeyCredentialCreationOptions;
  if (registerStartResponse.options?.publicKey) {
    const publicKey = (registerStartResponse.options as any).publicKey;
    options = {
      challenge: publicKey.challenge,
      rp: publicKey.rp,
      user: publicKey.user,
      pubKeyCredParams: publicKey.pubKeyCredParams,
      timeout: publicKey.timeout,
      attestation: publicKey.attestation,
      authenticatorSelection: publicKey.authenticatorSelection,
      // Do not include excludeCredentials - using discoverable credentials (resident keys)
    };
  } else if (registerStartResponse.options?.response) {
    const { excludeCredentials, ...responseWithoutExclude } = registerStartResponse.options.response;
    options = responseWithoutExclude;
  } else if (registerStartResponse.challenge) {
    const { excludeCredentials, ...flatWithoutExclude } = registerStartResponse;
    options = {
      challenge: registerStartResponse.challenge,
      rp: registerStartResponse.rp!,
      user: registerStartResponse.user!,
      pubKeyCredParams: registerStartResponse.pubKeyCredParams!,
      timeout: registerStartResponse.timeout,
      attestation: registerStartResponse.attestation,
      authenticatorSelection: registerStartResponse.authenticatorSelection,
      // Do not include excludeCredentials - using discoverable credentials (resident keys)
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
  username: string,
  deviceName: string,
  messageApi: MessageInstance,
  onSuccess?: () => void,
): Promise<void> => {
  const registerStartResponse = await registerStart(username);
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
