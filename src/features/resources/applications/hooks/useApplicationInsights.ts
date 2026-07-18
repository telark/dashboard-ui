import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { ensureGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import logger from '../../../../logging';
import { fetchApplicationInsights, insightsAppKey } from '../clients/insights';
import type { ApplicationInsights } from '../models';
import { APPLICATIONS_ERROR_MESSAGES } from '../constants';

const DEFAULT_INTERVAL_SECONDS = 60;
const MIN_INTERVAL_SECONDS = 10;

export interface ApplicationInsightsState {
  insights: ApplicationInsights | null;
  // Enrichment has been requested for this app but no result is cached yet. The
  // next poll may fill it in.
  isPending: boolean;
  isLoading: boolean;
}

// Insights live outside the app CRD now: they are produced out of band and read
// windowed to the one app on screen. This polls that read on the interval the
// admin set in AI settings, so a freshly enriched app fills in without a reload.
export function useApplicationInsights(namespace: string, name: string): ApplicationInsightsState {
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);

  const [state, setState] = useState<ApplicationInsightsState>({
    insights: null,
    isPending: false,
    isLoading: true,
  });

  const intervalSeconds = Math.max(
    MIN_INTERVAL_SECONDS,
    globalConfig.data?.userSettings?.fetchIntervalSeconds ?? DEFAULT_INTERVAL_SECONDS,
  );

  useEffect(() => {
    dispatch(ensureGlobalConfigThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!namespace || !name) return;

    let active = true;
    const key = insightsAppKey(namespace, name);

    const poll = async () => {
      try {
        const read = await fetchApplicationInsights([key]);
        if (!active) return;
        setState({
          insights: read.results?.[key] ?? null,
          isPending: (read.pending ?? []).includes(key),
          isLoading: false,
        });
      } catch (error) {
        if (!active) return;
        logger.error(APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_INSIGHTS_FAILED, error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    poll();
    const timer = window.setInterval(poll, intervalSeconds * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [namespace, name, intervalSeconds]);

  return state;
}
