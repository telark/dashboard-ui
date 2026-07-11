import { Trend, Counter } from 'k6/metrics';

const trends = {};
const counters = {};

export const trend = (name) => {
  if (!trends[name]) trends[name] = new Trend(name, true);
  return trends[name];
};

export const counter = (name) => {
  if (!counters[name]) counters[name] = new Counter(name);
  return counters[name];
};

export const METRICS = {
  AUTH_CONFIG: 'auth_config_duration',
  AUTH_PERMISSIONS: 'auth_permissions_duration',
  AUTH_LOGIN_START: 'auth_login_start_duration',
  SESSION_READ: 'session_read_duration',
  SESSION_DELETE: 'session_delete_duration',
  CACHED_LIST: 'cached_list_duration',
  CACHED_GET: 'cached_get_duration',
  RBAC_WRITE: 'rbac_write_duration',
  RBAC_CLEANUP: 'rbac_cleanup_duration',
  GLOBALCONFIG_GET: 'globalconfig_get_duration',
  GLOBALCONFIG_PATCH: 'globalconfig_patch_duration',
  NAMESPACES_LIST: 'namespaces_list_duration',
  SNAPSHOT_SUMMARY: 'snapshot_summary_duration',
  SNAPSHOT_FANOUT_TOTAL: 'snapshot_fanout_total_duration',
  SNAPSHOT_MANIFEST: 'snapshot_manifest_duration',
  FORCE_SYNC_ENQUEUE: 'force_sync_enqueue_duration',
  FORCE_SYNC_COMPLETION: 'force_sync_completion_duration',
  PLAN_TEMPLATES: 'plan_templates_duration',
  PLAN_STATUS: 'plan_status_duration',
  PLAN_VIOLATIONS: 'plan_violations_duration',
  PLAN_PREPARE: 'plan_prepare_duration',
  PLAN_MUTATE: 'plan_mutate_duration',
  NOTIF_LIST: 'notif_list_duration',
  NOTIF_MUTATE: 'notif_mutate_duration',
};

export const THRESHOLDS = {
  [METRICS.AUTH_CONFIG]: ['p(95)<300'],
  [METRICS.AUTH_PERMISSIONS]: ['p(95)<500'],
  [METRICS.AUTH_LOGIN_START]: ['p(95)<1200'],
  [METRICS.SESSION_READ]: ['p(95)<400'],
  [METRICS.SESSION_DELETE]: ['p(95)<800'],
  [METRICS.CACHED_LIST]: ['p(95)<400'],
  [METRICS.CACHED_GET]: ['p(95)<300'],
  [METRICS.RBAC_WRITE]: ['p(95)<1500'],
  [METRICS.RBAC_CLEANUP]: ['p(95)<2500'],
  [METRICS.GLOBALCONFIG_GET]: ['p(95)<250'],
  [METRICS.GLOBALCONFIG_PATCH]: ['p(95)<1200'],
  [METRICS.NAMESPACES_LIST]: ['p(95)<1500'],
  [METRICS.SNAPSHOT_SUMMARY]: ['p(95)<1500'],
  [METRICS.SNAPSHOT_FANOUT_TOTAL]: ['p(95)<5000'],
  [METRICS.SNAPSHOT_MANIFEST]: ['p(95)<2000'],
  [METRICS.FORCE_SYNC_ENQUEUE]: ['p(95)<800'],
  [METRICS.FORCE_SYNC_COMPLETION]: ['p(95)<90000'],
  [METRICS.PLAN_TEMPLATES]: ['p(95)<400'],
  [METRICS.PLAN_STATUS]: ['p(95)<800'],
  [METRICS.PLAN_VIOLATIONS]: ['p(95)<2500'],
  [METRICS.PLAN_PREPARE]: ['p(95)<3500'],
  [METRICS.PLAN_MUTATE]: ['p(95)<2500'],
  [METRICS.NOTIF_LIST]: ['p(95)<600'],
  [METRICS.NOTIF_MUTATE]: ['p(95)<800'],
};

export const pickThresholds = (metricNames) => {
  const out = {};
  for (const m of metricNames) {
    if (THRESHOLDS[m]) out[m] = THRESHOLDS[m];
  }
  return out;
};
