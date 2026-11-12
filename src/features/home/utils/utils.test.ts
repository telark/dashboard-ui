import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_ROUTES, EMPTY_VALUE } from '../../../constants';
import { buildApplicationWith, buildChangeLogEntry } from '../../../test/factories/applications';
import { buildPlan } from '../../../test/factories/plans';
import {
  HOME_DASHBOARD_TEXTS as T,
  HOME_CHART_TEXTS as CT,
  HOME_CHART_LAYOUT,
} from '../constants/dashboard';
import { changeActivityData, planActivityData } from './charts';
import { parseClusterVersion } from './cluster';
import { applicationsBreakdown, planAttentionRow, plansBreakdown, recentChangeRow } from './rows';
import {
  plansNeedingAttention,
  recentlyChangedApplications,
  summarizeApplications,
  summarizePlans,
  toBoxState,
} from './summary';

const appWith = (status: string, hasDrift = false, lastChange: string | null = null) =>
  buildApplicationWith({
    health: { status, readyReplicas: 1, totalReplicas: 1 },
    history: { hasDrift },
    derived: { lastChangeDetectedAt: lastChange },
  });

describe('parseClusterVersion', () => {
  it.each([
    [undefined, EMPTY_VALUE, EMPTY_VALUE],
    ['v1.29.2', 'v1.29.2', T.CLUSTER.VANILLA],
    ['v1.29.2-eks-5e0fdde', 'v1.29.2', 'EKS'],
    ['v1.28.3-gke.1286000', 'v1.28.3', 'GKE'],
    ['v1.27.1+k3s1', 'v1.27.1', 'k3s'],
    ['v1.30.0+rke2r1', 'v1.30.0', 'RKE2'],
    ['v1.30.0-rancher1', 'v1.30.0', 'rancher1'],
    ['nightly', 'nightly', T.CLUSTER.VANILLA],
  ])('parseClusterVersion(%j)', (gitVersion, version, distribution) => {
    expect(parseClusterVersion(gitVersion)).toMatchObject({ version, distribution });
  });
});

describe('summaries', () => {
  it('sorts applications into health states and counts drift', () => {
    const apps = [
      appWith('healthy'),
      appWith('Degraded', true),
      appWith('down'),
      appWith('mystery'),
    ];

    expect(summarizeApplications(apps)).toEqual({
      total: 4,
      healthy: 1,
      degraded: 1,
      down: 1,
      unknown: 1,
      drifted: 1,
    });
  });

  it('counts plan health only while a plan runs', () => {
    const plans = [
      buildPlan({ phase: 'active', health: 'drifted' }),
      buildPlan({ phase: 'active', health: 'degraded' }),
      buildPlan({ phase: 'scheduled', health: 'drifted' }),
      buildPlan({ phase: 'failed' }),
    ];

    expect(summarizePlans(plans)).toEqual({
      total: 4,
      active: 2,
      scheduled: 1,
      drifted: 1,
      degraded: 1,
      failed: 1,
    });
  });

  it('puts failed plans before degraded before drifted, and ignores the rest', () => {
    const [failed, degraded, drifted, fine] = [
      buildPlan({ phase: 'failed' }),
      buildPlan({ phase: 'active', health: 'degraded' }),
      buildPlan({ phase: 'active', health: 'drifted' }),
      buildPlan({ phase: 'active', health: 'healthy' }),
    ];

    expect(plansNeedingAttention([fine, drifted, degraded, failed])).toEqual([
      failed,
      degraded,
      drifted,
    ]);
  });

  it('orders recently changed applications newest first and drops unchanged ones', () => {
    const [newer, older, unchanged] = [
      appWith('healthy', false, '2026-03-02T00:00:00Z'),
      appWith('healthy', false, '2026-03-01T00:00:00Z'),
      appWith('healthy'),
    ];

    expect(recentlyChangedApplications([older, unchanged, newer])).toEqual([newer, older]);
  });

  it.each([
    [true, null, false, { loading: true, failed: false }],
    [true, 'boom', false, { loading: false, failed: true }],
    [false, 'boom', true, { loading: false, failed: false }],
  ])('toBoxState(%s, %j, %s)', (loading, error, hasData, expected) => {
    expect(toBoxState(loading, error, hasData)).toEqual(expected);
  });
});

