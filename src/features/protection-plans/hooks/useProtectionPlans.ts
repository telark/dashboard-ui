import { useEffect, useState, useCallback } from 'react';
import { fetchProtectionPlans } from '../clients/protectionPlansClient';
import type { ProtectionPlan } from '../models';

interface UseProtectionPlansResult {
  plans: ProtectionPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useProtectionPlans = (): UseProtectionPlansResult => {
  const [plans, setPlans] = useState<ProtectionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      const data = await fetchProtectionPlans();
      setPlans(data);
      setError(null);
    } catch {
      setError('Failed to load Protection Plans');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    fetchProtectionPlans()
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load Protection Plans');
        setLoading(false);
      });
  }, []);

  return {
    plans,
    loading,
    error,
    refresh,
  };
};
