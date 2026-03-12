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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProtectionPlans();
      setPlans(data);
    } catch (e) {
      setError('Failed to load Protection Plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  return {
    plans,
    loading,
    error,
    refresh: loadPlans,
  };
};

