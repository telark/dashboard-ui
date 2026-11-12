import { expect, it } from 'vitest';
import { Endpoints, HTTP_HEADERS, REQUEST_CONFIG } from '../../../constants';
import { describeClients, mockEndpoint } from '../../../test';
import {
  createEnrollLink,
  createPasskey,
  deleteCurrentSession,
  deletePasskey,
  deleteSessionByName,
  getAllPasskeys,
  getAuthConfig,
  getCurrentSession,
  getPasskey,
  getSessionsList,
  loginFinish,
  loginStart,
  logout,
  oidcGetNonce,
  oidcGoogleCallback,
  registerStart,
  updatePasskey,
} from '.';
import { getMyPermissions } from './permissions';

const CREDENTIAL_ID = 'credential-1';
const USER_ID = 'user-1';
const EMAIL = 'test@example.com';
const metadata = { browser: 'Chrome', device: 'MacIntel', os: 'macOS', userAgent: 'agent' };
const credential = {
  id: CREDENTIAL_ID,
  rawId: 'raw',
  type: 'public-key' as const,
  response: { attestationObject: 'a', clientDataJSON: 'c' },
};
const loginRequest = {
  email: EMAIL,
  id: CREDENTIAL_ID,
  rawId: 'raw',
  type: 'public-key',
  response: { authenticatorData: 'a', clientDataJSON: 'c', signature: 's', userHandle: null },
  ...metadata,
};

describeClients('auth', [
  {
    name: 'loginStart',
    service: 'auth',
    endpoint: Endpoints.AUTH.LOGIN.START,
    call: () => loginStart({ email: EMAIL }),
    response: { challenge: 'c' },
    body: { email: EMAIL },
  },
  {
    name: 'loginFinish',
    service: 'auth',
    endpoint: Endpoints.AUTH.LOGIN.FINISH,
    call: () => loginFinish(loginRequest),
    response: { user: { id: USER_ID } },
    body: loginRequest,
  },
  {
    name: 'oidcGoogleCallback',
    service: 'auth',
    endpoint: Endpoints.AUTH.OIDC.GOOGLE.CALLBACK,
    call: () => oidcGoogleCallback({ idToken: 'token', ...metadata }),
    response: { email: EMAIL },
    body: { idToken: 'token', ...metadata },
  },
  {
    name: 'oidcGetNonce',
    service: 'auth',
    endpoint: Endpoints.AUTH.OIDC.GOOGLE.NONCE,
    call: () => oidcGetNonce(),
    response: { nonce: 'n' },
  },
  {
    name: 'registerStart',
    service: 'auth',
    endpoint: Endpoints.AUTH.REGISTER.START,
    call: () => registerStart(EMAIL, 'enroll-token'),
    response: { challenge: 'c' },
    body: { email: EMAIL, enrollToken: 'enroll-token' },
  },
  {
    name: 'logout',
    service: 'auth',
    endpoint: Endpoints.AUTH.LOGOUT,
    call: () => logout('legacy-token'),
    response: { success: true, message: 'ok' },
  },
  {
    name: 'getAuthConfig',
    service: 'auth',
    endpoint: Endpoints.AUTH.CONFIG.GET,
    call: () => getAuthConfig(),
    response: { data: { selfRegistrationEnabled: true, oidcEnabled: false } },
    expected: { selfRegistrationEnabled: true, oidcEnabled: false },
  },
  {
    name: 'getMyPermissions',
    service: 'auth',
    endpoint: Endpoints.AUTH.PERMISSIONS.GET,
    call: () => getMyPermissions(),
    response: { userID: USER_ID, roles: [] },
  },
  {
    name: 'getAllPasskeys',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.GET_ALL,
    call: () => getAllPasskeys(),
    response: [],
  },
  {
    name: 'getPasskey',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.GET_SINGLE(CREDENTIAL_ID),
    call: () => getPasskey(CREDENTIAL_ID),
    response: { credentialId: CREDENTIAL_ID },
  },
  {
    name: 'createPasskey',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.CREATE,
    call: () => createPasskey(credential, 'laptop', 'platform', EMAIL),
    response: { id: 'passkey-1' },
    body: credential,
  },
  {
    name: 'createEnrollLink',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.ENROLL_LINK,
    call: () => createEnrollLink(),
    response: { token: 'tok', expiresAt: '' },
  },
  {
    name: 'updatePasskey',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.UPDATE(CREDENTIAL_ID),
    call: () => updatePasskey(CREDENTIAL_ID, { deviceName: 'renamed' }),
    response: { credentialId: CREDENTIAL_ID },
    body: { deviceName: 'renamed' },
  },
  {
    name: 'deletePasskey',
    service: 'auth',
    endpoint: Endpoints.AUTH.PASSKEYS.DELETE(CREDENTIAL_ID),
    call: () => deletePasskey(CREDENTIAL_ID, { forceLastDelete: true }),
    response: { success: true, message: 'ok' },
    body: { forceLastDelete: true },
  },
  {
    name: 'getSessionsList',
    service: 'exporter',
    endpoint: Endpoints.SESSIONS.GET_ALL_BY_USER(USER_ID),
    call: () => getSessionsList(USER_ID),
    response: { data: { items: [] } },
  },
  {
    name: 'getCurrentSession',
    service: 'exporter',
    endpoint: Endpoints.SESSIONS.GET_SELF,
    call: () => getCurrentSession(),
    response: { data: {} },
  },
  {
    name: 'deleteCurrentSession',
    service: 'exporter',
    endpoint: Endpoints.SESSIONS.DELETE_SELF,
    call: () => deleteCurrentSession(),
    response: { message: 'ok' },
  },
  {
    name: 'deleteSessionByName',
    service: 'exporter',
    endpoint: Endpoints.SESSIONS.DELETE_BY_NAME('session-1'),
    call: () => deleteSessionByName('session-1'),
    response: { message: 'ok' },
  },
]);

it('marks a change so the backend accepts it as coming from the app', async () => {
  const mock = mockEndpoint('auth', Endpoints.AUTH.LOGOUT, { success: true, message: 'ok' });
  const header = HTTP_HEADERS.CUSTOM.REQUESTED_WITH;

  await logout('legacy-token');

  expect(mock.calls[0].headers.get(header)).toBe(REQUEST_CONFIG.DEFAULT_HEADERS[header]);
});