describe('rows', () => {
  it('breaks applications and plans down by state', () => {
    const appsSummary = summarizeApplications([appWith('down')]);
    const plansSummary = summarizePlans([buildPlan({ phase: 'failed' })]);

    expect(
      applicationsBreakdown(appsSummary).find((row) => row.label === T.APPLICATIONS.DOWN),
    ).toMatchObject({ count: 1 });
    expect(plansBreakdown(plansSummary).find((row) => row.label === T.PLANS.FAILED)).toMatchObject({
      count: 1,
    });
  });

  it('builds a recent change row with singular labels', () => {
    const application = buildApplicationWith({
      name: 'orders',
      displayName: '',
      derived: { totalChanges: 1, totalIncidents: 1 },
    });

    expect(recentChangeRow(application)).toMatchObject({
      title: 'orders',
      to: APP_ROUTES.APPLICATION_DETAILS.replace(':name', 'orders'),
    });
    expect(recentChangeRow(application).meta).toBe(
      `1 ${T.RECENT_CHANGES.CHANGE}${T.META_SEPARATOR}1 ${T.RECENT_CHANGES.INCIDENT}`,
    );
  });

  it('builds an attention row from the plan state', () => {
    const plan = buildPlan({
      name: 'freeze orders',
      phase: 'failed',
      healthCheckedAt: undefined,
      lastUpdatedAt: '2026-02-01T10:00:00Z',
    });

    expect(planAttentionRow(plan)).toMatchObject({
      key: plan.id,
      time: plan.lastUpdatedAt,
      to: APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', 'freeze%20orders'),
    });
  });
});

describe('activity charts', () => {
  const TODAY = new Date('2026-03-31T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts changes per severity over the window, keeping unknown severities', () => {
    const entries = [
      buildChangeLogEntry({ detectedAt: '2026-03-30T10:00:00Z', severity: 'high' }),
      buildChangeLogEntry({ detectedAt: '2026-03-30T11:00:00Z', severity: 'high' }),
      buildChangeLogEntry({ detectedAt: '2026-03-29T10:00:00Z', severity: 'mystery' }),
      buildChangeLogEntry({ detectedAt: '2025-01-01T10:00:00Z', severity: 'low' }),
    ];
    const app = buildApplicationWith({ history: { changeLog: entries } });

    const { data, colors } = changeActivityData([app]);

    expect(colors.domain).toEqual([
      CT.CHANGE_ACTIVITY.SEVERITIES.high,
      CT.CHANGE_ACTIVITY.SEVERITIES.other,
    ]);
    expect(data).toHaveLength(2 * HOME_CHART_LAYOUT.ACTIVITY_DAYS);
    const highs = data.filter((row) => row.series === CT.CHANGE_ACTIVITY.SEVERITIES.high);
    expect(highs.map((row) => row.count).reduce((a, b) => a + b, 0)).toBe(2);
  });

  it('draws nothing without events', () => {
    expect(planActivityData([])).toEqual({ data: [], colors: { domain: [], range: [] } });
  });

  it('plots each lifecycle event of a plan', () => {
    const plan = buildPlan({
      createdAt: '2026-03-20T00:00:00Z',
      startedAt: '2026-03-21T00:00:00Z',
      terminatedAt: '2026-03-22T00:00:00Z',
    });

    expect(planActivityData([plan]).colors.domain).toEqual([
      CT.PLAN_ACTIVITY.EVENTS.created,
      CT.PLAN_ACTIVITY.EVENTS.started,
      CT.PLAN_ACTIVITY.EVENTS.terminated,
    ]);
  });
});
