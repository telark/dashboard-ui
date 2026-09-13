// S2 — auth_session_lifecycle
// Purpose: walk "My sessions" panel using a pre-issued SESSION_TOKEN
// APIs touched: exporter session list, session details, session delete
// Services: exporter
// Why: validates the session read contract every authenticated flow depends on
// Note: by default does NOT delete the session that owns SESSION_TOKEN; set DELETE_OWN_SESSION=true to opt in

import crypto from 'k6/crypto';
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

  const ownName = sessionName(cfg.sessionToken);
  const target = pickNonCurrent(sessions, ownName);
  if (!target) {
    console.log(
      '[info] only own session present, skipping detail/delete unless DELETE_OWN_SESSION=true',
    );
    if (!DELETE_OWN_SESSION) return;
  }

  // The list never returns session tokens; a session is addressed by its
  // resource name, which these endpoints accept in place of a token.
  const ref = target?.metadata?.name || sessions[0]?.metadata?.name;
  if (!ref) {
    console.log('[info] no session name field in response, cannot continue');
    return;
  }

  const detailRes = get(path.exporter(`auth/sessions/tokens/${encodeURIComponent(ref)}/get`), {
    name: 'sessions.details',
    metric: METRICS.SESSION_READ,
  });
  assertShape(detailRes, 'sessions.details', (b) => b !== null);

  if (target || DELETE_OWN_SESSION) {
    del(path.exporter(`auth/sessions/tokens/${encodeURIComponent(ref)}/delete`), {
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

const sessionName = (token) => `session-${crypto.sha256(token, 'hex')}`;

const pickNonCurrent = (sessions, ownName) => {
  for (const s of sessions) {
    const name = s?.metadata?.name;
    if (name && name !== ownName) return s;
  }
  return null;
};

export const handleSummary = buildSummary('auth_session_lifecycle');
