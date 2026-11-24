import { expect, it } from 'vitest';
import { Endpoints } from '../../../constants';
import { describeClients, mockEmptyEndpoint } from '../../../test';
import { describeVoidClients } from '../../../test/contracts/voidClients';
import { finishAssertion, getBootstrapStatus, setAuthAlerts, startAssertion } from './bootstrap';

const REQUEST = 'req-1';

describeClients('bootstrap', [
  {
    name: 'getBootstrapStatus',
    service: 'exporter',
    endpoint: Endpoints.BOOTSTRAP.GET,
    call: () => getBootstrapStatus(),
    response: { data: { waitHours: 4 } },
    expected: { waitHours: 4 },
  },
  {
    name: 'startAssertion',
    service: 'auth',
    endpoint: Endpoints.BOOTSTRAP.ASSERT_START(REQUEST),
    call: () => startAssertion(REQUEST, 'approve'),
    response: { options: {} },
    body: { action: 'approve' },
  },
  {
    name: 'finishAssertion',
    service: 'auth',
    endpoint: Endpoints.BOOTSTRAP.ASSERT_FINISH(REQUEST),
    call: () =>
      finishAssertion(REQUEST, 'deny', { id: 'cred' } as Parameters<typeof finishAssertion>[2]),
    response: { eligible: true, enrolled: true },
    body: { id: 'cred', action: 'deny' },
  },
]);

describeVoidClients('bootstrap', [
  {
    name: 'setAuthAlerts',
    service: 'auth',
    endpoint: Endpoints.AUTH.AUTH_ALERTS,
    call: () => setAuthAlerts(true),
    body: { notifyAdmins: true },
  },
]);

it('sends an opt-out of the auth alerts as false to auth/alerts', async () => {
  const mock = mockEmptyEndpoint('auth', Endpoints.AUTH.AUTH_ALERTS);

  await setAuthAlerts(false);

  expect(mock.calls[0].body).toEqual({ notifyAdmins: false });
  // Spelled out on purpose: the auth service serves this route.
  expect(mock.calls[0].url.pathname).toBe('/api/auth/api/v1/auth/alerts');
});
