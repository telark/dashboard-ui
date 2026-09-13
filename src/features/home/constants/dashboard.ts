import type React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import type { TagTone } from '../models';

export const HOME_DASHBOARD_TEXTS = {
  TITLE: 'Home',
  SUBTITLE: 'Application health, protection, and storage at a glance.',
  VIEW_ALL: 'View all',
  LOAD_FAILED: 'Could not load this data.',
  META_SEPARATOR: ' · ',
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
  APPLICATIONS_ATTENTION: {
    TITLE: 'Needs Attention',
    EMPTY: 'All applications are healthy and in sync.',
    REASONS: {
      down: 'Down',
      degraded: 'Degraded',
      syncFailed: 'Sync failed',
      drift: 'Drift',
    },
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
