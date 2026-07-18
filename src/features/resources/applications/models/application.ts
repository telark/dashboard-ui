export interface ApplicationHealth {
  status: string; // healthy | degraded | down | unknown
  reason?: string | null;
  readyReplicas: number;
  totalReplicas: number;
}

export interface ApplicationNamespaceEntry {
  name: string;
  resourceCount: number;
}

export interface ApplicationNamespaces {
  total: number;
  items: ApplicationNamespaceEntry[];
}

export interface ApplicationManaged {
  by: string;
  chart?: string | null;
  version?: string | null;
}

export interface ApplicationResourceSummary {
  Deployment: number;
  StatefulSet: number;
  DaemonSet: number;
  Job: number;
  CronJob: number;
  Service: number;
  NetworkPolicy: number;
  Ingress: number;
  ServiceAccount: number;
  ConfigMap: number;
  Secret: number;
  PersistentVolumeClaim: number;
  HorizontalPodAutoscaler: number;
  VerticalPodAutoscaler: number;
}

export interface ApplicationResourceRef {
  namespace: string;
  kind: string;
  name: string;
}

export interface ApplicationRelatedApp {
  name: string;
  reason: string;
}

export interface ApplicationInsightRisk {
  severity: string; // high | medium | low
  message: string;
}

export interface ApplicationInsightSuggestion {
  priority: string; // high | medium | low
  message: string;
}

export interface ApplicationResourceEfficiency {
  status: string; // over | under | balanced | unknown
  note: string;
}

export interface ApplicationCriticality {
  level: string; // critical | high | medium | low
  reason: string;
}

export interface ApplicationInsights {
  enriched: boolean;
  enrichedAt?: string | null;
  confidence?: string | null;
  summary?: string | null;
  techStack: string[];
  role?: string | null;
  dependencies: string[];
  category?: string | null;
  risks: ApplicationInsightRisk[];
  suggestions: ApplicationInsightSuggestion[];
  resourceEfficiency: ApplicationResourceEfficiency;
  criticality: ApplicationCriticality;
  tags: string[];
  relatedApps: ApplicationRelatedApp[];
  promptVersion?: string | null;
}

export interface ApplicationChange {
  field: string;
  description: string;
  changeType: string; // added | removed | updated
  oldValue?: string | null;
  newValue?: string | null;
}

export interface ApplicationChangeLogEntry {
  generation: number;
  detectedAt: string;
  changeClass: string;
  severity: string;
  changedBy?: string | null;
  fingerprint: string;
  isIncident: boolean;
  isRecovery: boolean;
  changes: ApplicationChange[];
  isLastOne?: boolean | null;
}

export interface ApplicationHistory {
  generation: number;
  hasDrift: boolean;
  lastModifiedBy?: string | null;
  lastModifiedAt?: string | null;
  changeLog: ApplicationChangeLogEntry[];
}

export interface ApplicationSnapshot {
  generation: number;
  changeClass: string;
  severity: string;
  takenAt: string;
  id: string;
  namespace: string;
  path: string;
}

export interface ApplicationRollbackEntry {
  id: string;
  targetSnapshotId: string;
  targetGeneration: number;
  targetPath: string;
  triggeredBy: string;
  triggeredAt: string;
  completedAt?: string | null;
  status: string;
  error?: string;
  restoredGeneration?: number | null;
  namespace: string;
}

export interface ApplicationSnapshotSummary {
  id: string;
  scope: string;
  namespace: string;
  generation: number;
  size: string;
  consumed: string;
  /** Storage path; unique per snapshot when id is shared (e.g. application name). */
  path?: string;
  severity?: string;
  /** ISO timestamp from application details or exporter when available. */
  takenAt?: string;
  pvcTotal?: string;
  pvcAvailable?: string;
  /** The CR still references this snapshot but the exporter has no file for it. */
  unavailable?: boolean;
}

export interface SnapshotManifestState {
  loading: boolean;
  error: string | null;
  data: unknown | null;
}

