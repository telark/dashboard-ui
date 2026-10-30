import type React from 'react';
import { DatabaseOutlined } from '@ant-design/icons';
import {
  AiOutlineHistory,
  AiOutlineLineChart,
  AiOutlineRocket,
  AiOutlineWarning,
} from 'react-icons/ai';
import { SiKubernetes } from 'react-icons/si';
import { CARD_LAYOUT, DEFAULT_COLORS, Icons } from '../../../constants';
import { ALL_EXCLUDED, DISCOVERY_LABELS_HINT } from '../../applications';
import type { PlanEventKey, SeverityKey } from '../models';

export const HOME_DASHBOARD_TEXTS = {
  TITLE: 'Home',
  SUBTITLE: 'Which applications are healthy, what is protected, and what changed recently.',
  VIEW_ALL: 'View all',
  LOAD_FAILED: 'Could not load this data.',
  META_SEPARATOR: ' · ',
  CLUSTER: {
    TITLE: 'Cluster',
    FULL_LABEL: 'Full version',
    VANILLA: 'Vanilla',
  },
  APPLICATIONS: {
    TITLE: 'Applications',
    HEALTHY: 'Healthy',
    DEGRADED: 'Degraded',
    DOWN: 'Down',
    UNKNOWN: 'Unknown',
    DRIFTED: 'Drifted',
  },
  PLANS: {
    TITLE: 'Protection plans',
    ACTIVE: 'Active',
    SCHEDULED: 'Scheduled',
    DRIFTED: 'Drifted',
    DEGRADED: 'Degraded',
    FAILED: 'Failed',
  },
  STORAGE: {
    TITLE: 'Storage',
    SNAPSHOTS: 'Snapshots',
    REPORTS: 'Reports',
    SNAPSHOT_COUNT: (count: number) => `${count} ${count === 1 ? 'snapshot' : 'snapshots'}`,
    REPORT_COUNT: (count: number) => `${count} ${count === 1 ? 'report' : 'reports'}`,
    MB: 'MB',
    NO_ACCESS: 'You do not have permission to view this.',
  },
  PLANS_ATTENTION: {
    TITLE: 'Plans with issues',
    EMPTY: 'No failed, degraded, or drifted plans.',
    NO_PLANS: 'No protection plans yet. Nothing is protected.',
  },
  NEEDS_ATTENTION: {
    TITLE: 'Needs attention',
    CRITICAL_OPEN: (count: number) =>
      `${count} critical ${count === 1 ? 'incident' : 'incidents'} open`,
    OPEN: (count: number) => `${count} ${count === 1 ? 'incident' : 'incidents'} open`,
    ALL_CLEAR: 'All clear',
    // Without settings read the automatic-analysis switch is unknown, so "All clear" can't be claimed.
    NONE_OPEN: 'No open incidents',
    CHECKED: 'checked',
  },
  GET_STARTED: {
    TITLE: 'Get started',
    DISCOVER: {
      TITLE: 'Discover applications',
      SCANNING: (count: number) =>
        `Scanning, ${count} ${count === 1 ? 'application' : 'applications'} found so far`,
      FOUND: (count: number) => `${count} ${count === 1 ? 'application' : 'applications'} found`,
      NONE: 'No applications found yet',
      LABELS_HINT: DISCOVERY_LABELS_HINT,
      ALL_EXCLUDED,
    },
    CREATE_PLAN: {
      TITLE: 'Create a protection plan',
      HELPER: 'Starts in Audit mode, so nothing is blocked.',
    },
    WATCH: {
      TITLE: 'Watch what changes',
      HELPER: 'Every change is recorded, field by field.',
    },
  },
  RECENT_CHANGES: {
    TITLE: 'Recently changed',
    EMPTY: 'No changes detected yet.',
    CHANGE: 'change',
    CHANGES: 'changes',
    INCIDENT: 'incident',
    INCIDENTS: 'incidents',
  },
} as const;

export const HOME_CHART_TEXTS = {
  AXIS_DATE_FORMAT: 'MMM d',
  RANGE: 'Last 30 days',
  PLAN_ACTIVITY: {
    TITLE: 'Plan activity',
    EMPTY: 'No plans created, started, or terminated in the last 30 days.',
    EVENTS: {
      created: 'Created',
      started: 'Started',
      terminated: 'Terminated',
    } as Record<PlanEventKey, string>,
  },
  CHANGE_ACTIVITY: {
    TITLE: 'Change activity',
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

// Applications, Protection plans and Needs attention reuse the sidebar icons, Storage the snapshot icon.
export const HOME_BOX_ICONS = {
  CLUSTER: SiKubernetes,
  APPLICATIONS: Icons.Application,
  PLANS: Icons.ProtectionPlans,
  NEEDS_ATTENTION: Icons.Insights,
  STORAGE: DatabaseOutlined,
  PLANS_ATTENTION: AiOutlineWarning,
  RECENT_CHANGES: AiOutlineHistory,
  ACTIVITY: AiOutlineLineChart,
  GET_STARTED: AiOutlineRocket,
} as const;

export const HOME_DASHBOARD_LAYOUT = {
  GRID_GAP_PX: CARD_LAYOUT.GRID_GAP_PX,
  // Every box in a row shares one track width and the row's height, set by its tallest box.
  BOX_MIN_WIDTH_PX: 250,
  // About a loaded body (a breakdown, a short list, an empty state), so a box barely moves when it loads.
  BOX_BODY_MIN_HEIGHT_PX: 64,
  // Smaller than the SECTION empty state's 32px: a box is a small surface.
  EMPTY_ICON_SIZE_PX: 24,
  // The View all link's line (14px at antd's 1.5714), so titles sit level with or without it.
  BOX_HEADER_MIN_HEIGHT_PX: 22,
  BOX_ICON_SIZE_PX: 16,
  BOX_ICON_GAP_PX: 6,
  BIG_VALUE_FONT_SIZE_PX: 28,
  BIG_VALUE_CAPTION_GAP_PX: 6,
  BREAKDOWN_GAP_PX: 12,
  ROW_PADDING: '4px 6px',
  // The hover runs into the box padding while the dot sits under the header icon.
  ROW_BLEED_PX: -6,
  ROW_RADIUS_PX: 8,
  ROW_GAP_PX: 10,
  ROW_TITLE_FONT_SIZE_PX: 13,
  TEXT_FONT_SIZE_PX: 12,
  SECTION_GAP_PX: 8,
  SPINNER_SIZE_PX: 24,
  LIST_LIMIT: 2,
  STEP_SPINNER_SIZE_PX: 12,
} as const;

export const HOME_CHART_LAYOUT = {
  ROW_HEIGHT_PX: 260,
  ACTIVITY_DAYS: 30,
  LINE_WIDTH_PX: 2,
  AXIS_FONT_SIZE_PX: 11,
  LEGEND_FONT_SIZE_PX: 11,
  GRID_DASH: [3, 3] as number[],
  ANIMATION_MS: 450,
  RESIZE_SETTLE_MS: 150,
  POINT_SIZE_PX: 2.5,
  LINE_DASHES: [
    [0, 0],
    [6, 3],
    [2, 3],
    [8, 3, 2, 3],
  ] as number[][],
} as const;

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
