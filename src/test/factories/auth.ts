import type {
  LoginStartResponse,
  Passkey,
  RegisterStartResponse,
} from '../../features/auth/models';
import { createFactory } from '../factory';

const CHALLENGE = 'Y2hhbGxlbmdl';

export const buildPasskey = createFactory<Passkey>((sequence) => ({
  id: `passkey-${sequence}`,
  credentialId: `credential-${sequence}`,
  deviceName: `work_laptop_${sequence}`,
  deviceType: 'platform',
  creationTimestamp: '2026-01-15T10:00:00Z',
}));

export const buildLoginStart = (
  overrides: Partial<LoginStartResponse> = {},
): LoginStartResponse => ({
  options: {
    publicKey: {
      challenge: CHALLENGE,
      timeout: 60_000,
      rpId: 'example.com',
      allowCredentials: [{ id: 'Y3JlZA', type: 'public-key' }],
      userVerification: 'preferred',
    },
  },
  userId: 'user-1',
  ...overrides,
});

export const buildRegisterStart = (
  overrides: Partial<RegisterStartResponse> = {},
): RegisterStartResponse => ({
  options: {
    publicKey: {
      challenge: CHALLENGE,
      rp: { id: 'example.com', name: 'Telark' },
      user: { id: 'dXNlcg', name: 'test@example.com' },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      timeout: 60_000,
      attestation: 'none',
      authenticatorSelection: { userVerification: 'preferred' },
    },
  },
  ...overrides,
});
