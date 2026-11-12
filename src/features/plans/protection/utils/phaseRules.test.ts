import { describe, expect, it } from 'vitest';
import { TIME_FORMATS } from '../../../../constants';
import { buildPlan, FUTURE_RANGE } from '../../../../test/factories/plans';
import { formatDateTime, getTimeZone } from '../../../../utils/shared/time';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import {
  getDecideBlockedTooltip,
  getGenerateReportTooltip,
  isMaterialEditLocked,
  isRejected,
  isReactivateExpired,
  isReportNotStarted,
  liveWindow,
  permissionTooltip,
  planPhaseLabel,
} from './phaseRules';
import { formatRepeatRule, repeatDayLabels } from './repeatRule';
import { formatWindowRange, formatZonedWindowRange } from './windowRange';

const A = PPC.LABELS.DETAIL_PAGE.ACTIONS;
// One hour around noon UTC, so it stays on one day in the test run's time zone.
const WINDOW = { startAt: '2026-04-01T11:30:00Z', endAt: '2026-04-01T12:30:00Z' };
const PAST_RANGE = { startAt: '2020-01-01T00:00:00Z', endAt: '2020-01-02T00:00:00Z' };

describe('liveWindow', () => {
  it.each([
    [
      'repeating and scheduled',
      { timeMode: 'repeating', phase: 'scheduled', window: WINDOW },
      WINDOW,
    ],
    [
      'repeating and canceled',
      { timeMode: 'repeating', phase: 'canceled', window: WINDOW },
      undefined,
    ],
    ['not repeating', { timeMode: 'permanent', phase: 'active', window: WINDOW }, undefined],
  ] as const)('%s', (_label, overrides, expected) => {
    expect(liveWindow(buildPlan(overrides as Partial<ReturnType<typeof buildPlan>>))).toEqual(
      expected,
    );
  });
});

describe('isReactivateExpired', () => {
  it.each([
    ['a passed range', { timeMode: 'time_range', timeRange: PAST_RANGE }, true],
    ['a future range', { timeMode: 'time_range', timeRange: FUTURE_RANGE }, false],
    ['a permanent plan', { timeMode: 'permanent' }, false],
  ] as const)('%s', (_label, overrides, expected) => {
    expect(isReactivateExpired(buildPlan(overrides))).toBe(expected);
  });
});

describe('getDecideBlockedTooltip', () => {
  const requested = { state: 'pending', requestedBy: 'user-1', requestedAt: 'now' } as const;

  it.each([
    ['the requester', { approval: requested }, 'user-1', A.SELF_DECISION_TOOLTIP],
    [
      'an expired range',
      { approval: requested, timeMode: 'time_range', timeRange: PAST_RANGE },
      'user-2',
      A.DECIDE_DISABLED_EXPIRED_TOOLTIP,
    ],
    ['another approver', { approval: requested }, 'user-2', undefined],
  ] as const)('%s', (_label, overrides, user, expected) => {
    expect(getDecideBlockedTooltip(buildPlan(overrides), user)).toBe(expected);
  });
});

describe('labels and locks', () => {
  it('prefers the permission reason over any other', () => {
    expect(permissionTooltip(false, 'denied', 'other')).toBe('denied');
    expect(permissionTooltip(true, 'denied', 'other')).toBe('other');
    expect(permissionTooltip(true, 'denied')).toBeUndefined();
  });

  it('names a rejected plan by its rejection', () => {
    const rejected = buildPlan({
      phase: 'canceled',
      approval: { state: 'rejected', requestedBy: 'a', requestedAt: 'b' },
    });

    expect(isRejected(rejected)).toBe(true);
    expect(planPhaseLabel(rejected)).toBe(PPC.LABELS.PHASE_INFO.REJECTED_LABEL);
    expect(planPhaseLabel(buildPlan({ phase: 'failed' }))).toBe(PPC.LABELS.PHASE_LABELS.failed);
  });

  it.each([
    ['active and approved', { approvalMode: 'required', phase: 'active' }, true],
    [
      'scheduled and approved',
      { approvalMode: 'required', phase: 'scheduled', timeMode: 'time_range' },
      true,
    ],
    [
      'a series between windows',
      { approvalMode: 'required', phase: 'scheduled', timeMode: 'repeating' },
      false,
    ],
    ['no approval needed', { approvalMode: 'automatic', phase: 'active' }, false],
  ] as const)('material edits: %s', (_label, overrides, expected) => {
    expect(isMaterialEditLocked(buildPlan(overrides))).toBe(expected);
  });

  it.each([
    [{ phase: 'scheduled' as const, startedAt: 'x' }, true],
    [{ phase: 'active' as const, startedAt: undefined }, true],
    [{ phase: 'active' as const, startedAt: 'x' }, false],
  ])('reports: %j not started is %s', (overrides, expected) => {
    expect(isReportNotStarted(buildPlan(overrides))).toBe(expected);
  });

  it('explains why a report cannot be generated', () => {
    const scheduled = buildPlan({ phase: 'scheduled' });

    expect(getGenerateReportTooltip(scheduled, false)).toBe(
      PPC.LABELS.PERMISSION_DENIED.GENERATE_REPORT,
    );
    expect(getGenerateReportTooltip(scheduled, true)).toBe(PPC.LABELS.REPORTS.NOT_STARTED_HINT);
  });
});

describe('repeat rule and window text', () => {
  const { CARD, PHASE_INFO } = PPC.LABELS;
  const { SHORT_DATE_TIME, HOUR_MINUTE } = TIME_FORMATS;
  const repeat = {
    days: ['fri' as const, 'mon' as const],
    startTime: '08:00',
    endTime: '20:00',
    timeZone: 'UTC',
  };

  it('orders days as the week does', () => {
    expect(repeatDayLabels(repeat)).toEqual(['Mon', 'Fri']);
    expect(formatRepeatRule(repeat)).toBe(
      CARD.REPEAT_RULE(`Mon${CARD.REPEAT_DAY_SEPARATOR}Fri`, '08:00', '20:00', 'UTC'),
    );
  });

  it('drops the date from an end on the same day, and keeps it across days', () => {
    const start = (range: typeof WINDOW) => formatDateTime(range.startAt, SHORT_DATE_TIME);

    expect(formatWindowRange(WINDOW)).toBe(
      `${start(WINDOW)}${CARD.RANGE_SEPARATOR}${formatDateTime(WINDOW.endAt, HOUR_MINUTE)}`,
    );
    expect(formatWindowRange(PAST_RANGE)).toBe(
      `${start(PAST_RANGE)}${CARD.RANGE_SEPARATOR}${formatDateTime(PAST_RANGE.endAt, SHORT_DATE_TIME)}`,
    );
  });

  it('names the time zone of a zoned range', () => {
    expect(formatZonedWindowRange(FUTURE_RANGE)).toBe(
      PHASE_INFO.IN_TIME_ZONE(formatWindowRange(FUTURE_RANGE), getTimeZone()),
    );
  });
});
