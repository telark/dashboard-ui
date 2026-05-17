// S5 — application_force_sync
// Purpose: POST sync → poll app phase via exporter until Idle/Synced or timeout
// APIs: discovery sync (enqueue), exporter app GET (status read)
// Services: discovery + exporter (cache invalidation after worker writes through)
// Why: only end-to-end coverage of the Redis Stream + worker pipeline

import { sleep } from 'k6';
import { path, cfg, requireToken, requireUserId } from '../lib/config.js';
import { get, post, parseJson, resetStepCounter } from '../lib/http.js';
import { METRICS, pickThresholds, trend } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

const POLL_DELAYS_SEC = [2, 4, 8, 12, 20, 30];
const TERMINAL_PHASES = new Set(['Idle', 'Synced', 'Ready', 'Available']);

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([
    METRICS.FORCE_SYNC_ENQUEUE,
    METRICS.FORCE_SYNC_COMPLETION,
    METRICS.CACHED_GET,
  ]),
};

export const setup = () => {
  requireToken();
  requireUserId();
  if (!cfg.testAppName) {
    throw new Error('TEST_APP_NAME env var is required for application_force_sync');
  }
};

export default function () {
  resetStepCounter();
  const name = cfg.testAppName;

  const enqStart = Date.now();
  const enqRes = post(
    `${path.discovery(`resources/applications/${encodeURIComponent(name)}/sync`)}?reason=k6`,
    {},
    {
      name: 'force_sync.enqueue',
      metric: METRICS.FORCE_SYNC_ENQUEUE,
      checks: {
        'enqueue accepted (200 or 202)': (r) => r.status === 200 || r.status === 202,
      },
    },
  );
  const enqBody = parseJson(enqRes);
  console.log(`[info] enqueue body: ${JSON.stringify(enqBody)}`);

  const baselinePhase = readPhase(parseJson(
    get(path.exporter(`resources/applications/${encodeURIComponent(name)}/get`), {
      name: 'app.read.baseline',
      metric: METRICS.CACHED_GET,
    }),
  ));
  console.log(`[info] baseline app phase: ${baselinePhase}`);

  const deadline = Date.now() + cfg.forceSyncPollTimeoutSec * 1000;
  let pollIdx = 0;
  let terminal = false;

  while (Date.now() < deadline) {
    const delay = POLL_DELAYS_SEC[Math.min(pollIdx, POLL_DELAYS_SEC.length - 1)];
    sleep(delay);
    pollIdx += 1;

    const res = get(path.exporter(`resources/applications/${encodeURIComponent(name)}/get`), {
      name: `app.poll[${pollIdx}]`,
      metric: METRICS.CACHED_GET,
    });
    const phase = readPhase(parseJson(res));
    console.log(`[info] poll #${pollIdx} phase=${phase}`);
    if (phase && TERMINAL_PHASES.has(phase)) {
      terminal = true;
      break;
    }
  }

  const totalMs = Date.now() - enqStart;
  trend(METRICS.FORCE_SYNC_COMPLETION).add(totalMs);

  if (!terminal) {
    console.error(`[FAIL] force_sync did not reach a terminal phase within ${cfg.forceSyncPollTimeoutSec}s`);
  } else {
    console.log(`[ok] force_sync completed in ${totalMs}ms`);
  }
}

const readPhase = (body) => {
  if (!body) return null;
  const root = body.data || body;
  return (
    root.phase ||
    root.status?.phase ||
    root.spec?.phase ||
    root.forceSyncPhase ||
    null
  );
};

export const handleSummary = buildSummary('application_force_sync');
