import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import store from '../../../../store';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import { hasSessionToken } from '../../utils/session/token';
import logger from '../../../../logging';

const PERMISSIONS_POLL_INTERVAL_MS = 15_000;

let pollingIntervalId: ReturnType<typeof setInterval> | null = null;

export const stopPermissionsPolling = (): void => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
};

export const useInitializePermissions = (isAuthenticated: boolean, pathname?: string): void => {
  const initializedRef = useRef(false);
  const prevPathnameRef = useRef<string | undefined>(undefined);
  const permissions = useSelector(selectPermissionsState);

  useEffect(() => {
    if (!isAuthenticated || initializedRef.current || permissions.userID !== null) {
      return;
    }

    initializedRef.current = true;
    store.dispatch(fetchMyPermissionsThunk()).catch((err: unknown) => {
      logger.error('Failed to initialize permissions', err);
    });
  }, [isAuthenticated, permissions.userID]);

  useEffect(() => {
    if (!isAuthenticated || permissions.userID === null) return;
    stopPermissionsPolling();
    pollingIntervalId = setInterval(() => {
      store.dispatch(fetchMyPermissionsThunk());
    }, PERMISSIONS_POLL_INTERVAL_MS);
    return () => {
      stopPermissionsPolling();
    };
  }, [isAuthenticated, permissions.userID]);

  // Re-fetch immediately on route change; skip initial mount and in-flight fetches
  useEffect(() => {
    if (pathname === undefined) return;
    if (prevPathnameRef.current === pathname) return;
    const isRouteChange = prevPathnameRef.current !== undefined;
    prevPathnameRef.current = pathname;
    if (!isRouteChange) return;
    if (!isAuthenticated || !hasSessionToken()) return;
    if (permissions.userID === null || permissions.loading || !permissions.ready) return;
    store.dispatch(fetchMyPermissionsThunk());
  }, [pathname, isAuthenticated, permissions.userID, permissions.loading, permissions.ready]);
};
