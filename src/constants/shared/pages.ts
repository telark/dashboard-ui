import { HEADER_LAYOUT } from '../layout/header';

/** Used by PageLayout and Settings so content (title + body) aligns across features. */
export const PAGE_CONTENT_LAYOUT = {
  HEADER_OFFSET_PX: HEADER_LAYOUT.HEIGHT_PX,
  /** List pages (Users, Roles) use containerStyle marginTop 0 so title is at this offset. */
  PADDING_TOP_PX: 100,
  PADDING: '100px 48px 48px',
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
} as const;

export const SHARED_PAGE_CONSTANTS = {
  UI: {
    ICON_SIZE: 56,
    ICON_FONT_SIZE: 24,
    MARGIN_BOTTOM: 12,
    MAX_WIDTH: 500,
    EMPTY_STATE_MAX_WIDTH: 560,
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
    EMPTY_STATE_CONTAINER: {
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    EMPTY_ICON: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      color: '#20C997',
      fontSize: 24,
    },
  },
} as const;
