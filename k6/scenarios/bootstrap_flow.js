// S1 — bootstrap_flow
// Purpose: simulate first 2s after a logged-in user loads the dashboard
// APIs touched: auth/config, auth/permissions, exporter globalconfig, apps list, notifications, plans list
// Services: auth, exporter
// Why: highest-frequency real-world flow — catches bootstrap-time regressions

import { path, cfg, requireToken, requireUserId } from '../lib/config.js';
import { get, parseJson, resetStepCounter } from '../lib/http.js';
import { assertShape } from '../lib/assert.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: pickThresholds([
    METRICS.AUTH_CONFIG,
    METRICS.AUTH_PERMISSIONS,
    METRICS.GLOBALCONFIG_GET,
    METRICS.CACHED_LIST,
    METRICS.NOTIF_LIST,
  ]),
};

export const setup = () => {
  requireToken();
  requireUserId();
};

export default function () {
  resetStepCounter();

  get(path.auth('auth/config'), {
    name: 'auth.config',
    metric: METRICS.AUTH_CONFIG,
  });

  const permRes = get(path.auth('auth/permissions'), {
    name: 'auth.permissions',
    metric: METRICS.AUTH_PERMISSIONS,
  });
  assertShape(permRes, 'auth.permissions', (b) => b !== null);

  const gcRes = get(path.exporter('resources/globalconfig/get'), {
    name: 'globalconfig.get',
    metric: METRICS.GLOBALCONFIG_GET,
  });
  assertShape(gcRes, 'globalconfig.get', (b) => typeof b === 'object');

  const appsRes = get(path.exporter('resources/applications/get'), {
    name: 'applications.list',
    metric: METRICS.CACHED_LIST,
  });
  assertShape(appsRes, 'applications.list', (b) => b !== null);

  const notifRes = get(
    `${path.exporter('notifications/get')}?userId=${encodeURIComponent(cfg.userId)}&limit=20`,
    {
      name: 'notifications.list',
      metric: METRICS.NOTIF_LIST,
    },
  );
  assertShape(notifRes, 'notifications.list', (b) => b !== null);

  const plansRes = get(path.exporter('plans/protection/get'), {
    name: 'plans.list',
    metric: METRICS.CACHED_LIST,
  });
  parseJson(plansRes);
}

export const handleSummary = buildSummary('bootstrap_flow');
