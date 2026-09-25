import axios from 'axios';
import type { ResourceDetailsResponse } from '../../../interfaces/http';
import {
  INSIGHT_ERROR_CODES,
  QUEUED_TIMEOUT_MS,
  RUNNING_TIMEOUT_MS,
  SEVERITY_RANK,
} from '../constants/insights';
import type { Insight, LastRun } from '../models';

export const byPriority = (a: Insight, b: Insight): number =>
  SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
  Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt);

export const runDeadline = (run: LastRun): number | null => {
  if (run.status === 'running') return Date.parse(run.startedAt) + RUNNING_TIMEOUT_MS;
  if (run.status === 'queued') return Date.parse(run.queuedAt ?? '') + QUEUED_TIMEOUT_MS;
  return null;
};

// A queued/running lastRun past its deadline means the analyzer never finished
// it (crash, or disabled while queued); render it failed instead of stuck.
export const effectiveRun = (run: LastRun, now: number): LastRun => {
  const deadline = runDeadline(run);
  if (deadline === null || Number.isNaN(deadline) || now < deadline) return run;
  return {
    ...run,
    status: 'failed',
    error: run.status === 'queued' ? INSIGHT_ERROR_CODES.JOB_EXPIRED : run.error,
  };
};

export const apiErrorCode = (error: unknown): string | undefined =>
  axios.isAxiosError<ResourceDetailsResponse<{ code?: string }>>(error)
    ? error.response?.data?.data?.code
    : undefined;
