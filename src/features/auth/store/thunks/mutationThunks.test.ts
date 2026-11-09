import { beforeEach, describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import {
  mockEmptyEndpoint,
  mockEndpoint,
  store,
  resetStore,
  mockServerError,
} from '../../../../test';
import { buildPasskey } from '../../../../test/factories/auth';
import { installWebAuthn, type WebAuthnMock } from '../../../../test/helpers/webauthn';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { createPasskeyThunk, deletePasskeyThunk, updatePasskeyThunk } from './mutationThunks';
import { fetchAllPasskeysThunk, fetchPasskeyDetailsThunk } from './fetchThunks';

const params = {
  credential: {
    id: 'cred',
    rawId: 'raw',
    type: 'public-key' as const,
    response: { attestationObject: 'a', clientDataJSON: 'c' },
  },
  deviceName: 'work_laptop',
  deviceType: 'platform' as const,
};

const mockNameConflict = () => {
  const passkey = buildPasskey({ deviceName: params.deviceName });
  mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.CREATE, {}, { status: 409 });
  mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.GET_ALL, [passkey] as never);
  return passkey;
};

describe('passkey thunks', () => {
  let webauthn: WebAuthnMock;

  beforeEach(() => {
    resetStore();
    webauthn = installWebAuthn();
  });

  const mockOrphanConflict = () => {
    webauthn.get.mockResolvedValueOnce(null);
    return mockNameConflict();
  };

  it('creates a passkey and appends it to the list', async () => {
    const created = buildPasskey();
    mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.CREATE, created as never);

    const result = await store.dispatch(createPasskeyThunk(params));

    expect(result.type).toBe(createPasskeyThunk.fulfilled.type);
    expect(store.getState().passkeys.passkeys.map((p) => p.credentialId)).toContain(
      created.credentialId,
    );
  });

  it('replaces an orphaned passkey on a name conflict', async () => {
    const orphan = mockOrphanConflict();
    const removal = mockEmptyEndpoint('auth', Endpoints.AUTH.PASSKEYS.DELETE(orphan.credentialId));

    await store.dispatch(createPasskeyThunk(params));

    expect(removal.calls).toHaveLength(1);
  });

  it('refuses a name conflict that is a real, usable passkey', async () => {
    mockNameConflict();

    const result = await store.dispatch(createPasskeyThunk(params));

    expect(result.payload).toBe(AUTH_ERROR_MESSAGES.PASSKEY_ALREADY_EXISTS);
  });

  it('reports the cleanup when an orphan cannot be replaced', async () => {
    const orphan = mockOrphanConflict();
    mockServerError('auth', Endpoints.AUTH.PASSKEYS.DELETE(orphan.credentialId));

    const result = await store.dispatch(createPasskeyThunk(params));

    expect(result.payload).toBe(AUTH_ERROR_MESSAGES.ORPHANED_PASSKEY_CLEANUP_FAILED);
  });

  it('updates and deletes passkeys in the list', async () => {
    const passkey = buildPasskey();
    mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.GET_ALL, [passkey] as never);
    await store.dispatch(fetchAllPasskeysThunk());
    mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.UPDATE(passkey.credentialId), {
      ...passkey,
      deviceName: 'renamed',
    } as never);
    mockEmptyEndpoint('auth', Endpoints.AUTH.PASSKEYS.DELETE(passkey.credentialId));

    await store.dispatch(
      updatePasskeyThunk({
        credentialId: passkey.credentialId,
        request: { deviceName: 'renamed' },
      }),
    );
    expect(store.getState().passkeys.passkeys[0].deviceName).toBe('renamed');

    await store.dispatch(deletePasskeyThunk({ credentialId: passkey.credentialId }));
    expect(store.getState().passkeys.passkeys).toHaveLength(0);
  });

  it('keeps the fetch error for the page to show', async () => {
    mockServerError('auth', Endpoints.AUTH.PASSKEYS.GET_ALL, { message: 'passkeys are down' });

    await store.dispatch(fetchAllPasskeysThunk());

    expect(store.getState().passkeys.error).toBe('passkeys are down');
  });

  it('loads one passkey into the details slice', async () => {
    const passkey = buildPasskey();
    mockEndpoint(
      'auth',
      Endpoints.AUTH.PASSKEYS.GET_SINGLE(passkey.credentialId),
      passkey as never,
    );

    await store.dispatch(fetchPasskeyDetailsThunk(passkey.credentialId));

    expect(store.getState().passkeys.details).toEqual(passkey);
  });
});
