import type {
  AnalyzerRuntime,
  InsightCategory,
  InsightConfidence,
  InsightEvent,
  InsightGroupBy,
  InsightKind,
  InsightRowState,
  InsightSeverity,
  InsightsTab,
  InsightTriageFilter,
  RecommendationKind,
  LastRun,
} from '../models';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../constants';
import { INSIGHTS_ERROR_MESSAGES } from './errors';
import { INSIGHTS_UI } from './texts';

const T = INSIGHTS_UI;

export const INSIGHTS_STALE_MS = 24 * 60 * 60 * 1000;
export const RUNNING_TIMEOUT_MS = 540_000;
// Matches the worker's 30-min stale drop of a queued job.
export const QUEUED_TIMEOUT_MS = 1_800_000;
export const SSE_BACKOFF_MS = { min: 1000, max: 30000 } as const;

export const INSIGHT_EVENTS = {
  ANALYSIS_QUEUED: 'analysis.queued',
  ANALYSIS_STARTED: 'analysis.started',
  ANALYSIS_FAILED: 'analysis.failed',
  ANALYSIS_FINISHED: 'analysis.finished',
  INSIGHT_CREATED: 'insight.created',
  INSIGHT_UPDATED: 'insight.updated',
  INSIGHT_RESOLVED: 'insight.resolved',
  RUNTIME_CHANGED: 'runtime.changed',
  RUNTIME_PULL: 'runtime.pull',
  REVIEW_FINISHED: 'review.finished',
  RESYNC: 'resync',
} as const satisfies Record<string, InsightEvent['name']>;

export const RUN_STATUS_LABELS: Record<LastRun['status'], string> = {
  queued: T.RUN_STATUS.QUEUED,
  running: T.RUN_STATUS.RUNNING,
  done: T.RUN_STATUS.DONE,
  failed: T.RUN_STATUS.FAILED,
};

export const RUN_TRIGGER_LABELS: Record<LastRun['trigger'], string> = {
  manual: T.TRIGGER.MANUAL,
  incident: T.TRIGGER.INCIDENT,
  recovery: T.TRIGGER.RECOVERY,
};

export const INSIGHT_SEVERITY_LABELS: Record<InsightSeverity, string> = {
  info: T.SEVERITY.INFO,
  warning: T.SEVERITY.WARNING,
  critical: T.SEVERITY.CRITICAL,
};

export const SEVERITY_COLORS: Record<InsightSeverity, string> = {
  critical: DEFAULT_COLORS.ERROR,
  warning: DEFAULT_COLORS.WARNING,
  info: DEFAULT_COLORS.TEXT_MUTED,
};

export const SEVERITY_RANK: Record<InsightSeverity, number> = { critical: 2, warning: 1, info: 0 };

export const INSIGHT_CONFIDENCE_LABELS: Record<InsightConfidence, string> = {
  low: T.CONFIDENCE_LEVEL.LOW,
  medium: T.CONFIDENCE_LEVEL.MEDIUM,
  high: T.CONFIDENCE_LEVEL.HIGH,
};

export const INSIGHT_KIND_LABELS: Record<InsightKind, string> = {
  crashloop: T.KIND.CRASHLOOP,
  oom: T.KIND.OOM,
  image_pull: T.KIND.IMAGE_PULL,
  probe_failure: T.KIND.PROBE_FAILURE,
  scheduling: T.KIND.SCHEDULING,
  rollout_stuck: T.KIND.ROLLOUT_STUCK,
  config_change_regression: T.KIND.CONFIG_CHANGE_REGRESSION,
  resource_pressure: T.KIND.RESOURCE_PRESSURE,
  other: T.KIND.OTHER,
  reliability: T.KIND.RELIABILITY,
  resources: T.KIND.RESOURCES,
  scaling: T.KIND.SCALING,
  security: T.KIND.SECURITY,
  images: T.KIND.IMAGES,
  config: T.KIND.CONFIG,
  networking: T.KIND.NETWORKING,
  change_risk: T.KIND.CHANGE_RISK,
  protection: T.KIND.PROTECTION,
  consistency: T.KIND.CONSISTENCY,
};

