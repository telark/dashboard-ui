import type {
  AnalyzerRuntime,
  AppInsights,
  ClusterInsightsPage,
  Insight,
  InsightRow,
  LastRun,
} from '../../features/insights/models';
import { createFactory } from '../factory';

const FIRST_SEEN = '2026-01-15T10:00:00Z';
const LAST_SEEN = '2026-01-15T11:00:00Z';

export const buildInsightRow = createFactory<InsightRow>((sequence) => ({
  id: `insight-${sequence}`,
  namespace: 'payments',
  app: `checkout-${sequence}`,
  category: 'incident',
  kind: 'crashloop',
  reason: 'crashloop.exit_1',
  subject: `Deployment/checkout-${sequence}`,
  title: `Crash loop on checkout-${sequence}`,
  severity: 'critical',
  confidence: 'high',
  status: 'open',
  stale: false,
  firstSeenAt: FIRST_SEEN,
  lastSeenAt: LAST_SEEN,
}));

export const buildInsight = createFactory<Insight>((sequence) => ({
  id: `insight-${sequence}`,
  kind: 'crashloop',
  reason: 'crashloop.exit_1',
  subject: `Deployment/checkout-${sequence}`,
  title: `Crash loop on checkout-${sequence}`,
  summary: 'The container keeps exiting.',
  confidence: 'high',
  severity: 'critical',
  status: 'open',
  evidence: [{ type: 'event', ref: `event/${sequence}` }],
  firstSeenAt: FIRST_SEEN,
  lastSeenAt: LAST_SEEN,
  runs: 1,
  category: 'incident',
}));

export const buildLastRun = createFactory<LastRun>((sequence) => ({
  status: 'done',
  trigger: 'manual',
  runId: `run-${sequence}`,
  startedAt: FIRST_SEEN,
  finishedAt: LAST_SEEN,
  error: '',
  model: 'granite4:350m',
  steps: 4,
  toolCalls: 2,
  truncated: false,
}));

export const buildAppInsights = (overrides: Partial<AppInsights> = {}): AppInsights => ({
  insights: [buildInsight()],
  lastRun: buildLastRun(),
  version: 1,
  ...overrides,
});

export const buildRuntime = (overrides: Partial<AnalyzerRuntime> = {}): AnalyzerRuntime => ({
  state: 'ready',
  model: 'granite4:350m',
  reason: '',
  mode: 'fast',
  autoPull: true,
  enabled: true,
  ...overrides,
});

/** One list response; its counts follow the rows unless a test overrides them. */
export const buildClusterPage = (
  items: InsightRow[],
  overrides: Partial<ClusterInsightsPage> = {},
): ClusterInsightsPage => {
  const incidents = items.filter((row) => row.category !== 'recommendation').length;
  const bySeverity = { critical: 0, warning: 0, info: 0 };
  for (const row of items) bySeverity[row.severity] += 1;
  return {
    items,
    total: items.length,
    page: 1,
    pageSize: items.length,
    counts: {
      bySeverity,
      byCategory: { incident: incidents, recommendation: items.length - incidents },
      byState: {},
    },
    indexedAt: LAST_SEEN,
    ...overrides,
  };
};
