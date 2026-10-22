import { DEFAULT_COLORS } from './colors';

const {
  SUCCESS,
  DANGER,
  WARNING,
  NEUTRAL,
  TEXT_SECONDARY,
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
    scheduled: NEUTRAL,
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
    degraded: WARNING,
  },
  // An audit plan only records what it would refuse, so it never reads as a red refusal.
  PLAN_MODE: {
    audit: WARNING,
    enforce: DANGER,
  },
  VIOLATION_RESULT: {
    pass: SUCCESS,
    fail: DANGER,
    warn: WARNING,
    error: DANGER,
    skip: NEUTRAL,
  },
  // What wrote the report, not how the plan went, so every trigger is the neutral pill.
  PLAN_REPORT_TRIGGER: {
    end: undefined,
    cancel: undefined,
    manual: undefined,
    window: undefined,
  },
  APPLICATION_HEALTH: {
    healthy: SUCCESS,
    degraded: WARNING,
    down: DANGER,
  } as Readonly<Record<string, string>>,
  // App History dots: only incidents and recoveries carry a status.
  APPLICATION_CHANGE: {
    incident: DANGER,
    recovery: SUCCESS,
    other: NEUTRAL,
  },
  // The one colored chip on a History entry, never blue. Low has no key: the neutral pill.
  APPLICATION_CHANGE_SEVERITY: {
    critical: DANGER,
    high: DANGER,
    medium: WARNING,
  } as Readonly<Record<string, string>>,
  // Unprotected is the risk, the one filled pill. The rest are outlines in these colors: the
  // nominal Protected in green, auditing and pending in two neutral tones.
  APPLICATION_COVERAGE: {
    enforcing: SUCCESS,
    auditing: TEXT_SECONDARY,
    upcoming: TEXT_MUTED,
    none: WARNING,
  },
  ROLLBACK: {
    success: SUCCESS,
    failed: DANGER,
    inProgress: NEUTRAL,
    pending: WARNING,
    aborted: undefined,
    unknown: undefined,
  },
  SNAPSHOT_DIFF: {
    add: SUCCESS,
    remove: DANGER,
    change: WARNING,
  },
  USER_STATE: {
    active: SUCCESS,
    suspended: DANGER,
  } as Readonly<Record<string, string>>,
  // A pending break-glass request waits on the bootstrap account, so it is the one that asks for attention.
  BOOTSTRAP_REQUEST: {
    pending: WARNING,
    approved: SUCCESS,
    canceled: undefined,
    completed: SUCCESS,
  } as Readonly<Record<string, string | undefined>>,
  INSIGHT_SEVERITY: {
    critical: DANGER,
    warning: WARNING,
    info: TEXT_MUTED,
  },
  // Text with a dot, never red or amber: those, and the gray pill, mean severity.
  INSIGHT_STATE: {
    open: NEUTRAL,
    updated: NEUTRAL,
    stale: TEXT_MUTED,
    resolved: SUCCESS,
  },
  NOTIFICATION_SEVERITY: {
    info: NEUTRAL,
    success: SUCCESS,
    warning: WARNING,
    error: DANGER,
  } as Readonly<Record<string, string>>,
  // History's map (APPLICATION_CHANGE_SEVERITY); the chart dashes the high line apart from critical.
  HOME_SEVERITY: {
    critical: DANGER,
    high: DANGER,
    medium: WARNING,
    low: ICON_SECONDARY,
    other: ICON_MUTED,
  },
  HOME_PLAN_EVENT: {
    created: NEUTRAL,
    started: SUCCESS,
    terminated: ICON_SECONDARY,
  },
} as const;
