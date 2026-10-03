import { useEffect, useState } from 'react';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
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

export function usePlanViolations(planId: string, enabled: boolean): UsePlanViolationsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanViolationsResponse | null>(null);
  const [resultFilter, setResultFilter] = useState<ViolationsResultFilter>('all');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let canceled = false;
    fetchPlanViolations(planId, {
      result: resultFilter === 'all' ? undefined : resultFilter,
    })
      .then((res) => {
        if (canceled) return;
        setData(res);
        setError(null);
      })
      .catch((err: unknown) => {
        if (canceled) return;
        const meta = (err as ExtendedAxiosError)?.normalized;
        setError(
          meta?.isTimeout
            ? PPC.LABELS.VIOLATIONS.LOAD_TIMEOUT
            : (meta?.message ?? PPC.LABELS.VIOLATIONS.LOAD_ERROR),
        );
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, [enabled, planId, resultFilter, reloadKey]);

  return {
    data,
    loading,
    error,
    resultFilter,
    setResultFilter,
    refresh: () => setReloadKey((k) => k + 1),
  };
}
