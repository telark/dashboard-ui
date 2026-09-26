import { DEFAULT_COLORS } from '../../../constants';

export const TABLE_DEFAULTS = {
  HEADER_BG: DEFAULT_COLORS.PAGE_BG,
  HEADER_ICON_GAP: 6,
  SORT_ICON_SIZE: 14,
  ICON_MUTED: DEFAULT_COLORS.TEXT_MUTED,
  SORT_ACTIVE: DEFAULT_COLORS.SUCCESS,
  SORT_INACTIVE: DEFAULT_COLORS.ICON_SECONDARY,
  HEADER_ALIGN_DEFAULT: 'center' as const,
  SELECT_COLUMN_WIDTH: 48,
  SCROLL_X: 1200,
} as const;

// Global so the accent applies wherever a list mounts its pagination.
export const PAGINATION_DEFAULTS = {
  CLASS_NAME: 'app-pagination',
  RANGE_GAP_PX: 12,
  SIZE_SELECT_WIDTH_PX: 80,
  SIZE_GAP_PX: 8,
  SHOW_ROWS_LABEL: 'Show rows',
  RANGE_SEPARATOR: '-',
  RANGE_OF: 'of',
} as const;
