import { TIME_FORMATS } from '../../../../../constants';
import { formatDateTime, getTimeZone } from '../../../../../utils/shared/time';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanViolationsResponse, ProtectionPlan } from '../../models';

const V = PPC.LABELS.VIOLATIONS;

const sinceText = (since: string): string =>
  PPC.LABELS.PHASE_INFO.IN_TIME_ZONE(
    formatDateTime(since, TIME_FORMATS.SHORT_DATE_TIME),
    getTimeZone(),
  );

// No run start (an older server, or a plan that hasn't started) means the list is the live hour.
export const windowNote = (plan: ProtectionPlan, data: PlanViolationsResponse | null): string => {
  if (!data?.since) return V.WINDOW_NOTE;
  const time = sinceText(data.since);
  const note = plan.timeMode === 'repeating' ? V.WINDOW_RUN_NOTE(time) : V.RUN_NOTE(time);
  return data.truncated ? `${note} ${V.TRUNCATED_NOTE}` : note;
};

export const emptyCopy = (
  plan: ProtectionPlan,
  data: PlanViolationsResponse | null,
): { title: string; body: string } => {
  const repeating = plan.timeMode === 'repeating';
  if (repeating && plan.phase === 'scheduled') {
    return { title: V.BETWEEN_WINDOWS_TITLE, body: V.BETWEEN_WINDOWS_BODY };
  }
  if (!data?.since) return { title: V.EMPTY_TITLE, body: V.EMPTY_BODY };
  const time = sinceText(data.since);
  return repeating
    ? { title: V.WINDOW_RUN_EMPTY_TITLE, body: V.WINDOW_RUN_EMPTY_BODY(time) }
    : { title: V.RUN_EMPTY_TITLE, body: V.RUN_EMPTY_BODY(time) };
};
