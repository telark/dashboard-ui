import { DEFAULT_COLORS } from './colors';

const {
  SUCCESS,
  DANGER,
  WARNING,
  INFO,
  INFO_STRONG,
  NEUTRAL,
  TEXT_MUTED,
  ICON_MUTED,
  ICON_SECONDARY,
} = DEFAULT_COLORS;

// Every status → color mapping in one place. Values are DEFAULT_COLORS accents (dots,
// tints, charts); `getPillColor` turns one into its pill color. `undefined` means the
// neutral pill.
export const STATUS_COLORS = {
  PLAN_PHASE: {
    active: SUCCESS,
    scheduled: WARNING,
    failed: DANGER,
    terminated: NEUTRAL,
    canceled: NEUTRAL,
    draft: NEUTRAL,
    pending_approval: WARNING,
  },
  PLAN_HEALTH: {
    unknown: NEUTRAL,
    healthy: SUCCESS,
    drifted: WARNING,
    degraded: DANGER,
  },
  VIOLATION_RESULT: {
    pass: SUCCESS,
    fail: DANGER,
    warn: WARNING,
    error: DANGER,
    skip: NEUTRAL,
  },
  // A report the plan wrote itself (at its end or cancellation) is final.
  PLAN_REPORT_TRIGGER: {
    end: SUCCESS,
    cancel: SUCCESS,
    manual: undefined,
  },
  APPLICATION_HEALTH: {
    healthy: SUCCESS,
    degraded: WARNING,
    down: DANGER,
  } as Readonly<Record<string, string>>,
  APPLICATION_COVERAGE: {
    active: SUCCESS,
    upcoming: WARNING,
  },
  ROLLBACK: {
    success: SUCCESS,
    failed: DANGER,
    inProgress: WARNING,
    pending: WARNING,
    aborted: undefined,
    unknown: undefined,
  },
  SNAPSHOT_DIFF: {
    add: SUCCESS,
    remove: DANGER,
    change: WARNING,
  },
  INSIGHT_SEVERITY: {
    critical: DANGER,
    warning: WARNING,
    info: TEXT_MUTED,
  },
  INSIGHT_STATE: {
    open: DANGER,
    updated: WARNING,
    stale: TEXT_MUTED,
    resolved: SUCCESS,
  },
  NOTIFICATION_SEVERITY: {
    info: INFO_STRONG,
    success: SUCCESS,
    warning: WARNING,
    error: DANGER,
  } as Readonly<Record<string, string>>,
  HOME_SEVERITY: {
    critical: DANGER,
    high: WARNING,
    medium: SUCCESS,
    low: ICON_SECONDARY,
    other: ICON_MUTED,
  },
  HOME_PLAN_EVENT: {
    created: INFO,
    started: SUCCESS,
    terminated: ICON_SECONDARY,
  },
} as const;
