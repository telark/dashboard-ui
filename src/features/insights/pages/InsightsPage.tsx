import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import logger from '../../../logging';
import { fetchApplicationInsights } from '../clients/insights';
import ClusterInsightsView from '../components/ClusterInsightsView';
import InsightsTabs, { readInsightsTab } from '../components/InsightsTabs';
import { SetupReviewLine } from '../components/RunLine';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { CLUSTER_INSIGHTS } from '../constants/insights';
import { useClusterInsights } from '../hooks/useClusterInsights';
import { validApp } from '../utils/view';
import type { ClusterInsightsQuery, InsightsTab } from '../models';

// /insights?tab=incidents|recommendations; ?app=<namespace>/<name> filters both tabs to one
// application and ?insight=<id> opens that insight's details panel (on its own tab).
const InsightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = readInsightsTab(searchParams);
  const app = searchParams.get(CLUSTER_INSIGHTS.APP_PARAM) ?? '';
  // One row is enough: the tab labels only read the open counts per category, of the same
  // application as the tabs when ?app= filters them.
  const countsQuery: ClusterInsightsQuery = useMemo(
    () => ({ page: 1, pageSize: 1, app: validApp(app) ? [app] : undefined }),
    [app],
  );
  const {
    page: countsPage,
    error: countsError,
    refresh: refreshCounts,
  } = useClusterInsights(countsQuery);
  const byCategory = countsPage?.counts.byCategory;
  const incidents = byCategory?.incident ?? 0;
  const recommendations = byCategory?.recommendation ?? 0;
  const loaded = byCategory !== undefined;
  const countsFailed = countsError !== null;
  // Each tab stays mounted after its first visit, and the tabs element only changes with the
  // counts, so a switch does not re-render or refetch the hidden tab.
  const [visited, setVisited] = useState<Set<InsightsTab>>(() => new Set([tab]));
  if (!visited.has(tab)) {
    setVisited(new Set(visited).add(tab));
  }
  const tabs = useMemo(
    () => (
      <InsightsTabs
        counts={loaded ? { incident: incidents, recommendation: recommendations } : undefined}
        countsFailed={countsFailed}
      />
    ),
    [loaded, incidents, recommendations, countsFailed],
  );

  // The filtered app's setup review, shared by both tabs. Re-read on the list's poll: an Analyze
  // that changed no card still moves it.
  const [review, setReview] = useState<{ app: string; at?: string } | null>(null);
  useEffect(() => {
    if (!validApp(app)) return undefined;
    let canceled = false;
    const read = (): void => {
      fetchApplicationInsights([app])
        .then((res) => {
          // A pending document could not be read yet: unknown, so nothing shows.
          if (canceled || res.pending?.includes(app)) return;
          const at = res.results?.[app]?.lastReviewAt;
          setReview((prev) => (prev?.app === app && prev.at === at ? prev : { app, at }));
        })
        .catch((error) =>
          logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.FETCH_INSIGHTS_FAILED, error),
        );
    };
    read();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') read();
    }, CLUSTER_INSIGHTS.POLL_MS);
    return () => {
      canceled = true;
      clearInterval(timer);
    };
  }, [app]);
  const appNote = useMemo(
    () => (review?.app === app ? <SetupReviewLine at={review.at} /> : undefined),
    [review, app],
  );

  return (
    <>
      {(['incidents', 'recommendations'] as const).map((key) =>
        visited.has(key) ? (
          <div key={key} style={{ display: tab === key ? undefined : 'none' }}>
            <ClusterInsightsView
              tab={key}
              active={tab === key}
              tabs={tabs}
              appNote={appNote}
              onChanged={refreshCounts}
            />
          </div>
        ) : null,
      )}
    </>
  );
};

export default InsightsPage;
