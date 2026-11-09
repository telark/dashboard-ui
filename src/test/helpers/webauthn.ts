import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AUTH_ERROR_MESSAGES } from '../../features/auth/constants';

const toBuffer = (text: string): ArrayBuffer =>
  new TextEncoder().encode(text).buffer as ArrayBuffer;

class AssertionResponseStub {
  authenticatorData = toBuffer('authenticator-data');
  clientDataJSON = toBuffer('client-data');
  signature = toBuffer('signature');
  userHandle = toBuffer('user-handle');
}

class AttestationResponseStub {
  attestationObject = toBuffer('attestation-object');
  clientDataJSON = toBuffer('client-data');
}

const setGlobal = (name: string, value: unknown): void => {
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
};

const setCredentials = (value: unknown): void => {
  Object.defineProperty(globalThis.navigator, 'credentials', { configurable: true, value });
};

const credential = (response: object) => ({
  id: 'credential-id',
  rawId: toBuffer('raw-id'),
  type: 'public-key',
  response,
  getClientExtensionResults: () => ({ credProps: { rk: true } }),
});

export interface WebAuthnMock {
  get: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
}

/** Stands in for the authenticator, which jsdom doesn't have. */
export const installWebAuthn = (): WebAuthnMock => {
  const mock: WebAuthnMock = {
    get: vi.fn(() => Promise.resolve(credential(new AssertionResponseStub()))),
    create: vi.fn(() => Promise.resolve(credential(new AttestationResponseStub()))),
  };
  setGlobal('isSecureContext', true);
  setGlobal('PublicKeyCredential', vi.fn());
  setGlobal('AuthenticatorAssertionResponse', AssertionResponseStub);
  setGlobal('AuthenticatorAttestationResponse', AttestationResponseStub);
  setCredentials(mock);
  return mock;
};

/** Leaves the browser without passkey support, as on a page served over http. */
export const removeWebAuthn = (): void => {
  setGlobal('isSecureContext', false);
  setGlobal('PublicKeyCredential', undefined);
  setCredentials(undefined);
};

/** A failure the browser's own passkey prompt raises. */
export const webAuthnError = (name: string): Error =>
  Object.assign(new Error('The operation failed'), { name });

/** Waits for the insecure-context warning of a passkey page and returns its action button. */
export const findButtonBelowPasskeyWarning = async (actionLabel: string): Promise<HTMLElement> => {
  await screen.findByText(AUTH_ERROR_MESSAGES.PASSKEYS_INSECURE_CONTEXT.TITLE);
  return screen.getByRole('button', { name: new RegExp(actionLabel) });
};
