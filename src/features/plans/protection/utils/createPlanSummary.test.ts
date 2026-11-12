import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { buildPlan, buildPlanTemplate } from '../../../../test/factories/plans';
import type { FormValues } from '../components/create';
import { CREATE_PANEL_TEXTS as T } from '../constants/createPanel';
import { PROTECTION_PLANS_CONSTANTS as PPC, POLICY_CHIP_LABEL } from '../constants/protectionPlans';
import { formatDateTime, formatTimeZoneOffset, getTimeZone } from '../../../../utils/shared/time';
import type { CreateOutcome, PlanRepeatDay } from '../models';
import { createdMessage, createOutcome, planSummary } from './createPlanSummary';
import { DEFAULT_FORM_VALUES, repeatFormValues } from './planFormValues';

const S = T.SUMMARY;
const OPERATION = POLICY_CHIP_LABEL['block-delete'].toLowerCase();
const { APPROVAL_HELP_REQUIRED, APPROVAL_HELP_REQUIRED_SERIES } = PPC.CREATE_PAGE.FORM;
const NOW = Date.parse('2026-03-02T12:00:00Z'); // a Monday noon, UTC
type Outcome = Parameters<typeof createOutcome>[0];
const repeat = (days: PlanRepeatDay[], startTime: string, endTime: string) => ({
  days,
  startTime,
  endTime,
  timeZone: 'UTC',
});

describe('createOutcome', () => {
  it.each<[string, Outcome, CreateOutcome]>([
    ['approval comes first', { approvalMode: 'required', mode: 'enforce' }, 'approval'],
    [
      'a future window is scheduled',
      {
        mode: 'audit',
        timeRange: { startAt: '2026-04-01T00:00:00Z', endAt: '2026-04-02T00:00:00Z' },
      },
      'schedule',
    ],
    ['an instant audit', { mode: 'audit' }, 'audit'],
    ['an instant enforce', { mode: 'enforce' }, 'enforce'],
    [
      'outside a weekly window',
      { mode: 'enforce', repeat: repeat(['tue'], '08:00', '20:00') },
      'schedule',
    ],
    [
      'inside a weekly window',
      { mode: 'enforce', repeat: repeat(['mon'], '08:00', '20:00') },
      'enforce',
    ],
    [
      'before a weekly window opens',
      { mode: 'audit', repeat: repeat(['mon'], '15:00', '20:00') },
      'schedule',
    ],
    [
      'an overnight window that opened yesterday',
      { mode: 'audit', repeat: repeat(['sun'], '22:00', '13:00') },
      'audit',
    ],
  ])('%s', (_label, payload, expected) => {
    expect(createOutcome(payload, NOW)).toBe(expected);
  });
});

describe('createdMessage', () => {
  it.each([
    [{ phase: 'pending_approval' as const }, T.TOASTS.approval],
    [{ phase: 'active' as const, mode: 'audit' as const }, T.TOASTS.audit],
    [{ phase: 'active' as const, mode: 'enforce' as const }, T.TOASTS.enforce],
  ])('reports %j', (overrides, toast) => {
    const plan = buildPlan({ name: 'freeze', ...overrides });

    expect(createdMessage(plan)).toBe(toast(plan.name, ''));
  });

  it('names the start of a scheduled plan', () => {
    const startAt = '2026-04-01T08:00:00Z';
    const plan = buildPlan({
      name: 'freeze',
      phase: 'scheduled',
      timeMode: 'time_range',
      timeRange: { startAt, endAt: '2026-04-02T08:00:00Z' },
    });

    expect(createdMessage(plan)).toBe(
      T.TOASTS.schedule(plan.name, formatDateTime(startAt, S.TIME_FORMAT)),
    );
  });
});

describe('planSummary', () => {
  const template = buildPlanTemplate({ id: 'custom-rule', name: 'Custom rule' });
  const summarize = (
    overrides: Partial<FormValues>,
    policies = [{ templateID: 'block-delete', params: {} }],
  ) =>
    planSummary({
      values: { ...DEFAULT_FORM_VALUES, ...repeatFormValues(), ...overrides },
      policies,
      templates: [template],
      applicationOptions: [{ value: 'orders', label: 'Orders app' }],
    });

  it('says when nothing is picked yet', () => {
    expect(summarize({ namespaces: [] }, [])).toContain(S.NO_POLICIES);
    expect(summarize({ namespaces: [] }, [])).toContain(S.NO_TARGETS.namespaces);
  });

  it('names a custom template and its parameters', () => {
    const summary = summarize({}, [{ templateID: 'custom-rule', params: { kinds: ['Pod'] } }]);

    expect(summary).toContain(S.POLICY('custom rule', 'Pod'));
  });

  it('labels applications by their display name and lists exclusions', () => {
    const summary = summarize({
      scopeType: 'applications',
      applicationRefs: ['orders'],
      excludedKinds: ['Secret'],
      excludedResources: ['Deployment/payments/checkout'],
    });

    expect(summary).toContain('Orders app');
    expect(summary).toContain(S.EXCLUDED_KIND('Secret'));
    expect(summary).toContain(S.EXCLUDED_RESOURCE('Deployment', 'checkout'));
  });

  it.each<[string, Partial<FormValues>, string]>([
    ['refuses in enforce mode', { mode: 'enforce' }, S.REFUSE(S.POLICY(OPERATION, ''))],
    ['records in audit mode', { mode: 'audit' }, S.RECORD(S.POLICY(OPERATION, ''))],
    ['one namespace', { namespaces: ['payments'] }, S.IN_NAMESPACES(1, 'payments', '')],
    [
      'two namespaces',
      { namespaces: ['payments', 'ops'] },
      S.IN_NAMESPACES(2, 'payments and ops', ''),
    ],
    ['a permanent plan', { timeMode: 'permanent' }, S.PERMANENT],
    ['no time range picked', { timeMode: 'time_range' }, S.NO_WINDOW],
    ['no repeat picked', { timeMode: 'repeating' }, S.NO_REPEAT],
    ['an approver deploys', { approvalMode: 'required' }, APPROVAL_HELP_REQUIRED],
    [
      'an approver deploys a series',
      { approvalMode: 'required', timeMode: 'repeating' },
      APPROVAL_HELP_REQUIRED_SERIES,
    ],
  ])('%s', (_label, overrides, expected) => {
    expect(summarize(overrides)).toContain(expected);
  });

  it('describes a time range with its zone', () => {
    const [startAt, endAt] = [dayjs('2026-04-01T08:00:00Z'), dayjs('2026-04-02T08:00:00Z')];
    const zone = getTimeZone();

    expect(summarize({ timeMode: 'time_range', startAt, endAt })).toContain(
      S.WINDOW(
        formatDateTime(startAt.toDate(), S.TIME_FORMAT),
        formatDateTime(endAt.toDate(), S.TIME_FORMAT),
        S.ZONE(zone, formatTimeZoneOffset(zone, startAt.toDate())),
      ),
    );
  });

  it('describes a repeating window and its own deploy sentence', () => {
    const summary = summarize({
      timeMode: 'repeating',
      ...repeatFormValues({ days: ['mon'], startTime: '09:00', endTime: '18:00', timeZone: 'UTC' }),
    });

    expect(summary).toContain(S.REPEATING('Mon', '09:00', '18:00', 'UTC'));
    expect(summary).toContain(S.REPEATING_DEPLOY);
  });
});
