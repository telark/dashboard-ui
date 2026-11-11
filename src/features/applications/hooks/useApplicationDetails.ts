import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { clearDetails, fetchApplicationDetailsThunk } from '../store';
import { APPLICATIONS_SYNC_ACTIVE_POLL_MS, SYNC_STATUS_VALUE } from '../constants';
import { POLL_INTERVAL_MS } from '../../../constants';
import { pollWhileVisible } from '../../../utils/helpers/poll';

export function useApplicationDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, error } = useSelector((s: RootState) => s.applications);
  const isSyncing = useSelector(
    (s: RootState) =>
      Boolean(name && s.applications.syncing?.[name]) ||
      (name != null && s.applications.syncStatus?.[name] === SYNC_STATUS_VALUE.SYNCING),
  );

  useEffect(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, name]);

  // Separate from the load above: a sync starting or ending changes the poll rate, never the page.
  useEffect(() => {
    if (!name) return;
    const intervalMs = isSyncing ? APPLICATIONS_SYNC_ACTIVE_POLL_MS : POLL_INTERVAL_MS;
    return pollWhileVisible(() => void dispatch(fetchApplicationDetailsThunk(name)), intervalMs);
  }, [dispatch, isSyncing, name]);

  const refresh = useCallback(() => {
    if (!name) return;
    void dispatch(fetchApplicationDetailsThunk(name));
  }, [dispatch, name]);

  return { details, error, refresh };
}
