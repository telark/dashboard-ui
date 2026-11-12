import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildLoginStart, buildRegisterStart } from '../../../../test/factories/auth';
import {
  installWebAuthn,
  removeWebAuthn,
  webAuthnError,
  type WebAuthnMock,
} from '../../../../test/helpers/webauthn';
import { LOGIN_CONSTANTS } from '../../constants/login';
import {
  extractRegisterOptions,
  isEnrollLinkRefused,
  resolveEnrollLink,
  buildEnrollUrl,
  isEnrollLink,
} from '../flow/register';
import { prepareLoginFinishRequest } from '../flow/login';
import { REGISTER_CONSTANTS } from '../../constants/register';
import {
  authenticateWithPasskey,
  base64UrlToArrayBuffer,
  extractCredentialIds,
  extractLoginOptions,
  hasBackendPasskeys,
  isWebAuthnSupported,
  registerPasskey,
} from './core';
import { browserHasCredential } from './validation';
import { addBase64Padding, convertCredentialDescriptors, isErrorName } from './shared';

const { WEBAUTHN } = LOGIN_CONSTANTS;

interface PublicKeyOptions {
  publicKey?: {
    allowCredentials?: unknown[];
    authenticatorSelection?: { residentKey?: string };
  };
}

const REQUEST = {
  challenge: 'Y2hhbGxlbmdl',
  allowCredentials: [{ id: 'Y3JlZA', type: 'public-key' as const }],
};
const CREATION = extractRegisterOptions(buildRegisterStart());

describe('webauthn', () => {
  let webauthn: WebAuthnMock;

  beforeEach(() => {
    webauthn = installWebAuthn();
  });

  it('decodes base64url text', () => {
    const decoded = new TextDecoder().decode(base64UrlToArrayBuffer('Y2hhbGxlbmdl'));

    expect(decoded).toBe('challenge');
  });

  it('pads base64 to a block length', () => {
    expect(addBase64Padding('abcde')).toBe('abcde===');
  });

  it('knows whether the browser supports passkeys', () => {
    expect(isWebAuthnSupported()).toBe(true);

    removeWebAuthn();
    expect(isWebAuthnSupported()).toBe(false);
  });

  it('signs in with the credentials the server allows', async () => {
    const credential = await authenticateWithPasskey(REQUEST);

    expect(webauthn.get).toHaveBeenCalledOnce();
    const { publicKey } = webauthn.get.mock.calls[0][0] as PublicKeyOptions;
    expect(publicKey?.allowCredentials).toHaveLength(1);
    expect(credential).toMatchObject({ id: 'credential-id', type: WEBAUTHN.CREDENTIAL_TYPE });
    expect(credential.response).toMatchObject({ clientDataJSON: 'Y2xpZW50LWRhdGE' });
  });

  it('registers a passkey with the resident key the app requires', async () => {
    const credential = await registerPasskey(CREATION);

    const { publicKey } = webauthn.create.mock.calls[0][0] as PublicKeyOptions;
    expect(publicKey?.authenticatorSelection?.residentKey).toBe('required');
    expect(credential.response).toMatchObject({ attestationObject: 'YXR0ZXN0YXRpb24tb2JqZWN0' });
  });

  it.each([
    [
      'get',
      authenticateWithPasskey,
      WEBAUTHN.ERROR_NAMES.NOT_ALLOWED,
      WEBAUTHN.MESSAGES.USER_CANCELED_AUTH,
    ],
    [
      'get',
      authenticateWithPasskey,
      WEBAUTHN.ERROR_NAMES.NOT_FOUND,
      WEBAUTHN.MESSAGES.NO_CREDENTIAL_FOUND,
    ],
    ['get', authenticateWithPasskey, 'WeirdError', WEBAUTHN.MESSAGES.AUTHENTICATION_FAILED],
    [
      'create',
      registerPasskey,
      WEBAUTHN.ERROR_NAMES.CONSTRAINT,
      WEBAUTHN.MESSAGES.CONSTRAINT_VALIDATION_FAILED,
    ],
    ['create', registerPasskey, 'WeirdError', WEBAUTHN.MESSAGES.REGISTRATION_FAILED],
  ] as const)('maps a %s failure named %s', async (kind, run, name, message) => {
    webauthn[kind as 'get' | 'create'].mockRejectedValueOnce(webAuthnError(name));

    await expect(
      (run as (o: typeof REQUEST | typeof CREATION) => Promise<unknown>)(
        kind === 'get' ? REQUEST : CREATION,
      ),
    ).rejects.toThrow(message);
  });

  it('remembers why the browser prompt failed', async () => {
    webauthn.get.mockRejectedValueOnce(webAuthnError(WEBAUTHN.ERROR_NAMES.NOT_ALLOWED));

    await expect(authenticateWithPasskey(REQUEST)).rejects.toMatchObject({
      originalErrorName: WEBAUTHN.ERROR_NAMES.NOT_ALLOWED,
    });
  });

  it('says why when the browser hands back no credential', async () => {
    webauthn.get.mockResolvedValueOnce(null);
    webauthn.create.mockResolvedValueOnce(null);

    await expect(authenticateWithPasskey(REQUEST)).rejects.toThrow(
      WEBAUTHN.MESSAGES.NO_CREDENTIAL_FOUND,
    );
    await expect(registerPasskey(CREATION)).rejects.toThrow(
      WEBAUTHN.MESSAGES.REGISTRATION_CANCELED,
    );
  });

  it('refuses an operation on a browser without passkeys', async () => {
    removeWebAuthn();

    await expect(authenticateWithPasskey(REQUEST)).rejects.toThrow(WEBAUTHN.MESSAGES.NOT_SUPPORTED);
    await expect(registerPasskey(CREATION)).rejects.toThrow(WEBAUTHN.MESSAGES.NOT_SUPPORTED);
  });

  it('checks whether the browser still holds a credential', async () => {
    await expect(browserHasCredential('Y3JlZA')).resolves.toBe(true);

    webauthn.get.mockResolvedValueOnce(null);
    await expect(browserHasCredential('Y3JlZA')).resolves.toBe(false);

    removeWebAuthn();
    await expect(browserHasCredential('Y3JlZA')).resolves.toBe(false);
  });

  it('converts credential ids to buffers', () => {
    const decode = vi.fn(() => new ArrayBuffer(1));

    const [descriptor] = convertCredentialDescriptors([{ id: 'x', type: 'public-key' }], decode);

    expect(descriptor.type).toBe(WEBAUTHN.CREDENTIAL_TYPE);
    expect(decode).toHaveBeenCalledWith('x');
  });

  it('recognizes an error by name', () => {
    expect(isErrorName(webAuthnError('Foo'), ['Foo'])).toBe(true);
    expect(isErrorName('not an error', ['Foo'])).toBe(false);
  });
});

