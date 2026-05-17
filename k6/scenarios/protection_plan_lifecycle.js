// S6 — protection_plan_lifecycle
// Purpose: full plan CRUD across discovery↔exporter inter-service boundary
// APIs: discovery (templates, namespaces, prepare, status, violations, duplicate, cancel, reactivate, update, clear); exporter (read confirmations)
// Services: discovery + exporter
// Why: most service-rich flow; catches inter-service contract mismatches, per-ID lock contention, state-machine bugs

import { sleep } from 'k6';
import { path, cfg, requireToken, requireUserId } from '../lib/config.js';
import { get, post, del, parseJson, resetStepCounter } from '../lib/http.js';
import { assertShape } from '../lib/assert.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { fixtures } from '../lib/fixtures.js';
import { buildSummary } from '../lib/report.js';

const STATUS_POLL_DELAYS_SEC = [2, 4, 8];
const TERMINAL_PLAN_STATES = new Set(['Ready', 'Active', 'Failed', 'Idle']);

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([
    METRICS.PLAN_TEMPLATES,
    METRICS.PLAN_PREPARE,
    METRICS.PLAN_STATUS,
    METRICS.PLAN_VIOLATIONS,
    METRICS.PLAN_MUTATE,
    METRICS.NAMESPACES_LIST,
    METRICS.CACHED_GET,
  ]),
};

export const setup = () => {
  requireToken();
  requireUserId();
};

export default function () {
  resetStepCounter();

  const templatesRes = get(path.discovery('plans/protection/templates'), {
    name: 'plan.templates',
    metric: METRICS.PLAN_TEMPLATES,
  });
  const templates = extractItems(parseJson(templatesRes));
  assertShape(templatesRes, 'plan.templates', (_b) => Array.isArray(templates));

  const templateId = cfg.testPlanTemplateId || pickFirstTemplateId(templates);
  if (!templateId) {
    console.error('[FAIL] no plan template available (set TEST_PLAN_TEMPLATE_ID or seed templates)');
    return;
  }

  get(path.discovery('analyze/namespaces/get'), {
    name: 'namespaces.list',
    metric: METRICS.NAMESPACES_LIST,
  });

  const preparePayload = {
    name: fixtures.planName(),
    description: 'created by k6 suite',
    templateID: templateId,
    participantsIDs: [cfg.userId],
  };
  const prepareRes = post(path.discovery('plans/protection/prepare'), preparePayload, {
    name: 'plan.prepare',
    metric: METRICS.PLAN_PREPARE,
  });
  const planId = extractPlanId(parseJson(prepareRes));
  if (!planId) {
    console.error('[FAIL] plan prepare returned no id; aborting');
    return;
  }

  pollStatus(planId);

  get(`${path.discovery(`plans/protection/${encodeURIComponent(planId)}/violations`)}?limit=20`, {
    name: 'plan.violations',
    metric: METRICS.PLAN_VIOLATIONS,
  });

  get(path.exporter(`plans/protection/${encodeURIComponent(planId)}/get`), {
    name: 'plan.exporter.get',
    metric: METRICS.CACHED_GET,
  });

  const dupRes = post(
    path.discovery(`plans/protection/${encodeURIComponent(planId)}/duplicate`),
    {},
    {
      name: 'plan.duplicate',
      metric: METRICS.PLAN_MUTATE,
    },
  );
  const dupId = extractPlanId(parseJson(dupRes));

  post(
    path.discovery(`plans/protection/${encodeURIComponent(planId)}/cancel`),
    { reason: 'k6 lifecycle test' },
    {
      name: 'plan.cancel',
      metric: METRICS.PLAN_MUTATE,
    },
  );

  post(
    path.discovery(`plans/protection/${encodeURIComponent(planId)}/reactivate`),
    {},
    {
      name: 'plan.reactivate',
      metric: METRICS.PLAN_MUTATE,
    },
  );

  post(
    path.discovery(`plans/protection/${encodeURIComponent(planId)}/update`),
    { description: 'k6 edited' },
    {
      name: 'plan.update',
      metric: METRICS.PLAN_MUTATE,
    },
  );

  del(path.discovery(`plans/protection/${encodeURIComponent(planId)}/clear`), {
    name: 'plan.clear',
    metric: METRICS.PLAN_MUTATE,
  });

  if (dupId) {
    del(path.discovery(`plans/protection/${encodeURIComponent(dupId)}/clear`), {
      name: 'plan.clear.duplicate',
      metric: METRICS.PLAN_MUTATE,
    });
  }
}

const pollStatus = (planId) => {
  const deadline = Date.now() + cfg.planStatusPollTimeoutSec * 1000;
  let idx = 0;
  while (Date.now() < deadline) {
    const delay = STATUS_POLL_DELAYS_SEC[Math.min(idx, STATUS_POLL_DELAYS_SEC.length - 1)];
    sleep(delay);
    idx += 1;
    const res = get(path.discovery(`plans/protection/${encodeURIComponent(planId)}/status`), {
      name: `plan.status[${idx}]`,
      metric: METRICS.PLAN_STATUS,
    });
    const state = extractState(parseJson(res));
    console.log(`[info] plan ${planId} state=${state}`);
    if (state && TERMINAL_PLAN_STATES.has(state)) return;
  }
  console.log(`[info] plan ${planId} did not reach terminal state within ${cfg.planStatusPollTimeoutSec}s — continuing`);
};

const extractItems = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.data?.items)) return body.data.items;
  return [];
};

const pickFirstTemplateId = (templates) => {
  for (const t of templates) {
    if (!t) continue;
    if (t.id) return t.id;
    if (t.templateID) return t.templateID;
    if (t.name) return t.name;
  }
  return null;
};

const extractPlanId = (body) => {
  if (!body) return null;
  const root = body.data || body;
  return root.id || root.planID || root.metadata?.name || null;
};

const extractState = (body) => {
  if (!body) return null;
  const root = body.data || body;
  return root.state || root.status?.state || root.phase || null;
};

export const handleSummary = buildSummary('protection_plan_lifecycle');
