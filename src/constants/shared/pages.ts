import { CONTROL_HEIGHT } from '../layout/controls';

/** Used by PageLayout and Settings so content (title + body) aligns across features. */
export const PAGE_CONTENT_LAYOUT = {
  /** List pages (Users, Roles) use containerStyle marginTop 0 so title is at this offset. */
  PADDING_TOP_PX: 45,
  PADDING: '45px 48px 48px',
  PADDING_HORIZONTAL_AND_BOTTOM_PX: 48,
} as const;

/** Page title, breadcrumb trail and subtitle shared by every feature page. */
export const PAGE_HEADER = {
  TITLE_FONT_SIZE_PX: 28,
  TITLE_FONT_WEIGHT: 700,
  SUBTITLE_FONT_SIZE_PX: 14,
  LINE_HEIGHT: 1.2,
  TITLE_GAP_PX: 8,
  BREADCRUMB_SEPARATOR: '/',
} as const;

/** List pages: the toolbar sticks under the app header while the list scrolls. */
export const LIST_PAGE = {
  TOOLBAR_Z_INDEX: 5,
  TOOLBAR_PADDING: '8px 0',
  // The sticky wrapper's padding plus the page gap leaves too much air above the
  // list, so the content pulls back up by this much.
  CONTENT_OFFSET_PX: -20,
  LOADING_MIN_HEIGHT_PX: 240,
  CONTENT_GAP_PX: 32,
  // The row between the page header and the toolbar: the Plans and Insights tabs (antd Segmented
  // at CONTROL_HEIGHT), the Applications discovery status, or an empty slot.
  SUBHEADER_ROW_HEIGHT_PX: CONTROL_HEIGHT,
} as const;

export const SHARED_PAGE_CONSTANTS = {
  UI: {
    ICON_SIZE: 56,
    ICON_FONT_SIZE: 24,
    MARGIN_BOTTOM: 12,
    MAX_WIDTH: 500,
    PROGRESS_BAR_HEIGHT: 8,
    PROGRESS_BAR_BORDER_RADIUS: 4,
  },
  LAYOUT: {
    LOADING_CONTAINER: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
    },
  },
} as const;
