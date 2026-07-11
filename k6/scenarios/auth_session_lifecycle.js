// S2 — auth_session_lifecycle
// Purpose: walk "My sessions" panel using a pre-issued SESSION_TOKEN
// APIs touched: exporter session list, session details, session delete
// Services: exporter
// Why: validates the session read contract every authenticated flow depends on
// Note: by default does NOT delete the session that owns SESSION_TOKEN; set DELETE_OWN_SESSION=true to opt in

import { path, cfg, requireToken, requireUserId } from '../lib/config.js';
import { get, del, parseJson, resetStepCounter } from '../lib/http.js';
import { assertShape } from '../lib/assert.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

const DELETE_OWN_SESSION = __ENV.DELETE_OWN_SESSION === 'true';

export const options = {
  vus: 1,
  iterations: 3,
  thresholds: pickThresholds([METRICS.SESSION_READ, METRICS.SESSION_DELETE]),
};

export const setup = () => {
  requireToken();
  requireUserId();
};

export default function () {
  resetStepCounter();

  const listRes = get(path.exporter(`auth/sessions/${encodeURIComponent(cfg.userId)}/get`), {
    name: 'sessions.list',
    metric: METRICS.SESSION_READ,
  });
  const list = parseJson(listRes);
  assertShape(listRes, 'sessions.list', () => list !== null);

  const sessions = extractSessions(list);
  if (sessions.length === 0) {
    console.log('[info] no sessions returned, skipping detail/delete steps');
    return;
  }

  const target = pickNonCurrent(sessions, cfg.sessionToken);
  if (!target) {
    console.log(
      '[info] only own session present, skipping detail/delete unless DELETE_OWN_SESSION=true',
    );
    if (!DELETE_OWN_SESSION) return;
  }

  const tokenForDetails = target?.sessionToken || target?.token || sessions[0]?.sessionToken;
  if (!tokenForDetails) {
    console.log('[info] no session token field in response, cannot continue');
    return;
  }

  const detailRes = get(
    path.exporter(`auth/sessions/tokens/${encodeURIComponent(tokenForDetails)}/get`),
    {
      name: 'sessions.details',
      metric: METRICS.SESSION_READ,
    },
  );
  assertShape(detailRes, 'sessions.details', (b) => b !== null);

  if (target || DELETE_OWN_SESSION) {
    del(path.exporter(`auth/sessions/tokens/${encodeURIComponent(tokenForDetails)}/delete`), {
      name: 'sessions.delete',
      metric: METRICS.SESSION_DELETE,
    });
  }
}

const extractSessions = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.items)) return body.items;
  if (body.data && Array.isArray(body.data.items)) return body.data.items;
  return [];
};

const pickNonCurrent = (sessions, ownToken) => {
  for (const s of sessions) {
    const t = s?.sessionToken || s?.token;
    if (t && t !== ownToken) return s;
  }
  return null;
};

export const handleSummary = buildSummary('auth_session_lifecycle');