// Must stay equal to the analyzer service's reason codes (its constants.py).
export const INSIGHT_REASONS = [
  'image_pull.not_found',
  'image_pull.denied_or_missing',
  'image_pull.unauthorized',
  'image_pull.registry_unreachable',
  'image_pull.invalid_name',
  'image_pull.rate_limited',
  'image_pull.other',
  'crashloop.probe_kill',
  'crashloop.init_failure',
  'crashloop.start_error',
  'crashloop.exit_0',
  'crashloop.exit_1',
  'crashloop.exit_126',
  'crashloop.exit_127',
  'crashloop.exit_137',
  'crashloop.exit_139',
  'crashloop.exit_143',
  'crashloop.exit_other',
  'oom.limit',
  'oom.node',
  'probe_failure.readiness',
  'probe_failure.liveness',
  'probe_failure.startup',
  'scheduling.insufficient_cpu',
  'scheduling.insufficient_memory',
  'scheduling.taints',
  'scheduling.node_affinity',
  'scheduling.pod_anti_affinity',
  'scheduling.topology_spread',
  'scheduling.volume',
  'scheduling.too_many_pods',
  'scheduling.host_ports',
  'scheduling.other',
  'resource_pressure.evicted_memory',
  'resource_pressure.evicted_ephemeral',
  'resource_pressure.evicted_disk',
  'resource_pressure.evicted_pid',
  'resource_pressure.preempted',
  'resource_pressure.other',
  'rollout_stuck.progress_deadline',
  'rollout_stuck.quota_exceeded',
  'rollout_stuck.admission_denied',
  'rollout_stuck.incomplete',
  'config_change_regression.image',
  'config_change_regression.config',
  'config_change_regression.resources',
  'config_change_regression.other',
  'other.container_config_error',
  'other.create_container_error',
  'other.volume_mount',
  'other.degraded',
  'other.warnings',
  'reliability.single_replica',
  'reliability.no_pdb',
  'reliability.pdb_blocks_eviction',
  'reliability.no_readiness_probe',
  'reliability.no_liveness_probe',
  'reliability.liveness_same_as_readiness',
  'reliability.no_startup_probe',
  'reliability.replicas_same_node',
  'reliability.rollout_all_at_once',
  'reliability.short_grace_period',
  'reliability.revision_history_zero',
  'reliability.deployment_paused',
  'reliability.liveness_single_failure',
  'reliability.probe_port_undeclared',
  'reliability.pdb_blocks_at_min_scale',
  'resources.no_requests',
  'resources.no_memory_limit',
  'resources.limits_without_requests',
  'resources.memory_near_limit',
  'resources.cpu_near_limit',
  'resources.overprovisioned',
  'resources.underprovisioned',
  'resources.oom_history',
  'scaling.hpa_min_equals_max',
  'scaling.hpa_missing_requests',
  'scaling.hpa_at_max',
  'scaling.no_hpa_sustained_load',
  'scaling.hpa_inactive',
  'scaling.hpa_scale_down_disabled',
  'security.privileged',
  'security.privilege_escalation_allowed',
  'security.runs_as_root',
  'security.writable_root_fs',
  'security.added_capabilities',
  'security.host_namespaces',
  'security.host_path',
  'security.default_service_account',
  'security.token_automount',
  'security.secrets_in_env',
  'security.plaintext_secret_env',
  'security.seccomp_unset',
  'security.capabilities_not_dropped',
  'security.host_port',
  'security.run_as_root_group',
  'security.proc_mount_unmasked',
  'images.mutable_tag',
  'images.pull_policy_mismatch',
  'images.pull_policy_never',
  'images.digest_not_pinned_production',
  'config.duplicate_env',
  'config.subpath_no_reload',
  'networking.service_selector_mismatch',
  'networking.service_port_mismatch',
  'networking.no_network_policy',
  'networking.network_policy_allows_all',
  'change_risk.high_velocity',
  'change_risk.frequent_rollbacks',
  'protection.production_uncovered',
  'protection.production_audit_only',
  'consistency.image_skew',
] as const;

export type InsightReason = (typeof INSIGHT_REASONS)[number];

const INSIGHT_REASON_SET: ReadonlySet<string> = new Set(INSIGHT_REASONS);

export const isInsightReason = (reason: string | undefined): reason is InsightReason =>
  reason !== undefined && INSIGHT_REASON_SET.has(reason);

