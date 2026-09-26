import { useState, useCallback, useEffect } from 'react';
import {
  getSessionsList,
  getCurrentSession,
  deleteCurrentSession,
  deleteSessionByName,
} from '../clients/session';
import { getSessionToken, getCurrentSessionName } from '../utils/session/token';
import { getCurrentUser } from '../utils/session/user';
import type { SessionDetails } from '../models/session';

export interface UseSessionsListResult {
  sessions: SessionDetails[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  revokeSession: (
    sessionName: string,
    options: { onRevokedCurrentSession?: () => void },
  ) => Promise<void>;
}

const resolveSessionsFromToken = async (): Promise<SessionDetails[]> => {
  const currentToken = getSessionToken();
  if (!currentToken) return [];
  try {
    const single = await getCurrentSession();
    if (!single?.data) return [];
    // The single-session response carries no metadata, so name it here — the
    // rest of the UI addresses a session by its resource name.
    const name = await getCurrentSessionName();
    return [name ? { ...single.data, metadata: { name } } : single.data];
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
      sessionName: string,
      { onRevokedCurrentSession }: { onRevokedCurrentSession?: () => void },
    ) => {
      try {
        const currentSessionName = await getCurrentSessionName();
        const isCurrent = currentSessionName === sessionName;
        if (isCurrent) {
          await deleteCurrentSession();
        } else {
          await deleteSessionByName(sessionName);
        }
        if (isCurrent && onRevokedCurrentSession) {
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
