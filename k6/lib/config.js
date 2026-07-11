const env = (k, d) => {
  const v = __ENV[k];
  return v === undefined || v === '' ? d : v;
};

const intEnv = (k, d) => {
  const v = env(k, null);
  if (v === null) return d;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const stripTrailingSlash = (s) => s.replace(/\/+$/, '');

const DEFAULTS = {
  exporter: 'http://plsyro-exporter-service.plsyro.svc.cluster.local:8080',
  discovery: 'http://plsyro-discovery-service.plsyro.svc.cluster.local:8080',
  auth: 'http://plsyro-auth-service.plsyro.svc.cluster.local:8080',
  enrichment: 'http://plsyro-enrichment-service.plsyro.svc.cluster.local:8080',
};

export const cfg = {
  exporterUrl: stripTrailingSlash(env('EXPORTER_BASE_URL', DEFAULTS.exporter)),
  discoveryUrl: stripTrailingSlash(env('DISCOVERY_BASE_URL', DEFAULTS.discovery)),
  authUrl: stripTrailingSlash(env('AUTH_BASE_URL', DEFAULTS.auth)),
  enrichmentUrl: stripTrailingSlash(env('ENRICHMENT_BASE_URL', DEFAULTS.enrichment)),
  sessionToken: env('SESSION_TOKEN', ''),
  userId: env('USER_ID', ''),
  testEmail: env('TEST_EMAIL', 'k6-test@example.com'),
  testAppName: env('TEST_APP_NAME', ''),
  testNamespace: env('TEST_NAMESPACE', 'k6-test'),
  testPlanTemplateId: env('TEST_PLAN_TEMPLATE_ID', ''),
  forceSyncPollTimeoutSec: intEnv('FORCE_SYNC_POLL_TIMEOUT_SEC', 90),
  planStatusPollTimeoutSec: intEnv('PLAN_STATUS_POLL_TIMEOUT_SEC', 60),
  resultsDir: stripTrailingSlash(env('RESULTS_DIR', './results')),
  runTag: env('RUN_TAG', String(Date.now())),
};

const buildPath = (base, p) => `${base}/api/v1/${p.replace(/^\//, '')}`;

export const path = {
  exporter: (p) => buildPath(cfg.exporterUrl, p),
  discovery: (p) => buildPath(cfg.discoveryUrl, p),
  auth: (p) => buildPath(cfg.authUrl, p),
  enrichment: (p) => `${cfg.enrichmentUrl}/${p.replace(/^\//, '')}`,
};

export const requireToken = () => {
  if (!cfg.sessionToken) {
    throw new Error('SESSION_TOKEN env var is required for this scenario');
  }
};

export const requireUserId = () => {
  if (!cfg.userId) {
    throw new Error('USER_ID env var is required for this scenario');
  }
};
