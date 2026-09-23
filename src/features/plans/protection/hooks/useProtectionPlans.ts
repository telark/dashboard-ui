import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { PLAN_LIST_POLL } from '../constants/protectionPlans';
import {
  fetchProtectionPlansThunk,
  selectProtectionPlans,
  selectProtectionPlansLoading,
  selectProtectionPlansError,
} from '../store';

export const useProtectionPlans = () => {
  const dispatch: AppDispatch = useDispatch();
  const plans = useSelector(selectProtectionPlans);
  const loading = useSelector(selectProtectionPlansLoading);
  const error = useSelector(selectProtectionPlansError);
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : PLAN_LIST_POLL.DEFAULT_SECONDS,
  );

  // A window starts and ends on its exact boundary, so a list fetched once on
  // mount shows a plan as scheduled long after it began enforcing.
  useEffect(() => {
    void dispatch(fetchProtectionPlansThunk());

    const intervalSec = Number.isFinite(fetchIntervalSeconds)
      ? fetchIntervalSeconds
      : PLAN_LIST_POLL.DEFAULT_SECONDS;
    const interval = setInterval(
      () => {
        void dispatch(fetchProtectionPlansThunk());
      },
      Math.max(PLAN_LIST_POLL.MIN_SECONDS, intervalSec) * PLAN_LIST_POLL.MS_PER_SECOND,
    );

    return () => clearInterval(interval);
  }, [dispatch, fetchIntervalSeconds]);

  const refetch = (): void => {
    void dispatch(fetchProtectionPlansThunk());
  };

  return { plans, loading, error, refetch };
};
