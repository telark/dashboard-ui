import { useCallback, useEffect, useRef, useState } from 'react';
import logger from '../../../logging';
import {
  analyzeApplication,
  fetchAnalyzerRuntime,
  fetchApplicationInsights,
  insightsAppKey,
  triageInsight,
} from '../clients/insights';
import { keepInsightsStream } from '../clients/insightsStream';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { INSIGHT_EVENTS, insightErrorMessage, triageErrorMessage } from '../constants/insights';
import type { AnalyzerRuntime, AppInsights, InsightEvent, TriageAction } from '../models';
import { apiErrorCode as errorCode } from '../utils/run';
import { applyRuntimeEvent } from './useAnalyzerRuntime';

// No run-status flag here on purpose: Queued/Running/Failed come from
// insights.lastRun, which only the analyzer writes, and every GET replaces the
// document wholesale, so a stale status cannot outlive the next refetch.
export interface ApplicationInsightsState {
  insights: AppInsights | null;
  runtime: AnalyzerRuntime | null;
  connected: boolean;
  isLoading: boolean;
  // The last GET failed: a missing document then means "unknown", not "gone".
  loadFailed: boolean;
  error: string | null;
}

export interface UseApplicationInsights extends ApplicationInsightsState {
  analyze: () => Promise<void>;
  // Resolves true when the analyzer accepted the triage.
  triage: (id: string, action: TriageAction) => Promise<boolean>;
}

export function useApplicationInsights(namespace: string, name: string): UseApplicationInsights {
  const [state, setState] = useState<ApplicationInsightsState>({
    insights: null,
    runtime: null,
    connected: false,
    isLoading: true,
    loadFailed: false,
    error: null,
  });
  const refetchRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (!namespace || !name) return;

    const controller = new AbortController();
    const { signal } = controller;
    const key = insightsAppKey(namespace, name);
    let version = 0;
    let inFlight = false;
    let again = false;

    // One GET at a time; requests arriving meanwhile coalesce into one more GET.
    const refetch = async (): Promise<void> => {
      if (inFlight) {
        again = true;
        return;
      }
      inFlight = true;
      do {
        again = false;
        try {
          const read = await fetchApplicationInsights([key]);
          if (signal.aborted) return;
          const doc = read.results?.[key] ?? null;
          version = doc?.version ?? 0;
          setState((prev) => ({ ...prev, insights: doc, isLoading: false, loadFailed: false }));
        } catch (error) {
          if (signal.aborted) return;
          logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.FETCH_INSIGHTS_FAILED, error);
          setState((prev) => ({ ...prev, isLoading: false, loadFailed: true }));
        }
      } while (again);
      inFlight = false;
    };

    const refetchRuntime = async (): Promise<void> => {
      try {
        const runtime = await fetchAnalyzerRuntime();
        if (!signal.aborted) setState((prev) => ({ ...prev, runtime }));
      } catch (error) {
        if (!signal.aborted) {
          logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.RUNTIME_FETCH_FAILED, error);
        }
      }
    };

    const resync = (): void => {
      void refetch();
      void refetchRuntime();
    };

    const onEvent = (e: InsightEvent): void => {
      switch (e.name) {
        case INSIGHT_EVENTS.RUNTIME_CHANGED:
        case INSIGHT_EVENTS.RUNTIME_PULL:
          setState((prev) => ({ ...prev, runtime: applyRuntimeEvent(prev.runtime, e) }));
          return;
        case INSIGHT_EVENTS.RESYNC:
          resync();
          return;
        case INSIGHT_EVENTS.ANALYSIS_FAILED:
          // GET even without a version bump: app_not_found deletes the document.
          setState((prev) => ({ ...prev, error: insightErrorMessage(e.data.error) }));
          void refetch();
          return;
        default:
          if (e.name === INSIGHT_EVENTS.ANALYSIS_STARTED) {
            setState((prev) => ({ ...prev, error: null }));
          }
          if (e.data.version > version) void refetch();
      }
    };

    const onConnected = (connected: boolean): void => {
      setState((prev) => ({ ...prev, connected }));
      if (connected) resync();
    };

    refetchRef.current = () => void refetch();
    resync();
    void keepInsightsStream([key], onEvent, onConnected, signal);
    return () => controller.abort();
  }, [namespace, name]);

  // The GET after a 202 shows Queued/Running even while the stream is down.
  const analyze = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      await analyzeApplication(namespace, name);
      refetchRef.current();
    } catch (error) {
      setState((prev) => ({ ...prev, error: insightErrorMessage(errorCode(error)) }));
    }
  }, [namespace, name]);

  const triage = useCallback(
    async (id: string, action: TriageAction): Promise<boolean> => {
      setState((prev) => ({ ...prev, error: null }));
      let ok = true;
      try {
        await triageInsight(namespace, name, id, action);
      } catch (error) {
        ok = false;
        logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.TRIAGE_INSIGHT_FAILED, error);
        setState((prev) => ({ ...prev, error: triageErrorMessage(errorCode(error)) }));
      }
      // Refetch either way: a 404/409 means the card changed under us.
      refetchRef.current();
      return ok;
    },
    [namespace, name],
  );

  return { ...state, analyze, triage };
}
