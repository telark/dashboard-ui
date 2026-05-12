import { useState, useCallback, useEffect } from 'react';
import { getSessionsList, getSessionDetails, deleteSession } from '../clients/session';
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

const resolveSessionsFromToken = async (): Promise<SessionDetails[]> => {
  const currentToken = getSessionToken();
  if (!currentToken) return [];
  try {
    const single = await getSessionDetails(currentToken);
    return single?.data ? [single.data] : [];
  } catch {
    return [];
  }
};

export const useSessionsList = (): UseSessionsListResult => {
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const userId = getCurrentUser()?.id;
    if (!userId) {
      setSessions([]);
      setError('Failed to load sessions.');
      setLoading(false);
      return;
    }
    try {
      const response = await getSessionsList(userId);
      const items = response?.data?.items;
      if (Array.isArray(items)) {
        setSessions(items);
      } else {
        setSessions(await resolveSessionsFromToken());
      }
    } catch {
      const fallback = await resolveSessionsFromToken();
      setSessions(fallback);
      if (fallback.length === 0) setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const userId = getCurrentUser()?.id;

    const load: Promise<{ s: SessionDetails[]; e: string | null }> = userId
      ? getSessionsList(userId)
          .then(async (response) => {
            const items = response?.data?.items;
            const s = Array.isArray(items) ? items : await resolveSessionsFromToken();
            return { s, e: null };
          })
          .catch(async () => {
            const s = await resolveSessionsFromToken();
            return { s, e: s.length === 0 ? 'Failed to load sessions.' : null };
          })
      : Promise.resolve({ s: [] as SessionDetails[], e: 'Failed to load sessions.' });

    load
      .then(({ s, e }) => {
        if (!cancelled) {
          setSessions(s);
          setError(e);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
