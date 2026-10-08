import { format, parse, subDays } from 'date-fns';
import { DEFAULT_COLORS, STATUS_COLORS, TIME_FORMATS } from '../../../constants';
import { toDateKey, toZonedTime } from '../../../utils/shared/time';
import type { Application } from '../../applications/models';
import type { ProtectionPlan } from '../../plans/protection/models';
import { HOME_CHART_LAYOUT as C, HOME_CHART_TEXTS as CT } from '../constants/dashboard';
import type { ActivityChartData, ActivityEvent, PlanEventKey, SeverityKey } from '../models';

const KNOWN_SEVERITIES: SeverityKey[] = ['critical', 'high', 'medium', 'low'];
const SEVERITY_KEYS: SeverityKey[] = [...KNOWN_SEVERITIES, 'other'];

const PLAN_EVENT_KEYS: PlanEventKey[] = ['created', 'started', 'terminated'];

// Shared G2 styling so every chart sits on the box surface with the same quiet chrome.
export const CHART_THEME = { type: 'classicDark', view: { viewFill: 'transparent' } };

export const CHART_AXIS_LABEL = {
  title: false,
  line: false,
  tick: false,
  labelFill: DEFAULT_COLORS.TEXT_MUTED,
  labelFillOpacity: 1,
  labelFontSize: C.AXIS_FONT_SIZE_PX,
};

export const CHART_LEGEND = {
  itemMarker: 'circle',
  itemLabelFill: DEFAULT_COLORS.TEXT_MUTED,
  itemLabelFillOpacity: 1,
  itemLabelFontSize: C.LEGEND_FONT_SIZE_PX,
};

export const CHART_TOOLTIP_CSS = {
  '.g2-tooltip': {
    background: DEFAULT_COLORS.SURFACE_ELEVATED_HOVER,
    border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
    color: DEFAULT_COLORS.TEXT_PRIMARY,
    boxShadow: 'none',
  },
  '.g2-tooltip-title': { color: DEFAULT_COLORS.TEXT_PRIMARY },
  '.g2-tooltip-list-item-name-label': { color: DEFAULT_COLORS.TEXT_MUTED },
  '.g2-tooltip-list-item-value': { color: DEFAULT_COLORS.TEXT_PRIMARY },
};

// Days are bucketed in the user's time zone and zero-filled so every curve spans the whole window.
// Only series with events get a curve and a legend entry; each keeps its fixed color.
const dailyActivity = <K extends string>(
  events: ActivityEvent<K>[],
  order: K[],
  labels: Record<K, string>,
  colors: Record<K, string>,
): ActivityChartData => {
  const today = toZonedTime(new Date());
  const days = Array.from({ length: C.ACTIVITY_DAYS }, (_, index) =>
    format(subDays(today, C.ACTIVITY_DAYS - 1 - index), TIME_FORMATS.DATE_KEY),
  );
  const countsByKey = new Map<K, Map<string, number>>();
  events.forEach(({ at, key }) => {
    const day = toDateKey(at);
    if (!days.includes(day)) return;
    const countsByDay = countsByKey.get(key) ?? new Map<string, number>();
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
    countsByKey.set(key, countsByDay);
  });
  const keys = order.filter((key) => countsByKey.has(key));
  return {
    data: keys.flatMap((key) =>
      days.map((day) => ({
        date: parse(day, TIME_FORMATS.DATE_KEY, new Date()),
        series: labels[key],
        count: countsByKey.get(key)?.get(day) ?? 0,
      })),
    ),
    colors: {
      domain: keys.map((key) => labels[key]),
      range: keys.map((key) => colors[key]),
    },
  };
};

// Severities outside the backend's four are kept under "other" rather than dropped.
const bucketSeverity = (severity: string): SeverityKey => {
  const key = severity.toLowerCase() as SeverityKey;
  return KNOWN_SEVERITIES.includes(key) ? key : 'other';
};

export const changeActivityData = (apps: Application[]): ActivityChartData =>
  dailyActivity(
    apps
      .flatMap((app) => app.history.changeLog)
      .map(({ detectedAt, severity }) => ({ at: detectedAt, key: bucketSeverity(severity) })),
    SEVERITY_KEYS,
    CT.CHANGE_ACTIVITY.SEVERITIES,
    STATUS_COLORS.HOME_SEVERITY,
  );

export const planActivityData = (plans: ProtectionPlan[]): ActivityChartData =>
  dailyActivity(
    plans.flatMap((plan): ActivityEvent<PlanEventKey>[] => [
      { at: plan.createdAt, key: 'created' },
      { at: plan.startedAt, key: 'started' },
      { at: plan.terminatedAt, key: 'terminated' },
    ]),
    PLAN_EVENT_KEYS,
    CT.PLAN_ACTIVITY.EVENTS,
    STATUS_COLORS.HOME_PLAN_EVENT,
  );
