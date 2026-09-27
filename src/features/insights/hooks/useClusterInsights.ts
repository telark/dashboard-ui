import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logger from '../../../logging';
import { HTTP_STATUS } from '../../../constants';
import { keepUnchanged } from '../../../store/keepUnchanged';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { fetchClusterInsights } from '../clients/insights';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { CLUSTER_INSIGHTS } from '../constants/insights';
import type { ClusterInsightsPage, ClusterInsightsQuery, InsightRow } from '../models';

export interface ClusterInsightsState {
  page: ClusterInsightsPage | null;
  // Client clock when `page` arrived; 0 before the first page.
  receivedAt: number;
  loading: boolean;
  error: string | null;
}

export const insightRowKey = (row: InsightRow): string => `${row.namespace}/${row.app}/${row.id}`;

// Only a 4xx is definite; network blips and 5xx keep the last page (if any) and retry on the next poll.
const isDefiniteError = (error: unknown): boolean => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  return (
    status !== undefined &&
    status >= HTTP_STATUS.BAD_REQUEST &&
    status < HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

// `query` must be memoised by the caller: a new object refetches. An inactive caller (a hidden
// tab) neither reads nor polls; it reads again when it becomes active.
export function useClusterInsights(
  query: ClusterInsightsQuery,
  active = true,
): ClusterInsightsState & { refresh: () => void } {
  const [state, setState] = useState<ClusterInsightsState>({
    page: null,
    receivedAt: 0,
    loading: true,
    error: null,
  });
  const refreshRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (!active) return undefined;
    let etag = '';
    let inFlight = false;
    let again = false;
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;

    // One read at a time; a request arriving meanwhile (a refresh after triage) runs right after.
    const load = async (): Promise<void> => {
      if (cancelled) return;
      if (inFlight) {
        again = true;
        return;
      }
      inFlight = true;
      try {
        const read = await fetchClusterInsights(query, etag);
        if (cancelled) return;
        if (read.kind === 'not-ready') {
          retry = setTimeout(() => void load(), CLUSTER_INSIGHTS.NOT_READY_RETRY_MS);
        } else if (read.kind === 'page') {
          etag = read.etag;
          // A row can shift across pages between two page reads; the next poll corrects it.
          const items = [
            ...new Map((read.page.items ?? []).map((row) => [insightRowKey(row), row])).values(),
          ];
          setState((prev) => ({
            page: {
              ...read.page,
              items: keepUnchanged(prev.page?.items ?? [], items, insightRowKey),
            },
            receivedAt: Date.now(),
            loading: false,
            error: null,
          }));
        }
      } catch (error) {
        if (cancelled) return;
        logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.FETCH_CLUSTER_INSIGHTS_FAILED, error);
        // Without a first page there is nothing to keep showing, so any failure is reported. A 4xx
        // carries the server's reason; the generic text reads as a network outage.
        const definite = isDefiniteError(error);
        const fallback = INSIGHTS_ERROR_MESSAGES.CLIENT.FETCH_CLUSTER_INSIGHTS_FAILED;
        setState((prev) =>
          definite || !prev.page
            ? {
                ...prev,
                loading: false,
                error: definite ? extractErrorMessage(error, fallback) : fallback,
              }
            : prev,
        );
      } finally {
        inFlight = false;
      }
      if (again) {
        again = false;
        void load();
      }
    };

    const poll = (): void => {
      if (document.visibilityState === 'visible') void load();
    };

    refreshRef.current = () => {
      etag = '';
      void load();
    };
    void load();
    const timer = setInterval(poll, CLUSTER_INSIGHTS.POLL_MS);
    document.addEventListener('visibilitychange', poll);
    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(retry);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [query, active]);

  const refresh = useCallback(() => refreshRef.current(), []);

  return { ...state, refresh };
}
