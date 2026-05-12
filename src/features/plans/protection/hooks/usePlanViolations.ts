import { useEffect, useState } from 'react';
import { fetchPlanViolations } from '../clients';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanViolationsResponse, ViolationResult } from '../models';

export type ViolationsResultFilter = ViolationResult | 'all';

export interface UsePlanViolationsResult {
  data: PlanViolationsResponse | null;
  loading: boolean;
  error: string | null;
  resultFilter: ViolationsResultFilter;
  setResultFilter: (v: ViolationsResultFilter) => void;
  refresh: () => void;
}

export function usePlanViolations(planId: string): UsePlanViolationsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanViolationsResponse | null>(null);
  const [resultFilter, setResultFilter] = useState<ViolationsResultFilter>('all');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPlanViolations(planId, {
      result: resultFilter === 'all' ? undefined : resultFilter,
    })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(PPC.LABELS.VIOLATIONS.LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [planId, resultFilter, reloadKey]);

  return {
    data,
    loading,
    error,
    resultFilter,
    setResultFilter,
    refresh: () => setReloadKey((k) => k + 1),
  };
}