// Labels of the Details table; an unknown key shows as itself.
export const INSIGHT_PARAM_LABELS: Record<string, string> = {
  app: 'Application',
  namespace: 'Namespace',
  namespaces: 'Namespaces',
  workload: 'Workload',
  kind: 'Kind',
  pod: 'Pod',
  node: 'Node',
  container: 'Container',
  containers: 'Containers',
  image: 'Image',
  images: 'Images',
  registry: 'Registry',
  pullPolicy: 'Pull policy',
  exitCode: 'Exit code',
  lastReason: 'Last termination reason',
  restarts: 'Restarts',
  probe: 'Probe',
  failure: 'Probe failure',
  failureText: 'Failure',
  port: 'Port',
  ports: 'Ports',
  targetPort: 'Target port',
  status: 'HTTP status',
  timeout: 'Timeout (s)',
  count: 'Failures',
  ready: 'Ready replicas',
  desired: 'Desired replicas',
  updated: 'Updated replicas',
  pending: 'Pending pods',
  replicas: 'Replicas',
  limit: 'Limit',
  request: 'Request',
  usage: 'Usage (p95)',
  suggested: 'Suggested',
  resource: 'Resource',
  samples: 'Samples',
  qos: 'QoS class',
  lastOom: 'Last out-of-memory kill',
  hpa: 'Autoscaler',
  hpaMax: 'Autoscaler maximum',
  condition: 'Autoscaler condition',
  pdb: 'Disruption budget',
  minAvailable: 'Min available',
  maxUnavailable: 'Max unavailable',
  service: 'Service',
  selector: 'Selector',
  policy: 'Network policy',
  strategy: 'Strategy',
  grace: 'Termination grace period (s)',
  capabilities: 'Capabilities',
  envVars: 'Environment variables',
  volumes: 'Volumes',
  missing: 'Missing',
  mode: 'Mode',
  plans: 'Protection plans',
  pattern: 'Production pattern',
  rollbacks: 'Rollbacks',
  velocity: 'Changes per day',
  generation: 'Change generation',
  change: 'Change',
  warnings: 'Warnings',
  reasons: 'Reasons',
  message: 'Message',
};

export const RUNTIME_BANNER_TEXT: Record<Exclude<AnalyzerRuntime['state'], 'ready'>, string> = {
  absent: T.RUNTIME_BANNER_ABSENT,
  unreachable: T.RUNTIME_BANNER_UNREACHABLE,
  model_missing: T.RUNTIME_BANNER_MODEL_MISSING,
  pulling: T.RUNTIME_BANNER_PULLING,
  unsupported: T.RUNTIME_BANNER_UNSUPPORTED,
};

export const INSIGHT_ERROR_CODES = {
  JOB_EXPIRED: 'job_expired',
  MODEL_NOT_INSTALLED: 'model_not_installed',
} as const;

export const INSIGHT_ERROR_MESSAGES: Record<string, string> = {
  analyzer_disabled: T.ERRORS.ANALYZER_DISABLED,
  runtime_absent: T.RUNTIME_BANNER_ABSENT,
  runtime_unreachable: T.RUNTIME_BANNER_UNREACHABLE,
  runtime_model_missing: T.RUNTIME_BANNER_MODEL_MISSING,
  runtime_pulling: T.ERRORS.RUNTIME_PULLING,
  runtime_unsupported: T.RUNTIME_BANNER_UNSUPPORTED,
  [INSIGHT_ERROR_CODES.MODEL_NOT_INSTALLED]: T.RUNTIME_BANNER_MODEL_MISSING,
  model_unsupported: T.RUNTIME_BANNER_UNSUPPORTED,
  cooldown_active: T.ERRORS.COOLDOWN_ACTIVE,
  queue_full: T.ERRORS.QUEUE_FULL,
  model_timeout: T.ERRORS.MODEL_TIMEOUT,
  context_overflow: T.ERRORS.CONTEXT_OVERFLOW,
  invalid_tool_calls: T.ERRORS.INVALID_TOOL_CALLS,
  invalid_output: T.ERRORS.INVALID_OUTPUT,
  busy: T.ERRORS.BUSY,
  app_not_found: T.ERRORS.APP_NOT_FOUND,
  storage_unavailable: T.ERRORS.STORAGE_UNAVAILABLE,
  [INSIGHT_ERROR_CODES.JOB_EXPIRED]: T.ERRORS.JOB_EXPIRED,
  run_in_progress: T.ERRORS.RUN_IN_PROGRESS,
  job_dropped: T.ERRORS.JOB_DROPPED,
  internal_error: T.ERRORS.INTERNAL_ERROR,
  insight_not_found: T.ERRORS.INSIGHT_NOT_FOUND,
  invalid_triage: T.ERRORS.INVALID_TRIAGE,
  invalid_request: T.ERRORS.INVALID_REQUEST,
  invalid_app: T.ERRORS.INVALID_APP,
  auto_pull_disabled: T.ERRORS.AUTO_PULL_DISABLED,
};

// An unknown code must never render a blank label.
const INSIGHT_ERROR_FALLBACK = INSIGHTS_ERROR_MESSAGES.CLIENT.ANALYZE_FAILED;

export const insightErrorMessage = (code?: string): string =>
  (code && INSIGHT_ERROR_MESSAGES[code]) || INSIGHT_ERROR_FALLBACK;

export const triageErrorMessage = (code?: string): string =>
  (code && INSIGHT_ERROR_MESSAGES[code]) || T.ERRORS.TRIAGE_FAILED;

const P = INSIGHTS_UI.PAGE;

