import { describe, expect, it } from 'vitest';
import { buildInsight, buildInsightRow, buildLastRun } from '../../../test/factories/insights';
import {
  CLUSTER_INSIGHTS,
  INSIGHT_ERROR_CODES,
  insightErrorMessage,
  QUEUED_TIMEOUT_MS,
  RUNNING_TIMEOUT_MS,
  triageErrorMessage,
} from '../constants/insights';
import { INSIGHTS_UI } from '../constants/texts';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import { KIND_FALLBACK_GUIDANCE } from '../constants/guidance';
import {
  copyableSetting,
  formatTemplate,
  isRecommendation,
  resolveInsightGuidance,
  triageActions,
} from './guidance';
import { byPriority, effectiveRun, runDeadline } from './run';
import { loadGroupBy, saveGroupBy, validApp, workloadNamespaceOf } from './view';

const NOW = Date.parse('2026-01-15T12:00:00Z');

describe('guidance', () => {
  it('fills a template and marks what is missing', () => {
    expect(formatTemplate('Fix {a} on {b}', { a: 'cpu' })).toBe('Fix cpu on —');
  });

  it('has no guidance for documents written before reasons existed', () => {
    expect(resolveInsightGuidance(buildInsight({ reason: undefined }))).toBeNull();
  });

  it('adds the rollback step to an incident that followed a change', () => {
    const guidance = resolveInsightGuidance(
      buildInsight({ reason: 'crashloop.exit_1', params: { generation: '7' } }),
    );

    expect(guidance?.steps.at(-1)).toContain('7');
  });

  it('falls back to the kind for an unknown reason', () => {
    expect(resolveInsightGuidance(buildInsight({ reason: 'made.up.reason' }))?.steps).toHaveLength(
      KIND_FALLBACK_GUIDANCE.crashloop.steps.length,
    );
  });

  it.each([
    [{ status: 'resolved' as const, category: 'incident' as const }, []],
    [{ status: 'open' as const, category: 'incident' as const }, ['acknowledge']],
    [{ status: 'open' as const, category: 'recommendation' as const }, ['acknowledge', 'dismiss']],
    [
      { status: 'open' as const, triage: { state: 'dismissed' as const, by: 'a', at: 'b' } },
      ['reopen'],
    ],
  ])('offers the right triage actions for %j', (insight, actions) => {
    expect(triageActions(insight)).toEqual(actions);
  });

  it.each([
    ['Set securityContext.runAsNonRoot: true on it.', 'securityContext.runAsNonRoot: true'],
    ['Set replicas to 3.', null],
  ])('finds the copyable setting in %j', (step, expected) => {
    expect(copyableSetting(step)).toBe(expected);
  });

  it('reads the recommendation category', () => {
    expect(isRecommendation({ category: 'recommendation' })).toBe(true);
    expect(isRecommendation({ category: 'incident' })).toBe(false);
  });
});

describe('runs', () => {
  const started = new Date(NOW).toISOString();

  it.each([
    [{ status: 'running' as const, startedAt: started }, NOW + RUNNING_TIMEOUT_MS],
    [{ status: 'queued' as const, queuedAt: started }, NOW + QUEUED_TIMEOUT_MS],
    [{ status: 'done' as const }, null],
  ])('gives %j its deadline', (run, deadline) => {
    expect(runDeadline(buildLastRun(run))).toBe(deadline);
  });

  it('keeps a run before its deadline', () => {
    const run = buildLastRun({ status: 'running', startedAt: started });

    expect(effectiveRun(run, NOW)).toBe(run);
  });

  it.each([
    [{ status: 'running' as const, startedAt: started, error: 'kept' }, 'kept'],
    [{ status: 'queued' as const, queuedAt: started }, INSIGHT_ERROR_CODES.JOB_EXPIRED],
  ])('fails a run past its deadline: %j', (run, error) => {
    const late = effectiveRun(buildLastRun(run), NOW + QUEUED_TIMEOUT_MS + 1);

    expect(late).toMatchObject({ status: 'failed', error });
  });

  it('orders by severity, then newest first', () => {
    const critical = buildInsight({ severity: 'critical', lastSeenAt: '2026-01-01T00:00:00Z' });
    const newestWarning = buildInsight({ severity: 'warning', lastSeenAt: '2026-01-03T00:00:00Z' });
    const oldestWarning = buildInsight({ severity: 'warning', lastSeenAt: '2026-01-02T00:00:00Z' });

    expect([oldestWarning, newestWarning, critical].sort(byPriority)).toEqual([
      critical,
      newestWarning,
      oldestWarning,
    ]);
  });
});

describe('view helpers', () => {
  it('remembers only a known grouping', () => {
    saveGroupBy('namespace');
    expect(loadGroupBy()).toBe('namespace');

    localStorage.setItem(CLUSTER_INSIGHTS.GROUP_BY_STORAGE_KEY, 'bogus');
    expect(loadGroupBy()).toBe('none');
  });

  it.each([
    ['payments/checkout', true],
    ['payments', false],
    ['/checkout', false],
    ['payments/', false],
    ['', false],
  ])('validApp(%j) is %s', (value, expected) => {
    expect(validApp(value)).toBe(expected);
  });

  it('prefers the workload namespace', () => {
    expect(workloadNamespaceOf(buildInsightRow({ workloadNamespace: 'jobs' }))).toBe('jobs');
    expect(workloadNamespaceOf(buildInsightRow({ namespace: 'payments' }))).toBe('payments');
  });
});

describe('error messages', () => {
  it('maps a known code and falls back for an unknown one', () => {
    expect(insightErrorMessage('queue_full')).toBe(INSIGHTS_UI.ERRORS.QUEUE_FULL);
    expect(insightErrorMessage('nope')).toBe(INSIGHTS_ERROR_MESSAGES.CLIENT.ANALYZE_FAILED);
    expect(triageErrorMessage(undefined)).toBe(INSIGHTS_UI.ERRORS.TRIAGE_FAILED);
  });
});
