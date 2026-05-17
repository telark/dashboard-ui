// S4 — applications_browse
// Purpose: list apps → pick one → fetch details → fetch snapshot summaries (fan-out) → rollbacks → manifest
// APIs: exporter only
// Services: exporter
// Why: heaviest read journey, bound by exporter K8s QPS 50 ceiling; catches snapshot fan-out regressions

import { path, requireToken } from '../lib/config.js';
import { get, parseJson, resetStepCounter } from '../lib/http.js';
import { assertShape } from '../lib/assert.js';
import { METRICS, pickThresholds, trend } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([
    METRICS.CACHED_LIST,
    METRICS.CACHED_GET,
    METRICS.SNAPSHOT_SUMMARY,
    METRICS.SNAPSHOT_FANOUT_TOTAL,
    METRICS.SNAPSHOT_MANIFEST,
  ]),
};

export const setup = () => {
  requireToken();
};

export default function () {
  resetStepCounter();

  const listRes = get(path.exporter('resources/applications/get'), {
    name: 'applications.list',
    metric: METRICS.CACHED_LIST,
  });
  const apps = extractItems(parseJson(listRes));
  assertShape(listRes, 'applications.list', (_b) => Array.isArray(apps));

  if (apps.length === 0) {
    console.log('[info] no applications returned, scenario exits early');
    return;
  }

  const app = pickAppWithSnapshots(apps) || apps[0];
  const name = app?.name || app?.metadata?.name;
  if (!name) {
    console.log('[info] selected application has no name field, cannot continue');
    return;
  }

  const detailRes = get(path.exporter(`resources/applications/${encodeURIComponent(name)}/get`), {
    name: 'applications.details',
    metric: METRICS.CACHED_GET,
  });
  const detail = parseJson(detailRes);

  const refs = extractSnapshotRefs(detail);
  if (refs.length > 0) {
    const fanoutStart = Date.now();
    for (const ref of refs) {
      const qs = `scope=apps&namespace=${encodeURIComponent(ref.namespace)}&generation=${ref.generation}`;
      get(path.exporter(`snapshots/${encodeURIComponent(ref.id)}/get?${qs}`), {
        name: `snapshots.summary[${ref.generation}]`,
        metric: METRICS.SNAPSHOT_SUMMARY,
      });
    }
    trend(METRICS.SNAPSHOT_FANOUT_TOTAL).add(Date.now() - fanoutStart);

    const top = refs[0];
    const manifestQs = `scope=apps&namespace=${encodeURIComponent(top.namespace)}&generation=${top.generation}`;
    get(path.exporter(`snapshots/${encodeURIComponent(top.id)}/manifest?${manifestQs}`), {
      name: 'snapshots.manifest',
      metric: METRICS.SNAPSHOT_MANIFEST,
    });
  } else {
    console.log('[info] selected app has no snapshot refs, fan-out skipped');
  }

  get(path.exporter(`resources/applications/${encodeURIComponent(name)}/rollbacks/get`), {
    name: 'applications.rollbacks',
    metric: METRICS.CACHED_LIST,
    skipAssert: false,
  });
}

const extractItems = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.data?.items)) return body.data.items;
  return [];
};

const pickAppWithSnapshots = (apps) => {
  for (const a of apps) {
    if (extractSnapshotRefs({ data: a }).length > 0 || extractSnapshotRefs(a).length > 0) return a;
  }
  return null;
};

const extractSnapshotRefs = (detail) => {
  if (!detail) return [];
  const root = detail.data || detail;
  const candidates = root.snapshots || root.spec?.snapshots || root.status?.snapshots || [];
  if (!Array.isArray(candidates)) return [];
  const out = [];
  for (const c of candidates) {
    if (!c) continue;
    const id = c.id || c.snapshotId;
    const generation = Number(c.generation ?? 0);
    const namespace = c.namespace || '';
    if (id) out.push({ id: String(id), generation, namespace });
  }
  return out;
};

export const handleSummary = buildSummary('applications_browse');
