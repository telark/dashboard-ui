import { expect, it } from 'vitest';
import { Endpoints } from '../../../constants';
import { describeClients, mockEmptyEndpoint } from '../../../test';
import { describeVoidClients } from '../../../test/contracts/voidClients';
import {
  finishAssertion,
  getBootstrapStatus,
  setBreakGlassAlerts,
  startAssertion,
} from './bootstrap';

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
    name: 'setBreakGlassAlerts',
    service: 'auth',
    endpoint: Endpoints.AUTH.BREAK_GLASS_ALERTS,
    call: () => setBreakGlassAlerts(true),
    body: { notifyAdmins: true },
  },
]);

it('sends an opt-out of the break-glass alerts as false', async () => {
  const mock = mockEmptyEndpoint('auth', Endpoints.AUTH.BREAK_GLASS_ALERTS);

  await setBreakGlassAlerts(false);

  expect(mock.calls[0].body).toEqual({ notifyAdmins: false });
});
