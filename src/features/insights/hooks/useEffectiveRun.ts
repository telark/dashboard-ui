import { useEffect, useState } from 'react';
import { effectiveRun, runDeadline } from '../utils/run';
import type { LastRun } from '../models';

// Re-renders once at the run's deadline, so a run the analyzer never finished reads failed.
export function useEffectiveRun(lastRun: LastRun | undefined): LastRun | null {
  const [now, setNow] = useState(() => Date.now());
  const deadline = lastRun ? runDeadline(lastRun) : null;
  useEffect(() => {
    if (deadline === null || Number.isNaN(deadline)) return undefined;
    const timer = setTimeout(() => setNow(Date.now()), Math.max(0, deadline - Date.now()));
    return () => clearTimeout(timer);
  }, [deadline]);
  return lastRun?.runId ? effectiveRun(lastRun, now) : null;
}
