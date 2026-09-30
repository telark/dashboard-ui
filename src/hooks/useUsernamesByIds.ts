import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchUsernames } from '../features/access-and-permissions/users/clients/fetch';
import { ACTORS, TELARK_USER_ID_PATTERN } from '../constants';

const isTelarkUserId = (id: string) => TELARK_USER_ID_PATTERN.test(id);

const ownName = (actor: string) => actor.split(ACTORS.SEGMENT_SEPARATOR).pop() || actor;

const batchesOf = (ids: string[]): string[][] => {
  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += ACTORS.NAMES_BATCH_SIZE) {
    batches.push(ids.slice(i, i + ACTORS.NAMES_BATCH_SIZE));
  }
  return batches;
};

const lookUpBatch = async (
  batch: string[],
  requested: Set<string>,
): Promise<Record<string, string>> => {
  try {
    const names = (await fetchUsernames(batch)).data ?? {};
    return Object.fromEntries(batch.map((id) => [id, names[id] ?? ACTORS.UNKNOWN_USER]));
  } catch {
    // Only a definite answer makes an actor unknown; after a failed call it is asked again.
    batch.forEach((id) => requested.delete(id));
    return {};
  }
};

// Ids still being looked up are absent, so callers render nothing until the name arrives.
// `ids` must be memoised by the caller: it drives the effect.
export function useUsernamesByIds(ids: string[], enabled: boolean): Record<string, string> {
  const [usernamesById, setUsernamesById] = useState<Record<string, string>>({});
  const requestedUserIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const requested = requestedUserIdsRef.current;
    const pending = [...new Set(ids.filter((id) => isTelarkUserId(id) && !requested.has(id)))];
    if (pending.length === 0) return;
    pending.forEach((id) => requested.add(id));

    let cancelled = false;
    let settled = false;
    void Promise.all(batchesOf(pending).map((batch) => lookUpBatch(batch, requested))).then(
      (results) => {
        settled = true;
        if (!cancelled) {
          setUsernamesById((prev) => results.reduce((all, names) => ({ ...all, ...names }), prev));
        }
      },
    );

    return () => {
      cancelled = true;
      // StrictMode re-runs effects: release what this run discards so the re-run asks again.
      if (!settled) pending.forEach((id) => requested.delete(id));
    };
  }, [enabled, ids]);

  return useMemo(
    () => ({
      ...Object.fromEntries(ids.filter((id) => !isTelarkUserId(id)).map((id) => [id, ownName(id)])),
      ...usernamesById,
    }),
    [ids, usernamesById],
  );
}
