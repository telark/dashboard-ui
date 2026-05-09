import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import {
  clearPlanDetails,
  fetchProtectionPlansThunk,
  fetchProtectionPlanDetailsThunk,
} from '../store';

export function usePlanDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, detailsLoading, detailsError, plans } = useSelector(
    (s: RootState) => s.protectionPlans,
  );
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : 60,
  );

  const planFromList = name ? (plans.find((p) => p.name === name) ?? null) : null;
  const planId = planFromList?.id ?? details?.id;

  useEffect(() => {
    if (!name) return;
    if (plans.length === 0) {
      void dispatch(fetchProtectionPlansThunk());
    }
  }, [dispatch, name, plans.length]);

  useEffect(() => {
    if (!planId) return;
    void dispatch(fetchProtectionPlanDetailsThunk(planId));

    const intervalSec = Number.isFinite(fetchIntervalSeconds) ? fetchIntervalSeconds : 60;
    const intervalMs = Math.max(5, intervalSec) * 1000;
    const interval = setInterval(() => {
      void dispatch(fetchProtectionPlanDetailsThunk(planId));
    }, intervalMs);

    return () => {
      clearInterval(interval);
      dispatch(clearPlanDetails());
    };
  }, [dispatch, fetchIntervalSeconds, planId]);

  const refresh = useCallback(() => {
    if (!planId) return;
    void dispatch(fetchProtectionPlanDetailsThunk(planId));
  }, [dispatch, planId]);

  const notFound = !!name && plans.length > 0 && !planFromList && !details;

  return {
    details: details ?? planFromList,
    loading: detailsLoading,
    error: detailsError,
    refresh,
    notFound,
  };
}
