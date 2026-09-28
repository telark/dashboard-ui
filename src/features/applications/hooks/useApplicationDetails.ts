import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { clearDetails, fetchApplicationDetailsThunk } from '../store';
import { APPLICATIONS_SYNC_ACTIVE_POLL_MS, SYNC_STATUS_VALUE } from '../constants';

export function useApplicationDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useSelector((s: RootState) => s.applications);
  const isSyncing = useSelector(
    (s: RootState) =>
      Boolean(name && s.applications.syncing?.[name]) ||
      (name != null && s.applications.syncStatus?.[name] === SYNC_STATUS_VALUE.SYNCING),
  );
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : 60,
  );

  useEffect(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));

    const intervalSec = Number.isFinite(fetchIntervalSeconds) ? fetchIntervalSeconds : 60;
    const intervalMs = isSyncing
      ? APPLICATIONS_SYNC_ACTIVE_POLL_MS
      : Math.max(5, intervalSec) * 1000;
    const interval = setInterval(() => {
      void dispatch(fetchApplicationDetailsThunk(name));
    }, intervalMs);

    return () => {
      clearInterval(interval);
      dispatch(clearDetails());
    };
  }, [dispatch, fetchIntervalSeconds, isSyncing, name]);

  const refresh = useCallback(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));
  }, [dispatch, name]);

  return { details, loading, error, refresh };
}
