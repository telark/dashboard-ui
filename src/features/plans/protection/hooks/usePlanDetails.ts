import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { POLL_INTERVAL_MS } from '../../../../constants';
import {
  clearPlanDetails,
  fetchProtectionPlansThunk,
  fetchProtectionPlanDetailsThunk,
} from '../store';

export function usePlanDetails(name?: string) {
  const dispatch: AppDispatch = useDispatch();
  const { details, detailsLoading, detailsError, plans, loading } = useSelector(
    (s: RootState) => s.protectionPlans,
  );

  const planFromList = name ? (plans.find((p) => p.name === name) ?? null) : null;
  const planId = planFromList?.id ?? details?.id;

  // The persisted list can be stale (plans added, renamed or deleted elsewhere), so revalidate it.
  useEffect(() => {
    if (!name) return;
    void dispatch(fetchProtectionPlansThunk());
  }, [dispatch, name]);

  useEffect(() => {
    if (!planId) return;
    void dispatch(fetchProtectionPlanDetailsThunk(planId));

    const interval = setInterval(() => {
      void dispatch(fetchProtectionPlanDetailsThunk(planId));
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      dispatch(clearPlanDetails());
    };
  }, [dispatch, planId]);

  const refresh = useCallback(() => {
    if (!planId) return;
    void dispatch(fetchProtectionPlanDetailsThunk(planId));
  }, [dispatch, planId]);

  const notFound = !!name && !loading && plans.length > 0 && !planFromList && !details;

  return {
    details: details ?? planFromList,
    loading: detailsLoading,
    error: detailsError,
    refresh,
    notFound,
  };
}
