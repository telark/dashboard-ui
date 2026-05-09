import { useEffect, useState } from 'react';
import { fetchPlanStatus } from '../clients/protectionPlansClient';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanStatusResponse } from '../models';

export interface UsePlanHealthResult {
  status: PlanStatusResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlanHealth(planId: string, onLoaded?: () => void): UsePlanHealthResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PlanStatusResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPlanStatus(planId)
      .then((data) => {
        if (cancelled) return;
        setStatus(data);
        setError(null);
        onLoaded?.();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : PPC.LABELS.HEALTH_DETAIL.LOAD_ERROR;
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [planId, reloadKey, onLoaded]);

  return {
    status,
    loading,
    error,
    refresh: () => setReloadKey((k) => k + 1),
  };
}
