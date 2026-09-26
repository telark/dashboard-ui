import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import store from '../../../../store';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import { getCurrentUser } from '../../utils/session/user';
import { purgeLocalUserData } from '../../utils/session/cleanup';
import logger from '../../../../logging';

const PERMISSIONS_POLL_INTERVAL_MS = 60_000;

let pollingIntervalId: ReturnType<typeof setInterval> | null = null;

export const stopPermissionsPolling = (): void => {
  if (pollingIntervalId !== null) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
};

// Runs between rehydration and the first render, so data left by another user
// (a session that ended without logout) is never shown: purge it, then reload clean.
export const dropForeignPermissions = async (): Promise<void> => {
  const { userID } = store.getState().permissions;
  if (userID !== null && userID !== getCurrentUser()?.id) {
    store.dispatch(clearPermissions());
    await purgeLocalUserData();
    window.location.reload();
  }
};

export const useInitializePermissions = (isAuthenticated: boolean): void => {
  const initializedRef = useRef(false);
  const permissions = useSelector(selectPermissionsState);

  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    // Restored permissions already rendered; they are revalidated without the loading gate.
    const restored = store.getState().permissions.userID !== null;
    store.dispatch(fetchMyPermissionsThunk({ silent: restored })).catch((err: unknown) => {
      logger.error('Failed to initialize permissions', err);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || permissions.userID === null) return;
    stopPermissionsPolling();
    pollingIntervalId = setInterval(() => {
      store.dispatch(fetchMyPermissionsThunk({ silent: true }));
    }, PERMISSIONS_POLL_INTERVAL_MS);
    return () => {
      stopPermissionsPolling();
    };
  }, [isAuthenticated, permissions.userID]);
};
