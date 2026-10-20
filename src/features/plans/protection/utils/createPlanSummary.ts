import type { FormValues, PolicyEntry } from '../components/create';
import type { PreparePlanPayload } from '../clients';
import type {
  CreateOutcome,
  PlanPhase,
  PlanRepeat,
  PlanRepeatDay,
  PlanTemplate,
  ProtectionPlan,
} from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC, POLICY_CHIP_LABEL } from '../constants/protectionPlans';
import { CREATE_PANEL_TEXTS } from '../constants/createPanel';
import { decodeResourceKey, repeatPayload } from './planFormValues';
import { repeatDayLabels } from './repeatRule';
import {
  formatDateTime,
  formatTimeZoneOffset,
  getTimeZone,
  toZonedTime,
} from '../../../../utils/shared/time';

const S = CREATE_PANEL_TEXTS.SUMMARY;
const { FORM } = PPC.CREATE_PAGE;
const list = new Intl.ListFormat(S.LIST_LOCALE, { type: 'conjunction' });
// Date.getDay() order.
const WEEKDAYS: PlanRepeatDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MINUTES_PER_HOUR = 60;

const formatPlanTime = (value: Date | string): string => formatDateTime(value, S.TIME_FORMAT);

const clockMinutes = (clock: string): number => {
  const [hour, minute] = clock.split(':').map(Number);
  return hour * MINUTES_PER_HOUR + minute;
};

// Wall-clock only, for the Create outcome: the server computes the real windows, daylight saving included.
const insideRepeatWindow = (repeat: PlanRepeat, now: number): boolean => {
  const wall = toZonedTime(new Date(now), repeat.timeZone);
  const minute = wall.getHours() * MINUTES_PER_HOUR + wall.getMinutes();
  const start = clockMinutes(repeat.startTime);
  const end = clockMinutes(repeat.endTime);
  const startsOn = (daysAgo: number) =>
    repeat.days.includes(WEEKDAYS[(wall.getDay() + WEEKDAYS.length - daysAgo) % WEEKDAYS.length]);
  if (start < end) return startsOn(0) && minute >= start && minute < end;
  return (startsOn(0) && minute >= start) || (startsOn(1) && minute < end);
};

// Approval comes first: a plan waiting for an approver deploys nothing on Create, whatever its window.
export const createOutcome = (
  {
    approvalMode,
    mode,
    timeRange,
    repeat,
  }: Pick<PreparePlanPayload, 'approvalMode' | 'mode' | 'timeRange' | 'repeat'>,
  now = Date.now(),
): CreateOutcome => {
  if (approvalMode === 'required') return 'approval';
  if (timeRange && Date.parse(timeRange.startAt) > now) return 'schedule';
  if (repeat && !insideRepeatWindow(repeat, now)) return 'schedule';
  return mode === 'enforce' ? 'enforce' : 'audit';
};

const PHASE_OUTCOME: Partial<Record<PlanPhase, CreateOutcome>> = {
  pending_approval: 'approval',
  scheduled: 'schedule',
};

// The created plan's phase, not the form's: the server decides whether a window is open.
export const createdMessage = (plan: ProtectionPlan): string => {
  const outcome = PHASE_OUTCOME[plan.phase] ?? (plan.mode === 'enforce' ? 'enforce' : 'audit');
  const start = plan.timeMode === 'repeating' ? plan.window?.startAt : plan.timeRange?.startAt;
  return CREATE_PANEL_TEXTS.TOASTS[outcome](plan.name, start ? formatPlanTime(start) : '');
};

interface PlanSummaryInput {
  values: FormValues;
  policies: PolicyEntry[];
  templates: PlanTemplate[];
  applicationOptions: { value: string; label: string }[];
}

const lowerFirst = (text: string): string => text.charAt(0).toLowerCase() + text.slice(1);

const whatSentence = ({ values, policies, templates }: PlanSummaryInput): string => {
  if (policies.length === 0) return S.NO_POLICIES;
  const operations = policies.map(({ templateID, params }) =>
    S.POLICY(
      lowerFirst(
        POLICY_CHIP_LABEL[templateID] ??
          templates.find((t) => t.id === templateID)?.name ??
          templateID,
      ),
      Object.values(params).flat().join(', '),
    ),
  );
  return (values.mode === 'enforce' ? S.REFUSE : S.RECORD)(list.format(operations));
};

const whereSentence = ({ values, applicationOptions }: PlanSummaryInput): string => {
  const byApplication = values.scopeType === 'applications';
  const targets = byApplication
    ? (values.applicationRefs ?? []).map(
        (ref) => applicationOptions.find((o) => o.value === ref)?.label ?? ref,
      )
    : (values.namespaces ?? []);
  if (targets.length === 0) return S.NO_TARGETS[values.scopeType];
  // Resource exclusions only apply to an applications scope (buildPreparePayload drops them).
  const excluded = [
    ...(values.excludedKinds ?? []).map(S.EXCLUDED_KIND),
    ...(byApplication ? (values.excludedResources ?? []) : [])
      .map(decodeResourceKey)
      .flatMap((r) => (r ? [S.EXCLUDED_RESOURCE(r.kind, r.name)] : [])),
  ];
  const except = excluded.length > 0 ? S.EXCEPT(list.format(excluded)) : '';
  return byApplication
    ? S.IN_APPLICATIONS(list.format(targets), except)
    : S.IN_NAMESPACES(targets.length, list.format(targets), except);
};

const repeatSentence = (values: FormValues): string => {
  const repeat = repeatPayload(values);
  if (repeat.days.length === 0 || !repeat.startTime || !repeat.endTime) return S.NO_REPEAT;
  return S.REPEATING(
    list.format(repeatDayLabels(repeat)),
    repeat.startTime,
    repeat.endTime,
    repeat.timeZone,
  );
};

const whenSentence = ({ values }: PlanSummaryInput): string => {
  if (values.timeMode === 'repeating') return repeatSentence(values);
  if (values.timeMode !== 'time_range') return S.PERMANENT;
  if (!values.startAt || !values.endAt) return S.NO_WINDOW;
  const start = values.startAt.toDate();
  const zone = getTimeZone();
  return S.WINDOW(
    formatPlanTime(start),
    formatPlanTime(values.endAt.toDate()),
    S.ZONE(zone, formatTimeZoneOffset(zone, start)),
  );
};

const deploySentence = ({ approvalMode, timeMode }: FormValues): string => {
  const repeating = timeMode === 'repeating';
  if (approvalMode === 'required') {
    return repeating ? FORM.APPROVAL_HELP_REQUIRED_SERIES : FORM.APPROVAL_HELP_REQUIRED;
  }
  return repeating ? S.REPEATING_DEPLOY : FORM.APPROVAL_HELP_AUTOMATIC;
};

// The Create panel's "This plan will": what is refused or recorded, where, when, and who deploys it.
export const planSummary = (input: PlanSummaryInput): string =>
  [
    whatSentence(input),
    whereSentence(input),
    whenSentence(input),
    deploySentence(input.values),
  ].join(' ');
