import { HEADER_LAYOUT } from '../layout/header';

/** Used by PageLayout and Settings so content (title + body) aligns across features. */
export const PAGE_CONTENT_LAYOUT = {
  HEADER_OFFSET_PX: HEADER_LAYOUT.HEIGHT_PX,
  /** List pages (Users, Roles) use containerStyle marginTop 0 so title is at this offset. */
  PADDING_TOP_PX: 100,
  PADDING: '100px 48px 48px',
  PADDING_HORIZONTAL_AND_BOTTOM_PX: 48,
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
