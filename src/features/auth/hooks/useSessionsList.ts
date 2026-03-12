import { useState, useCallback, useEffect } from 'react';
import { getSessionsList, getSessionDetails, deleteSession } from '../clients';
import { getSessionToken } from '../utils/session/token';
import { getCurrentUser } from '../utils/session/user';
import type { SessionDetails } from '../models/session';

export interface UseSessionsListResult {
  sessions: SessionDetails[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  revokeSession: (
    sessionToken: string,
    options: { onRevokedCurrentSession?: () => void },
  ) => Promise<void>;
}

export const useSessionsList = (): UseSessionsListResult => {
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const currentUser = getCurrentUser();
    const userId = currentUser?.id;
    if (!userId) {
      setSessions([]);
      setLoading(false);
      setError('Failed to load sessions.');
      return;
    }
    try {
      const response = await getSessionsList(userId);
      const items = response?.data?.items;
      if (Array.isArray(items)) {
        setSessions(items);
      } else {
        const currentToken = getSessionToken();
        if (currentToken) {
          const single = await getSessionDetails(currentToken);
          if (single?.data) {
            setSessions([single.data]);
          } else {
            setSessions([]);
          }
        } else {
          setSessions([]);
        }
      }
    } catch {
      const currentToken = getSessionToken();
      if (currentToken) {
        try {
          const single = await getSessionDetails(currentToken);
          if (single?.data) {
            setSessions([single.data]);
          } else {
            setSessions([]);
            setError('Failed to load sessions.');
          }
        } catch {
          setSessions([]);
          setError('Failed to load sessions.');
        }
      } else {
        setSessions([]);
        setError('Failed to load sessions.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = useCallback(
    async (
      sessionToken: string,
      { onRevokedCurrentSession }: { onRevokedCurrentSession?: () => void },
    ) => {
      try {
        await deleteSession(sessionToken);
        const currentToken = getSessionToken();
        if (currentToken === sessionToken && onRevokedCurrentSession) {
          onRevokedCurrentSession();
        } else {
          await fetchSessions();
        }
      } catch {
        await fetchSessions();
        throw new Error('Revoke failed');
      }
    },
    [fetchSessions],
  );

  return { sessions, loading, error, refetch: fetchSessions, revokeSession };
};
