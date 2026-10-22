import { useState, useCallback, useEffect } from 'react';
import {
  getSessionsList,
  getCurrentSession,
  deleteCurrentSession,
  deleteSessionByName,
} from '../clients/session';
import { getCurrentSessionName, isSignedIn } from '../utils/session/token';
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

// When the list can't be read, at least this device's session, which the exporter answers with its name.
const resolveCurrentSession = async (): Promise<SessionDetails[]> => {
  if (!isSignedIn()) return [];
  try {
    const single = await getCurrentSession();
    return single?.data ? [single.data] : [];
  } catch {
    return [];
  }
};

export const useSessionsList = (): UseSessionsListResult => {
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // A refetch (after a revoke) keeps the rows on screen until the new list lands.
  const fetchSessions = useCallback(async () => {
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
        setSessions(await resolveCurrentSession());
      }
    } catch {
      const fallback = await resolveCurrentSession();
      setSessions(fallback);
      if (fallback.length === 0) setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let canceled = false;
    const userId = getCurrentUser()?.id;

    const load: Promise<{ s: SessionDetails[]; e: string | null }> = userId
      ? getSessionsList(userId)
          .then(async (response) => {
            const items = response?.data?.items;
            const s = Array.isArray(items) ? items : await resolveCurrentSession();
            return { s, e: null };
          })
          .catch(async () => {
            const s = await resolveCurrentSession();
            return { s, e: s.length === 0 ? 'Failed to load sessions.' : null };
          })
      : Promise.resolve({ s: [] as SessionDetails[], e: 'Failed to load sessions.' });

    load
      .then(({ s, e }) => {
        if (!canceled) {
          setSessions(s);
          setError(e);
        }
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
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
