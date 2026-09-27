export type InsightKind =
  | 'crashloop'
  | 'oom'
  | 'image_pull'
  | 'probe_failure'
  | 'scheduling'
  | 'rollout_stuck'
  | 'config_change_regression'
  | 'resource_pressure'
  | 'other'
  | RecommendationKind;

export type RecommendationKind =
  | 'reliability'
  | 'resources'
  | 'scaling'
  | 'security'
  | 'images'
  | 'config'
  | 'networking'
  | 'change_risk'
  | 'protection'
  | 'consistency';

export type InsightCategory = 'incident' | 'recommendation';

export type TriageState = 'acknowledged' | 'dismissed';

export type TriageAction = 'acknowledge' | 'dismiss' | 'reopen';

export interface InsightTriage {
  state: TriageState;
  by: string;
  at: string;
}

export type InsightStatus = 'open' | 'updated' | 'resolved';

export type InsightConfidence = 'low' | 'medium' | 'high';

export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface EvidenceRef {
  type: 'change' | 'snapshot' | 'event' | 'workload' | 'spec' | 'object' | 'metric' | 'plan';
  ref: string;
}

export interface Insight {
  id: string;
  kind: InsightKind;
  subject: string;
  title: string;
  summary: string;
  confidence: InsightConfidence;
  severity: InsightSeverity;
  status: InsightStatus;
  evidence: EvidenceRef[];
  firstSeenAt: string;
  lastSeenAt: string;
  resolvedAt?: string;
  runs: number;
  // Absent on documents written before recommendations: read as an incident.
  category?: InsightCategory;
  reason?: string;
  params?: Record<string, string>;
  triage?: InsightTriage;
}

export interface LastRun {
  status: 'queued' | 'running' | 'done' | 'failed';
  trigger: 'manual' | 'incident' | 'recovery';
  runId: string;
  queuedAt?: string;
  startedAt: string;
  finishedAt: string;
  error: string;
  model: string;
  steps: number;
  toolCalls: number;
  truncated: boolean;
}

export interface AppInsights {
  insights: Insight[];
  lastRun: LastRun;
  version: number;
  lastReviewAt?: string;
}

export type InsightRowState = InsightStatus | 'stale';

export type InsightTriageFilter = 'untriaged' | 'acknowledged' | 'dismissed' | 'all';

// Category groups by kind: incident kinds, or recommendation families.
export type InsightGroupBy = 'none' | 'app' | 'namespace' | 'category';

export type InsightsTab = 'incidents' | 'recommendations';

// One card of the cluster-wide list, as the discovery index serves it.
export interface InsightRow {
  id: string;
  // The app's address (`<namespace>/<app>`); the card's workload may run in another namespace.
  namespace: string;
  workloadNamespace?: string;
  app: string;
  category?: InsightCategory | '';
  kind: InsightKind;
  reason?: string;
  subject: string;
  title: string;
  severity: InsightSeverity;
  confidence: InsightConfidence;
  status: InsightStatus;
  stale: boolean;
  triage?: InsightTriage;
  firstSeenAt: string;
  lastSeenAt: string;
  resolvedAt?: string;
  environments?: string[];
}

export interface InsightCounts {
  bySeverity: Partial<Record<InsightSeverity, number>>;
  byCategory: Partial<Record<InsightCategory, number>>;
  byState: Partial<Record<InsightRowState, number>>;
  // bySeverity without the severity filter; absent from older servers.
  severityFacet?: Partial<Record<InsightSeverity, number>>;
}

// Totals cover the whole filtered set, so a group split across pages reads the same on each.
export interface InsightGroup {
  key: string;
  total: number;
  bySeverity: Partial<Record<InsightSeverity, number>>;
  // Distinct workload namespaces of the rows; an app's workloads can span several.
  namespaces: string[];
}

// A group header row of the grouped table.
export interface InsightGroupItem {
  groupKey: string;
  group: InsightGroup;
  collapsed: boolean;
}

export type InsightListItem = InsightRow | InsightGroupItem;

export interface ClusterInsightsPage {
  items: InsightRow[];
  total: number;
  page: number;
  pageSize: number;
  counts: InsightCounts;
  indexedAt: string;
}

// Empty filters are omitted so the server applies its defaults (active, not dismissed).
export interface ClusterInsightsQuery {
  category?: InsightCategory;
  kind?: string[];
  severity?: string[];
  state?: string[];
  triage?: InsightTriageFilter;
  namespace?: string[];
  environment?: string;
  q?: string;
  id?: string[];
  // `<namespace>/<name>` members.
  app?: string[];
  // Omitted: the whole filtered set, read page by page.
  page?: number;
  pageSize?: number;
}

export interface AnalyzerRuntime {
  state: 'absent' | 'unreachable' | 'model_missing' | 'pulling' | 'unsupported' | 'ready';
  model: string;
  reason: string;
  mode: 'fast' | 'deep';
  autoPull: boolean;
  // The analyzer's on/off switch; absent from analyzers that predate it.
  enabled?: boolean;
  pull?: { model: string; status: string; completed: number; total: number };
}

export interface AnalyzeResponse {
  runId: string;
  status: string;
}

export interface ValidateModelResponse {
  ok: boolean;
  model: string;
  license: string;
  warning?: string;
  reason?: string;
  capabilities: string[];
}

interface AppEventData {
  app: string;
  version: number;
}

export type InsightEvent =
  | {
      name: 'analysis.queued';
      data: AppEventData & { runId: string; trigger: LastRun['trigger'] };
    }
  | { name: 'analysis.started'; data: AppEventData & { runId: string; model: string } }
  | { name: 'analysis.failed'; data: AppEventData & { runId: string; error: string } }
  | {
      name: 'analysis.finished';
      data: AppEventData & {
        runId: string;
        truncated: boolean;
        created: number;
        updated: number;
        resolved: number;
      };
    }
  | {
      name: 'insight.created' | 'insight.updated' | 'insight.resolved';
      data: AppEventData & { id: string; status: InsightStatus };
    }
  | {
      name: 'runtime.changed';
      data: Pick<AnalyzerRuntime, 'state' | 'model' | 'reason' | 'mode' | 'autoPull' | 'enabled'>;
    }
  | {
      name: 'runtime.pull';
      data: Pick<NonNullable<AnalyzerRuntime['pull']>, 'model' | 'completed' | 'total'>;
    }
  | { name: 'review.finished'; data: AppEventData }
  | { name: 'resync'; data: Record<string, never> };
