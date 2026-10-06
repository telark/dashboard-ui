import { useCallback, useEffect, useRef, useState } from 'react';
import logger from '../../../logging';
import { fetchAnalyzerRuntime } from '../clients/insights';
import { keepInsightsStream } from '../clients/insightsStream';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { INSIGHT_EVENTS } from '../constants/insights';
import type { AnalyzerRuntime, InsightEvent } from '../models';

export interface AnalyzerRuntimeState {
  runtime: AnalyzerRuntime | null;
  connected: boolean;
  isLoading: boolean;
}

export interface AnalyzerRuntimeHook extends AnalyzerRuntimeState {
  // The GET reads the saved config first, so a settings save shows without waiting for the poll.
  refresh: () => Promise<void>;
}

// runtime.changed carries no pull progress; progress only matters while pulling.
export const applyRuntimeEvent = (
  prev: AnalyzerRuntime | null,
  e: InsightEvent,
): AnalyzerRuntime | null => {
  if (e.name === INSIGHT_EVENTS.RUNTIME_CHANGED) {
    return { ...e.data, pull: e.data.state === 'pulling' ? prev?.pull : undefined };
  }
  if (e.name === INSIGHT_EVENTS.RUNTIME_PULL && prev) {
    return { ...prev, pull: { status: prev.pull?.status ?? '', ...e.data } };
  }
  return prev;
};

// Settings view of the analyzer runtime: one GET, then runtime events only (apps=[]).
export function useAnalyzerRuntime(): AnalyzerRuntimeHook {
  const [state, setState] = useState<AnalyzerRuntimeState>({
    runtime: null,
    connected: false,
    isLoading: true,
  });
  const refetchRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const refetch = async (): Promise<void> => {
      try {
        const runtime = await fetchAnalyzerRuntime();
        if (!signal.aborted) setState((prev) => ({ ...prev, runtime, isLoading: false }));
      } catch (error) {
        if (signal.aborted) return;
        logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.RUNTIME_FETCH_FAILED, error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    const onEvent = (e: InsightEvent): void => {
      if (e.name === INSIGHT_EVENTS.RESYNC) {
        void refetch();
        return;
      }
      setState((prev) => ({ ...prev, runtime: applyRuntimeEvent(prev.runtime, e) }));
    };

    const onConnected = (connected: boolean): void => {
      setState((prev) => ({ ...prev, connected }));
      if (connected) void refetch();
    };

    refetchRef.current = refetch;
    void refetch();
    void keepInsightsStream([], onEvent, onConnected, signal);
    return () => controller.abort();
  }, []);

  const refresh = useCallback(() => refetchRef.current(), []);
  return { ...state, refresh };
}
