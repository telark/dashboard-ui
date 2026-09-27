import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { selectPermissionsState } from '../../auth/store/selectors/permissionsSelectors';
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
  clearNotificationsThunk,
  hydrateFromCache,
  optimisticMarkRead,
  optimisticMarkAllRead,
  optimisticClear,
  rollbackState,
  resetNotifications,
  selectNotifications,
  selectNotificationsUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError,
} from '../store';
import { NOTIFICATIONS_CACHE_KEY, NOTIFICATIONS_POLL_INTERVAL_MS } from '../constants';
import { readNotificationsCache, writeNotificationsCache, clearNotificationsCache } from '../utils';
import type { Notification, NotificationsCache } from '../models';

export interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markRead: (id: string) => Promise<void>;
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateSnapshotRef = useRef<{ items: Notification[]; unreadCount: number }>({
    items: [],
    unreadCount: 0,
  });

  // Keep an up-to-date snapshot for optimistic rollback.
  useEffect(() => {
    stateSnapshotRef.current = { items: notifications, unreadCount };
  }, [notifications, unreadCount]);

  // Persist cache whenever items change after hydration.
  useEffect(() => {
    if (!hydratedRef.current) return;
    writeNotificationsCache(notifications, unreadCount);
  }, [notifications, unreadCount]);

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
        dispatch(
          hydrateFromCache({
            items: parsed.items as Notification[],
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

  const fetchNow = useCallback(
    (silent: boolean) => {
      if (!userID) return Promise.resolve();
      return dispatch(fetchNotificationsThunk({ userId: userID, silent })).then(() => undefined);
    },
    [dispatch, userID],
  );

  // Polling lifecycle: start when userID set + visible; pause when hidden; stop on logout.
  useEffect(() => {
    if (!userID) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      clearNotificationsCache();
      dispatch(resetNotifications());
      return;
    }

    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        if (!document.hidden) {
          void fetchNow(true);
        }
      }, NOTIFICATIONS_POLL_INTERVAL_MS);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // initial fetch (non-silent so the loading state can render)
    void fetchNow(false);
    if (!document.hidden) start();

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        void fetchNow(true);
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
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

  const refresh = useCallback(() => fetchNow(false), [fetchNow]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markRead,
    markAllRead,
    clearAll,
    refresh,
  };
}
