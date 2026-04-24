import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import store from '../../../../store';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import logger from '../../../../logging';

const PERMISSIONS_POLL_INTERVAL_MS = 15_000;

export const useInitializePermissions = (isAuthenticated: boolean, pathname?: string): void => {
  const initializedRef = useRef(false);
  const routeChangeRef = useRef(false);
  const permissions = useSelector(selectPermissionsState);

  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;
  const userIDRef = useRef(permissions.userID);
  userIDRef.current = permissions.userID;
  const loadingRef = useRef(permissions.loading);
  loadingRef.current = permissions.loading;

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
    const id = setInterval(() => {
      store.dispatch(fetchMyPermissionsThunk());
    }, PERMISSIONS_POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, permissions.userID]);

  // Re-fetch immediately on route change; skip initial mount and in-flight fetches
  useEffect(() => {
    if (pathname === undefined) return;
    if (!routeChangeRef.current) {
      routeChangeRef.current = true;
      return;
    }
    if (!isAuthenticatedRef.current || userIDRef.current === null || loadingRef.current) return;
    store.dispatch(fetchMyPermissionsThunk());
  }, [pathname]);
};