export interface ApplicationMetricsDerived {
  totalChanges: number;
  changesByClass: Record<string, number>;
  changesBySeverity: Record<string, number>;
  totalIncidents: number;
  totalRecoveries: number;
  snapshotCount: number;
  firstChangeDetectedAt?: string | null;
  lastChangeDetectedAt?: string | null;
  changeVelocityPerDay: number;
  uniqueFingerprints: number;
}

export interface ApplicationMetricsResourceValues {
  cpu: string;
  memory: string;
}

export interface ApplicationMetricsBaseline {
  fingerprint: string;
  replicas: number;
  requests: ApplicationMetricsResourceValues;
  limits: ApplicationMetricsResourceValues;
}

export interface ApplicationWorkloadUsage {
  resourceName: string;
  resourceKind: string;
  namespace: string;
  baseline: ApplicationMetricsBaseline;
  usage: ApplicationWorkloadUsageMetrics;
}

export interface ApplicationMetrics {
  derived: ApplicationMetricsDerived;
  workloads: ApplicationWorkloadUsage[];
}

export interface ApplicationWorkloadUsageMetrics {
  qos: string;
  resources: ApplicationWorkloadUsageResource;
  available: boolean;
  timestamp: string;
}

export interface ApplicationWorkloadUsageResource {
  totalCpu: string;
  totalMemory: string;
  usagePerInstance: ApplicationWorkloadUsagePerInstance[];
}

export interface ApplicationWorkloadUsagePerInstance {
  name: string;
  containers: ApplicationWorkloadContainerUsage[];
  totalCpu: string;
  totalMemory: string;
}

export interface ApplicationWorkloadContainerUsage {
  name: string;
  cpu: string;
  memory: string;
}

export interface ApplicationUpdatePayload {
  displayName?: string;
  description?: string;
}

export interface ApplicationRollbackTriggerPayload {
  snapshotGeneration: number;
  triggeredBy: string;
}

export type ForceSyncPhase = 'queued' | 'running' | 'completed' | 'failed';

export interface ApplicationLastForceSync {
  jobId?: string;
  phase?: ForceSyncPhase;
  requestedAt?: string;
  startedAt?: string;
  completedAt?: string;
  requestedBy?: string;
  reason?: string;
  error?: string;
}

export interface Application {
  name: string;
  displayName: string;
  description?: string | null;
  health: ApplicationHealth;
  resourceCount: number;
  namespaces: ApplicationNamespaces;
  managed: ApplicationManaged;
  createdAt: string;
  lastUpdated: string;
  resourceSummary: ApplicationResourceSummary;
  resources: ApplicationResourceRef[];
  insights: ApplicationInsights;
  images: string[];
  ports: number[];
  envVarKeys: string[];
  snapshots: ApplicationSnapshot[];
  rollbacks?: ApplicationRollbackEntry[];
  metrics: ApplicationMetrics;
  crStatus?: string | null;
  history: ApplicationHistory;
  lastForceSync?: ApplicationLastForceSync;
}

export type SyncStatusValue = 'syncing' | 'success' | 'failed';

export interface ApplicationsLastErrorMap {
  [name: string]: string;
}
export type ApplicationLayoutMode = 'single' | 'double';
export type ApplicationHealthQuickFilter = 'all' | 'healthy' | 'degraded' | 'unhealthy';

export interface ApplicationsState {
  applications: Application[];
  details: Application | null;
  loading: boolean;
  error: string | null;
  snapshots: ApplicationSnapshotSummary[];
  snapshotsLoading: boolean;
  snapshotsError: string | null;
  snapshotManifests: Record<string, SnapshotManifestState>;
  syncing: Record<string, boolean>;
  syncStatus: Record<string, SyncStatusValue>;
  syncCompletedAt: Record<string, string>;
  syncLastError: Record<string, string>;
  searchValue: string;
  currentPage: number;
  appliedFilters: Record<string, unknown>;
  layoutMode: ApplicationLayoutMode;
  bulkMode: boolean;
  selectedNames: string[];
  healthQuickFilter: ApplicationHealthQuickFilter;
}