export const CLUSTER_INSIGHTS = {
  POLL_MS: 15_000,
  // How long a triage stays applied locally while the list index catches up.
  TRIAGE_PENDING_MS: 45_000,
  // After this tab's own triage, list reads ask discovery to catch up first. Must exceed the
  // chart's INSIGHTS_INDEX_REFRESH_SEC (15 s), after which the index has the write anyway.
  FRESH_READ_MS: 60_000,
  // Per-tab: a reload inside FRESH_READ_MS still reads fresh.
  WROTE_AT_STORAGE_KEY: 'insights.wroteAt',
  // The discovery index answers 503 + Retry-After: 5 until its first load.
  NOT_READY_RETRY_MS: 5_000,
  SEARCH_DEBOUNCE_MS: 300,
  // One chip or status line, reserved before its data arrives.
  LINE_MIN_HEIGHT_PX: 22,
  PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [25, 50, 100],
  // The list endpoint's largest page: the table reads its whole filtered set in these.
  MAX_LIST_PAGE_SIZE: 100,
  // The table reads at most MAX_LIST_PAGES × MAX_LIST_PAGE_SIZE rows, LIST_READ_CONCURRENCY at a time.
  MAX_LIST_PAGES: 20,
  LIST_READ_CONCURRENCY: 4,
  // Measured 2026-09-25: bulk selection, actions and count ≈310, the right cluster 517 with the
  // pills folded (787 inline); the pills fold first.
  TOOLBAR_COMPACT_WIDTH: { DEFAULT: 760, BULK: 900, QUICK_FILTER: 1240 },
  // ?app= adds its filter chip (≈170 for a typical name) and the setup-review note (≈220).
  TOOLBAR_COMPACT_WIDTH_APP: { DEFAULT: 1000, BULK: 1240, QUICK_FILTER: 1500 },
  TITLE_MIN_PX: 200,
  COLUMN_WIDTHS: {
    SEVERITY: 110,
    TITLE: 300,
    APPLICATION: 150,
    NAMESPACE: 140,
    KIND: 160,
    STATE: 100,
    TRIAGE: 120,
    ENVIRONMENT: 150,
    LAST_SEEN: 140,
  },
  CHIP_FONT: 12,
  // /insights?tab=recommendations; incidents is the default and carries no param.
  TAB_PARAM: 'tab',
  // /insights?app=<namespace>/<name> filters the list to that application.
  APP_PARAM: 'app',
  // /insights?insight=<id> opens that insight's details panel.
  INSIGHT_PARAM: 'insight',
  PANEL_WIDTH: 560,
  PANEL_WIDTH_EXPANDED: 900,
  // Per-viewer convenience only: the remembered Group by.
  GROUP_BY_STORAGE_KEY: 'insights.groupBy',
  ANALYZER_SETTINGS_ROUTE: `${APP_ROUTES.SETTINGS}/aiInsights`,
  FILTER_KEYS: {
    KIND: 'kind',
    SEVERITY: 'severity',
    STATE: 'state',
    TRIAGE: 'triage',
    NAMESPACE: 'namespace',
    ENVIRONMENT: 'environment',
  },
} as const;

export const INSIGHT_ROW_STATE_LABELS: Record<InsightRowState, string> = {
  open: P.STATE.OPEN,
  updated: P.STATE.UPDATED,
  resolved: P.STATE.RESOLVED,
  stale: P.STATE.STALE,
};

export const INSIGHT_TRIAGE_FILTER_LABELS: Record<InsightTriageFilter, string> = {
  untriaged: P.TRIAGE.UNTRIAGED,
  acknowledged: P.TRIAGE.ACKNOWLEDGED,
  dismissed: P.TRIAGE.DISMISSED,
  all: P.TRIAGE.ALL,
};

export const INSIGHT_GROUP_BY_LABELS: Record<InsightGroupBy, string> = {
  none: P.GROUP.NONE,
  app: P.GROUP.APP,
  namespace: P.GROUP.NAMESPACE,
  category: P.GROUP.CATEGORY,
};

export const ALL_INSIGHT_STATES: InsightRowState[] = ['open', 'updated', 'stale', 'resolved'];

export const INSIGHTS_TAB_CATEGORY: Record<InsightsTab, InsightCategory> = {
  incidents: 'incident',
  recommendations: 'recommendation',
};

export const INSIGHTS_TAB_LABELS: Record<InsightsTab, string> = {
  incidents: P.TABS.INCIDENTS,
  recommendations: P.TABS.RECOMMENDATIONS,
};

export const RECOMMENDATION_KINDS: RecommendationKind[] = [
  'reliability',
  'resources',
  'scaling',
  'security',
  'images',
  'config',
  'networking',
  'change_risk',
  'protection',
  'consistency',
];

export const INCIDENT_KINDS = (Object.keys(INSIGHT_KIND_LABELS) as InsightKind[]).filter(
  (kind) => !(RECOMMENDATION_KINDS as InsightKind[]).includes(kind),
);
