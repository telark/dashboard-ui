import { useEffect, useState } from 'react';
import { fetchPlanStatus } from '../clients';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanStatusResponse } from '../models';

export interface UsePlanHealthResult {
  status: PlanStatusResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlanHealth(planId: string, revision?: string): UsePlanHealthResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PlanStatusResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let canceled = false;
    fetchPlanStatus(planId)
      .then((data) => {
        if (canceled) return;
        setStatus(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (canceled) return;
        const message = err instanceof Error ? err.message : PPC.LABELS.HEALTH_DETAIL.LOAD_ERROR;
        setError(message);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, [planId, reloadKey, revision]);

  return {
    status,
    loading,
    error,
    refresh: () => setReloadKey((k) => k + 1),
  };
}
