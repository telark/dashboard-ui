import type {
  Application,
  ApplicationChangeLogEntry,
  ApplicationRollbackEntry,
  ApplicationSnapshot,
  ApplicationWorkloadUsage,
  DiscoveryCycleStatus,
} from '../../features/applications/models';
import { DEFAULT_RESOURCE_SUMMARY } from '../../features/applications/utils/mappers/applicationMapper';
import { createFactory } from '../factory';

const CREATED_AT = '2026-01-15T10:00:00Z';
const UPDATED_AT = '2026-02-01T10:00:00Z';
const NAMESPACE = 'payments';

export const buildApplicationSnapshot = createFactory<ApplicationSnapshot>((sequence) => ({
  generation: sequence,
  changeClass: 'config',
  severity: 'medium',
  takenAt: CREATED_AT,
  id: `snapshot-${sequence}`,
  namespace: NAMESPACE,
  path: `/snapshots/${NAMESPACE}/${sequence}.yaml`,
}));

export const buildApplicationRollback = createFactory<ApplicationRollbackEntry>((sequence) => ({
  id: `rollback-${sequence}`,
  targetSnapshotId: `snapshot-${sequence}`,
  targetGeneration: sequence,
  targetPath: `/snapshots/${NAMESPACE}/${sequence}.yaml`,
  triggeredBy: 'user-under-test',
  triggeredAt: CREATED_AT,
  completedAt: UPDATED_AT,
  status: 'success',
  namespace: NAMESPACE,
}));

export const buildChangeLogEntry = createFactory<ApplicationChangeLogEntry>((sequence) => ({
  generation: sequence,
  detectedAt: UPDATED_AT,
  changeClass: 'config',
  severity: 'medium',
  changedBy: 'sre_oncall',
  fingerprint: `fingerprint-${sequence}`,
  isIncident: false,
  isRecovery: false,
  changes: [
    {
      field: 'spec.replicas',
      description: 'replicas changed',
      changeType: 'updated',
      oldValue: '2',
      newValue: '3',
    },
  ],
}));

export const buildWorkloadUsage = createFactory<ApplicationWorkloadUsage>((sequence) => ({
  resourceName: `checkout-${sequence}`,
  resourceKind: 'Deployment',
  namespace: NAMESPACE,
  baseline: {
    fingerprint: `baseline-${sequence}`,
    replicas: 2,
    requests: { cpu: '100m', memory: '128Mi' },
    limits: { cpu: '500m', memory: '512Mi' },
  },
  usage: {
    qos: 'Burstable',
    available: true,
    timestamp: UPDATED_AT,
    resources: {
      totalCpu: '200m',
      totalMemory: '256Mi',
      usagePerInstance: [
        {
          name: `checkout-${sequence}-pod`,
          totalCpu: '100m',
          totalMemory: '128Mi',
          containers: [{ name: 'app', cpu: '100m', memory: '128Mi' }],
        },
      ],
    },
  },
}));

export const buildApplication = createFactory<Application>((sequence) => ({
  name: `checkout-${sequence}`,
  displayName: `Checkout ${sequence}`,
  description: 'Takes payments',
  health: { status: 'healthy', reason: null, readyReplicas: 2, totalReplicas: 2 },
  resourceCount: 4,
  namespaces: { total: 1, items: [{ name: NAMESPACE, resourceCount: 4 }] },
  managed: { by: 'Helm', chart: 'checkout', version: '1.2.3' },
  createdAt: CREATED_AT,
  lastUpdated: UPDATED_AT,
  resourceSummary: { ...DEFAULT_RESOURCE_SUMMARY, Deployment: 1, Service: 1 },
  resources: [
    { namespace: NAMESPACE, kind: 'Deployment', name: `checkout-${sequence}` },
    { namespace: NAMESPACE, kind: 'Service', name: `checkout-${sequence}-svc` },
  ],
  images: ['registry.example.com/checkout:1.2.3'],
  ports: [8080],
  envVarKeys: ['LOG_LEVEL'],
  snapshots: [],
  rollbacks: [],
  metrics: {
    derived: {
      totalChanges: 3,
      changesByClass: { config: 3 },
      changesBySeverity: { medium: 3 },
      totalIncidents: 0,
      totalRecoveries: 0,
      snapshotCount: 0,
      firstChangeDetectedAt: CREATED_AT,
      lastChangeDetectedAt: UPDATED_AT,
      changeVelocityPerDay: 0.5,
      uniqueFingerprints: 3,
    },
    workloads: [],
  },
  history: {
    generation: 3,
    hasDrift: false,
    lastModifiedBy: 'sre_oncall',
    lastModifiedAt: UPDATED_AT,
    changeLog: [],
  },
}));

type ApplicationPatch = Omit<Partial<Application>, 'history'> & {
  history?: Partial<Application['history']>;
  derived?: Partial<Application['metrics']['derived']>;
};

/** buildApplication with `history` and the derived metrics merged into the defaults. */
export const buildApplicationWith = ({
  history,
  derived,
  ...overrides
}: ApplicationPatch): Application => {
  const base = buildApplication(overrides);
  return {
    ...base,
    history: { ...base.history, ...history },
    metrics: { ...base.metrics, derived: { ...base.metrics.derived, ...derived } },
  };
};

export const buildDiscoveryStatus = createFactory<DiscoveryCycleStatus>(() => ({
  inProgress: false,
  remaining: 0,
  enqueued: 0,
  startedAt: CREATED_AT,
  finishedAt: UPDATED_AT,
  intervalSeconds: 60,
}));
