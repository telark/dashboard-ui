import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { selectPermissionsState } from '../../auth/store/selectors/permissionsSelectors';
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
  clearNotificationsThunk,
  deleteNotificationThunk,
  hydrateFromCache,
  optimisticMarkRead,
  optimisticDelete,
  optimisticMarkAllRead,
  optimisticClear,
  rollbackState,
  resetNotifications,
  selectNotifications,
  selectNotificationsUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError,
} from '../store';
import { keepNotificationsStream } from '../clients';
import { NOTIFICATIONS_CACHE_KEY, NOTIFICATIONS_POLL_INTERVAL_MS } from '../constants';
import { readNotificationsCache, writeNotificationsCache } from '../utils';
import { pollWhileVisible } from '../../../utils/helpers/poll';
import type { Notification, NotificationsCache } from '../models';

// Lists hydrated from another tab's write (the slice keeps the array as is): persisting one again
// echoes it back, and two tabs holding different lists would then overwrite each other forever.
const receivedFromOtherTab = new WeakSet<Notification[]>();

// At most one run in flight and one queued, so a burst of changes costs two requests.
const coalesce = (run: () => Promise<void>): (() => void) => {
  let inFlight = false;
  let queued = false;
  const call = (): void => {
    if (inFlight) {
      queued = true;
      return;
    }
    inFlight = true;
    void run().finally(() => {
      inFlight = false;
      if (queued) {
        queued = false;
        call();
      }
    });
  };
  return call;
};

// One stream per visible tab, closed while hidden. Its connect makes the one refetch on return (or the
// first failure does). The bell polls while the stream is down, and after a failed fetch until one succeeds.
const followNotifications = (fetchList: () => Promise<boolean>): (() => void) => {
  let stream: AbortController | null = null;
  let stopPolling: (() => void) | null = null;
  let live = false;
  let fetchOnShow = true;
  // Armed only while the tab shows, so a fetch that ends after a hide never polls a hidden tab.
  const poll = (on: boolean): void => {
    if (on && stream) stopPolling ??= pollWhileVisible(refetch, NOTIFICATIONS_POLL_INTERVAL_MS);
    if (!on) {
      stopPolling?.();
      stopPolling = null;
    }
  };
  // A failed fetch while live would leave the list stale until the next change.
  const refetch = coalesce(async () => poll(!(await fetchList()) || !live));
  const onConnected = (connected: boolean): void => {
    live = connected;
    if (connected || fetchOnShow) refetch();
    else poll(true);
    fetchOnShow = false;
  };
  const show = (): void => {
    if (stream) return;
    fetchOnShow = true;
    stream = new AbortController();
    poll(true);
    void keepNotificationsStream(refetch, onConnected, stream.signal);
  };
  const hide = (): void => {
    live = false;
    stream?.abort();
    stream = null;
    poll(false);
  };
  const onVisibility = (): void => (document.hidden ? hide() : show());
  if (!document.hidden) show();
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    hide();
    document.removeEventListener('visibilitychange', onVisibility);
  };
};

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markRead: (id: string) => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsResult {
  const dispatch: AppDispatch = useDispatch();
  const { userID } = useSelector(selectPermissionsState);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectNotificationsUnreadCount);
  const isLoading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);

  const hydratedRef = useRef(false);
  const stateSnapshotRef = useRef<{ items: Notification[]; unreadCount: number }>({
    items: [],
    unreadCount: 0,
  });

  // Keep an up-to-date snapshot for optimistic rollback.
  useEffect(() => {
    stateSnapshotRef.current = { items: notifications, unreadCount };
  }, [notifications, unreadCount]);

  // Persist cache whenever items change after hydration. A tab with no user yet holds only its
  // reset state, which would overwrite the list every other tab shares.
  useEffect(() => {
    if (!hydratedRef.current || !userID || receivedFromOtherTab.has(notifications)) return;
    writeNotificationsCache(notifications, unreadCount);
  }, [notifications, unreadCount, userID]);

  useEffect(() => {
    if (hydratedRef.current) return;
    const cached = readNotificationsCache();
    if (cached) {
      dispatch(hydrateFromCache(cached));
    }
    hydratedRef.current = true;
  }, [dispatch]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== NOTIFICATIONS_CACHE_KEY) return;
      if (!e.newValue) {
        dispatch(resetNotifications());
        return;
      }
      try {
        const parsed = JSON.parse(e.newValue) as Partial<NotificationsCache> | null;
        if (!parsed || !Array.isArray(parsed.items)) return;
        const items = parsed.items as Notification[];
        receivedFromOtherTab.add(items);
        dispatch(
          hydrateFromCache({
            items,
            unreadCount: typeof parsed.unreadCount === 'number' ? parsed.unreadCount : 0,
            fetchedAt: typeof parsed.fetchedAt === 'number' ? parsed.fetchedAt : Date.now(),
          }),
        );
      } catch {
        // ignore malformed payloads
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [dispatch]);

  // Resolves with whether the list arrived: a silent failure changes nothing the caller could see.
  const fetchNow = useCallback(
    (silent: boolean) => {
      if (!userID) return Promise.resolve(false);
      return dispatch(fetchNotificationsThunk({ userId: userID, silent })).then((action) =>
        fetchNotificationsThunk.fulfilled.match(action),
      );
    },
    [dispatch, userID],
  );

  // Live while a user is signed in; stopped on logout.
  useEffect(() => {
    if (!userID) {
      // Only this tab's state: a tab still booting has no user yet, and clearing the shared cache
      // would empty every other tab's list. Logout and session expiry clear it (purgeLocalUserData).
      dispatch(resetNotifications());
      return;
    }
    // The first fetch is not silent, so the loading state can render.
    let loaded = false;
    return followNotifications(() => {
      const silent = loaded;
      loaded = true;
      return fetchNow(silent);
    });
  }, [dispatch, fetchNow, userID]);

  const markRead = useCallback(
    async (id: string) => {
      if (!userID) return;
      const snapshot = stateSnapshotRef.current;
      dispatch(optimisticMarkRead(id));
      try {
        await dispatch(markNotificationReadThunk({ id, userId: userID })).unwrap();
      } catch {
        dispatch(rollbackState(snapshot));
      }
    },
    [dispatch, userID],
  );

  const deleteOne = useCallback(
    async (id: string) => {
      if (!userID) return;
      const snapshot = stateSnapshotRef.current;
      dispatch(optimisticDelete(id));
      try {
        await dispatch(deleteNotificationThunk({ id, userId: userID })).unwrap();
      } catch {
        dispatch(rollbackState(snapshot));
      }
    },
    [dispatch, userID],
  );

  const markAllRead = useCallback(async () => {
    if (!userID) return;
    const snapshot = stateSnapshotRef.current;
    dispatch(optimisticMarkAllRead());
    try {
      await dispatch(markAllNotificationsReadThunk({ userId: userID })).unwrap();
    } catch {
      dispatch(rollbackState(snapshot));
    }
  }, [dispatch, userID]);

  const clearAll = useCallback(async () => {
    if (!userID) return;
    const snapshot = stateSnapshotRef.current;
    dispatch(optimisticClear());
    try {
      await dispatch(clearNotificationsThunk({ userId: userID })).unwrap();
    } catch {
      dispatch(rollbackState(snapshot));
    }
  }, [dispatch, userID]);

  const refresh = useCallback(() => fetchNow(false).then(() => undefined), [fetchNow]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markRead,
    deleteOne,
    markAllRead,
    clearAll,
    refresh,
  };
}
