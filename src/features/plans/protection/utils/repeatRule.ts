import type { PlanRepeat } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const { CARD } = PPC.LABELS;

export const repeatDayLabels = (repeat: PlanRepeat): string[] =>
  PPC.CREATE_PAGE.REPEAT_DAY_OPTIONS.filter(({ value }) => repeat.days.includes(value)).map(
    ({ label }) => label,
  );

export const formatRepeatRule = (repeat: PlanRepeat): string =>
  CARD.REPEAT_RULE(
    repeatDayLabels(repeat).join(CARD.REPEAT_DAY_SEPARATOR),
    repeat.startTime,
    repeat.endTime,
    repeat.timeZone,
  );
