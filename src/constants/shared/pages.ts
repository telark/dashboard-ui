import { CONTROL_HEIGHT, SPACING } from '../layout/controls';
import { Z_INDEX } from '../layout/zIndex';
import { DEFAULT_COLORS } from './colors';

/** Used by PageLayout and Settings so content (title + body) aligns across features. */
export const PAGE_CONTENT_LAYOUT = {
  // PageContainer's box, which a page empty state centers in (antd.css).
  CLASS_NAME: 'tk-page',
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

const LIST_CONTENT_GAP_PX = 32;
const LIST_TOOLBAR_PADDING = '8px 0';
const LIST_CONTENT_OFFSET_PX = -20;

/** List pages: the toolbar sticks under the app header while the list scrolls. */
export const LIST_PAGE = {
  TOOLBAR_Z_INDEX: Z_INDEX.STICKY,
  TOOLBAR_PADDING: LIST_TOOLBAR_PADDING,
  // The sticky wrapper's padding plus the page gap leaves too much air above the
  // list, so the content pulls back up by this much.
  CONTENT_OFFSET_PX: LIST_CONTENT_OFFSET_PX,
  LOADING_MIN_HEIGHT_PX: 240,
  CONTENT_GAP_PX: LIST_CONTENT_GAP_PX,
  // The row between the page header and the toolbar: the Plans and Insights tabs (antd Segmented
  // at CONTROL_HEIGHT), the Applications discovery status, or an empty slot.
  SUBHEADER_ROW_HEIGHT_PX: CONTROL_HEIGHT,
  // The toolbar's padding and row height already leave air under the subheader row, so it takes
  // back the page gap above it. Any closer and its sticky background would cover the row.
  SUBHEADER_TOOLBAR_OFFSET_PX: -LIST_CONTENT_GAP_PX,
  // The list table's selection column (App.tsx Table token); antd.css pins its cells to match.
  TABLE_SELECTION_COLUMN_WIDTH_PX: 23,
  // The details pages (Applications, Protection plans): the list toolbar's row, sticky, so the
  // actions sit where a list's do.
  DETAILS_STICKY_ROW_STYLE: {
    position: 'sticky',
    top: 0,
    zIndex: Z_INDEX.STICKY,
    background: DEFAULT_COLORS.PAGE_BG,
    padding: LIST_TOOLBAR_PADDING,
    marginTop: -LIST_CONTENT_GAP_PX,
  },
  // The page's name joins the sticky row once its header has scrolled this far under the app header.
  DETAILS_NAME_REVEAL_OFFSET_PX: 48,
  DETAILS_NAME_REVEAL_DURATION_S: 0.18,
  // Their cards. List pages get the gap from their container; here the row shares this block.
  DETAILS_SECTIONS_STYLE: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.XL,
    marginTop: LIST_CONTENT_GAP_PX + LIST_CONTENT_OFFSET_PX,
  },
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
} as const;
