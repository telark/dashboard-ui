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

export interface ApplicationInsights {
  enriched: boolean;
  enrichedAt?: string | null;
  confidence?: string | null;
  summary?: string | null;
  techStack: string[];
  role?: string | null;
  dependencies: string[];
  category?: string | null;
  risks: string[];
  suggestions: string[];
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

export interface ApplicationSnapshotSummary {
  id: string;
  scope: string;
  namespace: string;
  generation: number;
  size: string;
  consumed: string;
  pvcTotal?: string;
  pvcAvailable?: string;
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
  primaryNamespace?: string;
  workloadConfig?: string;
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
  metrics: ApplicationMetrics;
  crStatus?: string | null;
  history: ApplicationHistory;
}

export interface ApplicationsState {
  applications: Application[];
  details: Application | null;
  loading: boolean;
  error: string | null;
  snapshots: ApplicationSnapshotSummary[];
  snapshotsLoading: boolean;
  snapshotsError: string | null;
  snapshotManifests: Record<string, SnapshotManifestState>;
}

