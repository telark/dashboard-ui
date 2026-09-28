import { useEffect, useRef, useState } from 'react';
import { fetchUserById } from '../../access-and-permissions/users/clients/fetch';

// Change log and rollback entries store the actor as a user id (u-ac247-c2a5-0334).
// Resolving it lets rows read "by alice" while still showing the id. Ids already
// looked up are never refetched, so this stays cheap as rows re-render.
// `ids` must be memoised by the caller: it drives the effect.
export function useUsernamesByIds(ids: string[], enabled: boolean): Record<string, string> {
  const [usernamesById, setUsernamesById] = useState<Record<string, string>>({});
  const requestedUserIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const requested = requestedUserIdsRef.current;
    const pending = ids.filter((id) => Boolean(id) && !requested.has(id));
    if (pending.length === 0) return;

    const uniqueIds = [...new Set(pending)];
    uniqueIds.forEach((id) => requested.add(id));

    let cancelled = false;
    void Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const response = await fetchUserById(id, true);
          return [id, response?.data?.username || id] as const;
        } catch {
          // Deleted or unreadable user: keep showing the raw id rather than nothing.
          return [id, id] as const;
        }
      }),
    ).then((pairs) => {
      if (!cancelled) setUsernamesById((prev) => ({ ...prev, ...Object.fromEntries(pairs) }));
    });

    return () => {
      cancelled = true;
      // StrictMode double-invokes effects. The re-run would find these ids
      // already marked and skip the fetch, while this run's result is discarded
      // as cancelled, leaving the name unresolved forever. Release them so the
      // re-run fetches again; resolved ids stay marked and are never refetched.
      uniqueIds.forEach((id) => requested.delete(id));
    };
  }, [enabled, ids]);

  return usernamesById;
}