describe('login start responses', () => {
  const LEGACY = {
    challenge: 'c',
    rpId: 'example.com',
    allowCredentials: [{ id: 'a', type: 'public-key' as const }],
  };

  it.each([
    ['publicKey', buildLoginStart(), 'Y2hhbGxlbmdl'],
    ['response', { options: { response: { challenge: 'from-response' } } }, 'from-response'],
    ['legacy', LEGACY, 'c'],
  ])('reads the %s shape', (_name, response, challenge) => {
    expect(extractLoginOptions(response).challenge).toBe(challenge);
  });

  it('rejects a response without options', () => {
    expect(() => extractLoginOptions({})).toThrow(LOGIN_CONSTANTS.MESSAGES.INVALID_RESPONSE);
  });

  it('extracts the credential ids', () => {
    expect(extractCredentialIds(LEGACY)).toEqual(['a']);
    expect(hasBackendPasskeys(LEGACY)).toBe(true);
    expect(hasBackendPasskeys({ challenge: 'c' })).toBe(false);
  });

  it('builds the finish request and keeps a null user handle', () => {
    const request = prepareLoginFinishRequest('test@example.com', {
      id: 'i',
      rawId: 'r',
      type: 'public-key',
      response: { authenticatorData: 'a', clientDataJSON: 'c', signature: 's', userHandle: '' },
    });

    expect(request).toMatchObject({
      email: 'test@example.com',
      id: 'i',
      response: { userHandle: null },
    });
  });
});

describe('register options and enrollment links', () => {
  const PUBLIC_KEY = buildRegisterStart().options?.publicKey;

  it.each([
    ['publicKey', buildRegisterStart()],
    ['response', { options: { response: PUBLIC_KEY } }],
    [
      'legacy',
      {
        challenge: PUBLIC_KEY?.challenge,
        rp: PUBLIC_KEY?.rp,
        user: PUBLIC_KEY?.user,
        pubKeyCredParams: PUBLIC_KEY?.pubKeyCredParams,
      },
    ],
  ])('reads the %s shape', (_name, response) => {
    expect(extractRegisterOptions(response as never).challenge).toBe(PUBLIC_KEY?.challenge);
  });

  it('rejects a response without options', () => {
    expect(() => extractRegisterOptions({})).toThrow(LOGIN_CONSTANTS.MESSAGES.INVALID_RESPONSE);
  });

  it('prefers the query, then the fragment, then the tab', () => {
    expect(resolveEnrollLink('?enroll=q', '#enroll=h&email=e')).toEqual({
      token: 'q',
      email: undefined,
    });
    expect(resolveEnrollLink('', '#enroll=h&email=e')).toEqual({ token: 'h', email: 'e' });
    expect(resolveEnrollLink('', '')).toEqual({ token: 'h', email: 'e' });
  });

  it('recognizes an enrollment link only on the register page', () => {
    expect(isEnrollLink('/register', '', '#enroll=t')).toBe(true);
    expect(isEnrollLink('/login', '', '#enroll=t')).toBe(false);
  });

  it('puts the token in the fragment of the link it builds', () => {
    const url = buildEnrollUrl('tok', 'test@example.com');

    expect(url).toContain(`/register#${REGISTER_CONSTANTS.QUERY.ENROLL}=tok`);
    expect(url).toContain('email=test%40example.com');
  });

  it('tells a refused link from a failed verification', () => {
    const refused = {
      normalized: { isUnauthenticated: true, message: `Invalid or expired enrollment token` },
    };

    expect(isEnrollLinkRefused(refused)).toBe(true);
    expect(
      isEnrollLinkRefused({ normalized: { isUnauthenticated: true, message: 'bad signature' } }),
    ).toBe(false);
  });
});
