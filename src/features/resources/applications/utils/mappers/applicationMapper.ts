import { UTILS_TEXTS } from '../../../../../constants';
import { extractItemsFromResponse } from '../../../../../utils/helpers/api';
import type { Application } from '../../models';

const DEFAULT_HEALTH: Application['health'] = {
  status: 'unknown',
  reason: null,
  readyReplicas: 0,
  totalReplicas: 0,
};

const DEFAULT_MANAGED: Application['managed'] = {
  by: UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
  chart: null,
  version: null,
};

const DEFAULT_METRICS: Application['metrics'] = {
  derived: {
    totalChanges: 0,
    changesByClass: {},
    changesBySeverity: {},
    totalIncidents: 0,
    totalRecoveries: 0,
    snapshotCount: 0,
    firstChangeDetectedAt: null,
    lastChangeDetectedAt: null,
    changeVelocityPerDay: 0,
    uniqueFingerprints: 0,
  },
  workloads: [],
};

const DEFAULT_HISTORY: Application['history'] = {
  generation: 0,
  hasDrift: false,
  lastModifiedBy: null,
  lastModifiedAt: null,
  changeLog: [],
};

const DEFAULT_RESOURCE_SUMMARY: Application['resourceSummary'] = {
  Deployment: 0,
  StatefulSet: 0,
  DaemonSet: 0,
  Job: 0,
  CronJob: 0,
  Service: 0,
  NetworkPolicy: 0,
  Ingress: 0,
  ServiceAccount: 0,
  ConfigMap: 0,
  Secret: 0,
  PersistentVolumeClaim: 0,
  HorizontalPodAutoscaler: 0,
  VerticalPodAutoscaler: 0,
};

export const mapApplicationsData = (data: unknown): Application[] => {
  const items = extractItemsFromResponse<Application>(data);
  return items.map(mapApplicationListItem);
};

export const mapSingleApplicationData = (data: unknown): Application => {
  if (!data || typeof data !== 'object') {
    throw new Error(UTILS_TEXTS.ERRORS.MISSING_DATA);
  }
  return mapApplication(data as Application);
};

const mapApplication = (item: Application): Application => {
  return {
    ...item,
    name: item.name || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    displayName: item.displayName || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    description: item.description ?? null,
    createdAt: item.createdAt || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    lastUpdated: item.lastUpdated || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    images: Array.isArray(item.images) ? item.images : [],
    ports: Array.isArray(item.ports) ? item.ports : [],
    envVarKeys: Array.isArray(item.envVarKeys) ? item.envVarKeys : [],
    resources: Array.isArray(item.resources) ? item.resources : [],
    snapshots: Array.isArray(item.snapshots) ? item.snapshots : [],
    rollbacks: Array.isArray(item.rollbacks) ? item.rollbacks : [],
    namespaces: item.namespaces || { total: UTILS_TEXTS.DEFAULTS.ZERO, items: [] },
    resourceCount:
      typeof item.resourceCount === 'number' ? item.resourceCount : UTILS_TEXTS.DEFAULTS.ZERO,
    resourceSummary: item.resourceSummary || DEFAULT_RESOURCE_SUMMARY,
    health: item.health || DEFAULT_HEALTH,
    managed: item.managed || DEFAULT_MANAGED,
    metrics: item.metrics || DEFAULT_METRICS,
    history: item.history || DEFAULT_HISTORY,
  };
};

/**
 * List rows (ApplicationCard, GlobalView) only read metrics.derived and
 * history.hasDrift/generation/lastModifiedAt — never metrics.workloads,
 * resources, snapshots or rollbacks. Those are unbounded, detail-only arrays
 * that would otherwise sit deeply nested in every list item, bloating the
 * Redux `applications` array on every poll and slowing down
 * ImmutableStateInvariantMiddleware / redux-persist on every dispatch.
 * changeLog entries stay (the home change-activity chart plots them over time)
 * but lose their nested `changes` diffs.
 * mapSingleApplicationData (details view) keeps the full payload.
 */
const mapApplicationListItem = (item: Application): Application => {
  const mapped = mapApplication(item);
  return {
    ...mapped,
    resources: [],
    snapshots: [],
    rollbacks: [],
    metrics: { ...mapped.metrics, workloads: [] },
    history: {
      ...mapped.history,
      changeLog: mapped.history.changeLog.map((entry) => ({ ...entry, changes: [] })),
    },
  };
};
