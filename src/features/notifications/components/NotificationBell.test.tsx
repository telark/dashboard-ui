import { act, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints, EXPORTER_API } from '../../../constants';
import {
  currentLocation,
  mockEmptyEndpoint,
  mockEndpoint,
  mockNetworkError,
  renderApp,
  clickButton,
} from '../../../test';
import { buildNotification } from '../../../test/factories/notifications';
import { mockEventStream } from '../../../test/helpers/eventStream';
import { clickAction } from '../../../test/helpers/accessForms';
import { findPanel } from '../../../test/helpers/panel';
import {
  NOTIFICATIONS_CACHE_KEY,
  NOTIFICATIONS_TEXTS as T,
  NOTIFICATION_TYPES,
} from '../constants';
import type { Notification } from '../models';
import { pluralize } from '../../../utils/helpers/format';
import NotificationBell from './NotificationBell';

const STREAM_URL = `${EXPORTER_API.BASE_URL}/${Endpoints.NOTIFICATIONS.EVENTS.path}`;
const bellName = (unread: number) => pluralize(unread, T.BELL_UNREAD_NOUN);
const READ_AT = '2026-01-16T10:00:00Z';

const setup = (items: Notification[]) => {
  const stream = mockEventStream(STREAM_URL);
  const unreadCount = items.filter((item) => !item.readAt).length;
  const list = mockEndpoint('exporter', Endpoints.NOTIFICATIONS.LIST, {
    data: { items, unreadCount },
  });
  const view = renderApp(<NotificationBell />);
  const openPanel = async () => {
    await clickAction(view.user, bellName(unreadCount));
    await findPanel();
    await screen.findByText(items[0]?.title ?? T.EMPTY_TITLE);
  };
  return { ...view, stream, list, openPanel };
};

describe('notification bell', () => {
  it('counts the unread notifications', async () => {
    setup([buildNotification(), buildNotification({ readAt: READ_AT })]);

    expect(await screen.findByRole('button', { name: bellName(1) })).toBeInTheDocument();
  });

  it('refetches when the stream reports a change', async () => {
    const { list, stream } = setup([buildNotification()]);
    await screen.findByRole('button', { name: bellName(1) });
    const before = list.calls.length;

    act(() => stream.send('event: changed\ndata: {}\n\n'));

    await waitFor(() => expect(list.calls.length).toBeGreaterThan(before));
    expect(list.calls[0].url.searchParams.get('userId')).toBe('user-under-test');
  });

  it('shows the empty state in the panel', async () => {
    const { openPanel } = setup([]);

    await openPanel();

    expect(screen.getByText(T.EMPTY_TITLE)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: T.CLEAR_ALL })).not.toBeInTheDocument();
  });

  it('renders the message with its bold part and the read state', async () => {
    const unread = buildNotification({ message: 'Plan **alpha** approved' });
    const read = buildNotification({ readAt: READ_AT });
    const { openPanel } = setup([unread, read]);

    await openPanel();

    expect(within(screen.getByTitle('Plan alpha approved')).getByText('alpha').tagName).toBe(
      'STRONG',
    );
    expect(screen.getAllByRole('button', { name: T.MARK_READ })).toHaveLength(1);
    expect(screen.getAllByRole('img', { name: T.UNREAD })).toHaveLength(1);
  });

  /** One unread notification in the open panel, with its mark-as-read answered. */
  const openUnread = async () => {
    const item = buildNotification();
    const { user, openPanel } = setup([item]);
    const marked = mockEmptyEndpoint('exporter', Endpoints.NOTIFICATIONS.MARK_READ(item.id));
    await openPanel();
    return { item, user, marked };
  };

  it('marks one as read on the server and updates the panel', async () => {
    const { user, marked } = await openUnread();

    await clickAction(user, T.MARK_READ);

    await waitFor(() => expect(marked.calls).toHaveLength(1));
    expect(marked.calls[0].url.searchParams.get('userId')).toBe('user-under-test');
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: T.MARK_READ })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: bellName(0), hidden: true })).toBeInTheDocument();
  });

  it.each<[string, { path: string; method: string }, string, () => void]>([
    [
      'deletes one',
      Endpoints.NOTIFICATIONS.DELETE('notification-to-delete'),
      T.DELETE,
      () => expect(screen.queryByText('to delete')).not.toBeInTheDocument(),
    ],
    [
      'clears them all',
      Endpoints.NOTIFICATIONS.CLEAR,
      T.CLEAR_ALL,
      () => expect(screen.getByText(T.EMPTY_TITLE)).toBeInTheDocument(),
    ],
  ])('%s', async (_, endpoint, button, verify) => {
    const item = buildNotification({ id: 'notification-to-delete', title: 'to delete' });
    const { user, openPanel } = setup([item]);
    const done = mockEmptyEndpoint('exporter', endpoint);
    await openPanel();

    await clickAction(user, button);

    await waitFor(() => expect(done.calls).toHaveLength(1));
    await waitFor(verify);
  });

  it('marks everything as read', async () => {
    const { user, openPanel } = setup([buildNotification(), buildNotification()]);
    const marked = mockEmptyEndpoint('exporter', Endpoints.NOTIFICATIONS.MARK_ALL_READ);
    await openPanel();

    await clickAction(user, T.MARK_ALL_READ);

    await waitFor(() => expect(marked.calls).toHaveLength(1));
    await waitFor(() =>
      expect(screen.queryByRole('img', { name: T.UNREAD })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: T.MARK_ALL_READ })).toBeDisabled();
  });

  it.each([
    ['mark one', () => Endpoints.NOTIFICATIONS.MARK_READ('n-1'), T.MARK_READ],
    ['delete', () => Endpoints.NOTIFICATIONS.DELETE('n-1'), T.DELETE],
    ['mark all', () => Endpoints.NOTIFICATIONS.MARK_ALL_READ, T.MARK_ALL_READ],
    ['clear', () => Endpoints.NOTIFICATIONS.CLEAR, T.CLEAR_ALL],
  ])('restores the list when %s fails', async (_, endpoint, button) => {
    const item = buildNotification({ id: 'n-1', title: 'kept' });
    const { user, openPanel } = setup([item]);
    mockNetworkError('exporter', endpoint());
    await openPanel();

    await clickAction(user, button);

    await waitFor(() => expect(screen.getAllByRole('img', { name: T.UNREAD })).toHaveLength(1));
    expect(await screen.findByText('kept')).toBeInTheDocument();
  });

  it('opens the target of a notification and closes the panel', async () => {
    const item = buildNotification({
      type: NOTIFICATION_TYPES.ENROLL_LINK_USED,
      readAt: READ_AT,
    });
    const { user, openPanel } = setup([item]);
    await openPanel();

    await clickButton(user, new RegExp(item.title));

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.PASSKEYS));
  });

  it('marks an unread notification read when it is opened with the keyboard', async () => {
    const { item, user, marked } = await openUnread();

    screen.getByRole('button', { name: new RegExp(item.title) }).focus();
    await user.keyboard('{Enter}');

    await waitFor(() => expect(marked.calls).toHaveLength(1));
  });

  it('closes on Escape', async () => {
    const { user, openPanel } = setup([]);
    await openPanel();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByText(T.EMPTY_TITLE)).not.toBeInTheDocument());
  });
});

