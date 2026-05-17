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

export const cfg = {
  baseUrl: env('BASE_URL', 'http://localhost:3000').replace(/\/+$/, ''),
  sessionToken: env('SESSION_TOKEN', ''),
  userId: env('USER_ID', ''),
  testEmail: env('TEST_EMAIL', 'k6-test@example.com'),
  testAppName: env('TEST_APP_NAME', ''),
  testNamespace: env('TEST_NAMESPACE', 'k6-test'),
  testPlanTemplateId: env('TEST_PLAN_TEMPLATE_ID', ''),
  forceSyncPollTimeoutSec: intEnv('FORCE_SYNC_POLL_TIMEOUT_SEC', 90),
  planStatusPollTimeoutSec: intEnv('PLAN_STATUS_POLL_TIMEOUT_SEC', 60),
  outputDir: env('OUTPUT_DIR', './results'),
  runId: env('RUN_ID', String(Date.now())),
};

export const path = {
  exporter: (p) => `${cfg.baseUrl}/api/exporter/api/v1/${p.replace(/^\//, '')}`,
  discovery: (p) => `${cfg.baseUrl}/api/discovery/api/v1/${p.replace(/^\//, '')}`,
  auth: (p) => `${cfg.baseUrl}/api/auth/api/v1/${p.replace(/^\//, '')}`,
  enrichment: (p) => `${cfg.baseUrl}/api/enrichment/${p.replace(/^\//, '')}`,
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
