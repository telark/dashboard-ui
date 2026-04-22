import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { clearDetails, fetchApplicationDetailsThunk } from '../store';

export function useApplicationDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useSelector((s: RootState) => s.applications);
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : 60,
  );

  useEffect(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));

    const intervalSec = Number.isFinite(fetchIntervalSeconds) ? fetchIntervalSeconds : 60;
    const intervalMs = Math.max(5, intervalSec) * 1000;
    const interval = setInterval(() => {
      void dispatch(fetchApplicationDetailsThunk(name));
    }, intervalMs);

    return () => {
      clearInterval(interval);
      dispatch(clearDetails());
    };
  }, [dispatch, fetchIntervalSeconds, name]);

  const refresh = useCallback(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));
  }, [dispatch, name]);

  return { details, loading, error, refresh };
}