describe('notification bell caches', () => {
  const stored = (items: Notification[], unreadCount: number) =>
    JSON.stringify({ items, unreadCount, fetchedAt: 1 });
  const fireStorage = (key: string, newValue: string | null) =>
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

  it('hydrates from the cache and writes what it fetched', async () => {
    const cached = [buildNotification(), buildNotification()];
    localStorage.setItem(NOTIFICATIONS_CACHE_KEY, stored(cached, 2));
    setup([buildNotification({ title: 'from server' })]);

    expect(screen.getByRole('button', { name: bellName(2) })).toBeInTheDocument();
    await waitFor(() =>
      expect(localStorage.getItem(NOTIFICATIONS_CACHE_KEY)).toContain('from server'),
    );
  });

  it('follows another tab through the storage event', async () => {
    const { openPanel } = setup([]);
    await openPanel();

    const other = buildNotification({ title: 'from another tab' });
    act(() => {
      fireStorage(NOTIFICATIONS_CACHE_KEY, stored([other], 1));
    });

    expect(await screen.findByText('from another tab')).toBeInTheDocument();

    act(() => {
      fireStorage(NOTIFICATIONS_CACHE_KEY, null);
    });

    expect(await screen.findByText(T.EMPTY_TITLE)).toBeInTheDocument();
  });

  it('ignores unrelated and malformed storage events', async () => {
    const item = buildNotification({ title: 'kept' });
    const { openPanel } = setup([item]);
    await openPanel();

    act(() => {
      fireStorage('other', 'x');
      fireStorage(NOTIFICATIONS_CACHE_KEY, '{not json');
      fireStorage(NOTIFICATIONS_CACHE_KEY, '{"items":1}');
    });

    expect(screen.getByText('kept')).toBeInTheDocument();
  });

  it('fetches nothing without a signed-in user', async () => {
    const list = mockEndpoint('exporter', Endpoints.NOTIFICATIONS.LIST, {
      data: { items: [], unreadCount: 0 },
    });
    renderApp(<NotificationBell />, { seed: {} });

    await screen.findByRole('button', { name: bellName(0) });

    expect(list.calls).toHaveLength(0);
  });
});
