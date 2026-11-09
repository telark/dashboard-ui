import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../constants';
import { describeClients, mockEndpoint, mockNetworkError, mockList } from '../../../test';
import { describeSilentClients } from '../../../test/helpers/silentClients';
import {
  clearNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '.';

const USER = 'user-1';
const ID = 'n-1';

describeClients('notifications', [
  {
    name: 'fetchNotifications',
    service: 'exporter',
    endpoint: Endpoints.NOTIFICATIONS.LIST,
    call: () => fetchNotifications({ userId: USER, limit: 5, cursor: 'c' }),
    response: { data: { items: [], unreadCount: 0 } },
  },
  {
    name: 'markNotificationRead',
    service: 'exporter',
    endpoint: Endpoints.NOTIFICATIONS.MARK_READ(ID),
    call: () => markNotificationRead(ID, USER),
  },
  {
    name: 'markAllNotificationsRead',
    service: 'exporter',
    endpoint: Endpoints.NOTIFICATIONS.MARK_ALL_READ,
    call: () => markAllNotificationsRead(USER),
  },
  {
    name: 'deleteNotification',
    service: 'exporter',
    endpoint: Endpoints.NOTIFICATIONS.DELETE(ID),
    call: () => deleteNotification(ID, USER),
  },
  {
    name: 'clearNotifications',
    service: 'exporter',
    endpoint: Endpoints.NOTIFICATIONS.CLEAR,
    call: () => clearNotifications(USER),
  },
]);

describeSilentClients('notifications', [
  {
    name: 'fetchNotifications',
    endpoint: Endpoints.NOTIFICATIONS.LIST,
    call: () => fetchNotifications({ userId: USER, silent: true }),
  },
]);

describe('notifications client', () => {
  it('sends the query it was given', async () => {
    const mock = mockList('exporter', Endpoints.NOTIFICATIONS.LIST, []);

    await fetchNotifications({ userId: USER, limit: 5, cursor: 'c' });

    expect(Object.fromEntries(mock.calls[0].url.searchParams)).toEqual({
      userId: USER,
      limit: '5',
      cursor: 'c',
    });
  });

  it.each([
    [
      'marking one read',
      () => markNotificationRead(ID, USER),
      Endpoints.NOTIFICATIONS.MARK_READ(ID),
    ],
    ['deleting one', () => deleteNotification(ID, USER), Endpoints.NOTIFICATIONS.DELETE(ID)],
  ])('treats a missing notification as done when %s', async (_, call, endpoint) => {
    mockEndpoint('exporter', endpoint, {}, { status: 404 });

    await expect(call()).resolves.toBeNull();
  });

  it('rejects when the list is out of reach', async () => {
    mockNetworkError('exporter', Endpoints.NOTIFICATIONS.LIST);

    await expect(fetchNotifications({ userId: USER })).rejects.toThrow('Network Error');
  });
});
