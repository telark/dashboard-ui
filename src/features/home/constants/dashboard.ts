import type React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import type { PlanEventKey, SeverityKey, TagTone } from '../models';

export const HOME_DASHBOARD_TEXTS = {
  TITLE: 'Home',
  SUBTITLE: 'Application health, protection, and storage at a glance.',
  VIEW_ALL: 'View all',
  LOAD_FAILED: 'Could not load this data.',
  META_SEPARATOR: ' · ',
  CLUSTER: {
    TITLE: 'Cluster',
    VERSION_LABEL: 'Version',
    DISTRIBUTION_LABEL: 'Distribution',
    FULL_LABEL: 'Full Version',
    VANILLA: 'Vanilla',
    UNKNOWN: '—',
  },
  APPLICATIONS: {
    TITLE: 'Applications',
    HEALTHY: 'Healthy',
    DEGRADED: 'Degraded',
    DOWN: 'Down',
    DRIFTED: 'Drifted',
  },
  PLANS: {
    TITLE: 'Protection Plans',
    ACTIVE: 'Active',
    DRIFTED: 'Drifted',
    DEGRADED: 'Degraded',
    FAILED: 'Failed',
  },
  STORAGE: {
    TITLE: 'Snapshot Storage',
    USED: 'used',
    SNAPSHOTS: 'snapshots',
    OF: 'of',
    MB: 'MB',
  },
  PLANS_ATTENTION: {
    TITLE: 'Plans Needing Attention',
    EMPTY: 'No failed, degraded, or drifted plans.',
  },
  RECENT_CHANGES: {
    TITLE: 'Recently Changed',
    EMPTY: 'No changes detected yet.',
    CHANGE: 'change',
    CHANGES: 'changes',
    INCIDENT: 'incident',
    INCIDENTS: 'incidents',
  },
} as const;

export const HOME_CHART_TEXTS = {
  AXIS_DATE_FORMAT: 'MMM d',
  PLAN_ACTIVITY: {
    TITLE: 'Plan Activity · Last 30 Days',
    EMPTY: 'No plans created, started, or terminated in the last 30 days.',
    EVENTS: {
      created: 'Created',
      started: 'Started',
      terminated: 'Terminated',
    } as Record<PlanEventKey, string>,
  },
  CHANGE_ACTIVITY: {
    TITLE: 'Change Activity · Last 30 Days',
    EMPTY: 'No changes in the last 30 days.',
    SEVERITIES: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      other: 'Other',
    } as Record<SeverityKey, string>,
  },
} as const;

export const HOME_DASHBOARD_LAYOUT = {
  GRID_GAP_PX: 16,
  // Every box shares one track width and one row height so the grid reads as even rows.
  BOX_MIN_WIDTH_PX: 250,
  BOX_HEIGHT_PX: 156,
  BOX_PADDING_PX: 12,
  BOX_RADIUS_PX: 8,
  BOX_HEADER_GAP_PX: 8,
  BOX_TITLE_FONT_SIZE_PX: 15,
  BIG_VALUE_FONT_SIZE_PX: 28,
  BIG_VALUE_CAPTION_GAP_PX: 6,
  BREAKDOWN_GAP_PX: 12,
  DOT_SIZE_PX: 8,
  ROW_PADDING: '4px 6px',
  ROW_RADIUS_PX: 8,
  ROW_GAP_PX: 10,
  ROW_TITLE_FONT_SIZE_PX: 13,
  TEXT_FONT_SIZE_PX: 12,
  TAG_FONT_SIZE_PX: 11,
  SECTION_GAP_PX: 8,
  SPINNER_SIZE_PX: 24,
  LIST_LIMIT: 2,
} as const;

export const HOME_CHART_LAYOUT = {
  ROW_HEIGHT_PX: 260,
  ACTIVITY_DAYS: 30,
  LINE_WIDTH_PX: 2,
  AXIS_FONT_SIZE_PX: 11,
  LEGEND_FONT_SIZE_PX: 11,
  GRID_DASH: [3, 3] as number[],
  ANIMATION_MS: 450,
  POINT_SIZE_PX: 2.5,
  LINE_DASHES: [
    [0, 0],
    [6, 3],
    [2, 3],
    [8, 3, 2, 3],
  ] as number[][],
} as const;

export const HOME_SEVERITY_COLORS: Record<SeverityKey, string> = {
  critical: DEFAULT_COLORS.DANGER,
  high: DEFAULT_COLORS.WARNING,
  medium: DEFAULT_COLORS.SUCCESS,
  low: DEFAULT_COLORS.ICON_SECONDARY,
  other: DEFAULT_COLORS.ICON_MUTED,
};

export const HOME_PLAN_EVENT_COLORS: Record<PlanEventKey, string> = {
  created: DEFAULT_COLORS.CHIP_BLUE_TEXT,
  started: DEFAULT_COLORS.SUCCESS,
  terminated: DEFAULT_COLORS.ICON_SECONDARY,
};

export const HOME_DASHBOARD_POLLING = {
  DEFAULT_INTERVAL_SEC: 60,
  MIN_INTERVAL_SEC: 5,
} as const;

export const HOME_TAG_TONE_COLORS: Record<TagTone, { background: string; color: string }> = {
  danger: { background: DEFAULT_COLORS.DANGER_TINT, color: DEFAULT_COLORS.DANGER },
  warning: { background: DEFAULT_COLORS.WARNING_TINT, color: DEFAULT_COLORS.WARNING },
  neutral: { background: DEFAULT_COLORS.CHIP_CUSTOM_BG, color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT },
};

const ELLIPSIS: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const HOME_DASHBOARD_STYLES = {
  ELLIPSIS,
  MUTED_TEXT: {
    fontSize: HOME_DASHBOARD_LAYOUT.TEXT_FONT_SIZE_PX,
    color: DEFAULT_COLORS.TEXT_MUTED,
  } as React.CSSProperties,
} as const;
