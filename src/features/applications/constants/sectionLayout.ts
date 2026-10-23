import { DEFAULT_COLORS, MONOSPACE_CLASS, ROW_ICON_BUTTON_SIZE } from '../../../constants';
import { SETTINGS_CONSTANTS } from '../../settings/constants';

/** Applications feature: spacing and dividers aligned with settings/content tokens. */
export const APPLICATION_SECTION_LAYOUT = {
  CARD_RADIUS: SETTINGS_CONSTANTS.CONTENT.CARD_BORDER_RADIUS,
  CARD_PADDING: SETTINGS_CONSTANTS.CONTENT.CARD_PADDING,
  FIELD_LABEL_FONT_SIZE: 11,
  FIELD_VALUE_FONT_SIZE: 13,
  COLUMN_INNER_RADIUS: SETTINGS_CONSTANTS.CONTENT.CARD_BORDER_RADIUS,
  TAG_CLOUD_MAX_HEIGHT_PX: 120,
  /** Env var names listed before the "+N" link that expands the rest. */
  ENV_MAX_VISIBLE: 9,
} as const;

/** Inline manifest reader shown inside the manage-snapshots panel. */
export const APPLICATION_MANIFEST_VIEW = {
  RADIUS_PX: 10,
  HEADER_PADDING: '6px 6px 6px 10px',
  HEADER_GAP_PX: 8,
  TITLE_FONT_SIZE_PX: 12,
  CODE_PADDING: '10px 12px',
  CODE_FONT_SIZE_PX: 12,
  CODE_LINE_HEIGHT: 1.5,
  /** Leaves the panel header and the reader's own header visible while scrolling. */
  CODE_MAX_HEIGHT: 'calc(100vh - 260px)',
  CODE_MIN_HEIGHT_PX: 200,
  STATE_PADDING: '28px 20px',
  STATE_GAP_PX: 8,
  STATE_ICON_SIZE_PX: 26,
  STATE_TITLE_FONT_SIZE_PX: 13,
  STATE_TEXT_FONT_SIZE_PX: 12,
  STATE_MAX_WIDTH_PX: 340,
  DETAIL_MAX_HEIGHT_PX: 96,
  DETAIL_PADDING: '6px 8px',
  DETAIL_RADIUS_PX: 6,
} as const;

/** A comparison needs two snapshots, so the action is pointless below this. */
export const MIN_SNAPSHOTS_FOR_COMPARE = 2;

/** Snapshot rows inside the (light-surfaced) manage-snapshots panel. */
export const APPLICATION_SNAPSHOT_ROW = {
  PADDING: '10px 12px',
  RADIUS_PX: 10,
  GAP_PX: 8,
  ROW_SPACING_PX: 6,
  TITLE_FONT_SIZE_PX: 13,
  META_FONT_SIZE_PX: 12,
  ICON_BUTTON_SIZE_PX: ROW_ICON_BUTTON_SIZE,
  TRANSITION: 'background 150ms ease, border-color 150ms ease',
  /** Raw engine errors are opt-in: they are long and only useful when debugging. */
  ERROR_PADDING: '6px 8px',
  ERROR_RADIUS_PX: 6,
  ERROR_MAX_HEIGHT_PX: 120,
  ERROR_FONT_SIZE_PX: 11,
} as const;

/** Sticky details toolbar: identity on the left, actions on the right. */
export const APPLICATION_DETAILS_TOOLBAR = {
  IDENTITY_GAP_PX: 8,
  NAME_FONT_SIZE_PX: 13,
  META_FONT_SIZE_PX: 12,
  /** A last sync older than this reads as a warning. */
  SYNC_STALE_MS: 24 * 60 * 60 * 1000,
} as const;

/** Resource usage: usage meters against the limit or request, one row per workload. */
export const APPLICATION_WORKLOAD_METRICS = {
  ROW_GAP_PX: 6,
  ROW_PADDING: '10px 12px',
  ROW_RADIUS_PX: 10,
  HEADER_GAP_PX: 8,
  METER_LABEL_WIDTH_PX: 34,
  METER_HEIGHT_PX: 6,
  METER_RADIUS_PX: 999,
  METER_GAP_PX: 10,
  METER_ROW_GAP_PX: 6,
  METER_VALUE_FONT_SIZE_PX: 11,
  /** The bar stops growing here, so the value stays beside it on wide screens. */
  METER_MAX_WIDTH_PX: 280,
  METER_MIN_WIDTH_PX: 48,
  /** Request marker on the track, with a wider invisible hit area for its tooltip. */
  REQUEST_MARKER_WIDTH_PX: 2,
  REQUEST_MARKER_HIT_PX: 10,
  NAME_FONT_SIZE_PX: 13,
  LABEL_FONT_SIZE_PX: 11,
  /** Share of the limit from which usage turns to warning, then above which to danger. */
  WARN_RATIO: 0.7,
  DANGER_RATIO: 0.9,
  PAGE_SIZE: 5,
  PAGINATION_GAP_PX: 12,
  MAX_INSTANCES: 3,
  MAX_CONTAINERS: 4,
  DETAIL_INDENT_PX: 12,
  /** Containers are indented under their pod so the ownership is visible. */
  CONTAINER_INDENT_PX: 16,
  CONTAINER_DOT_SIZE_PX: 4,
  POD_BLOCK_GAP_PX: 10,
  DETAIL_ROW_GAP_PX: 4,
} as const;

/** Resource section view modes; the choice is per-session, not persisted. */
export const APPLICATION_RESOURCE_VIEW = {
  GRAPH: 'graph',
  TREE: 'tree',
} as const;

/** Below this many resources the structure view opens first: the graph has little to show. */
export const APPLICATION_RESOURCE_LIST_DEFAULT_BELOW = 5;

export type ApplicationResourceView =
  (typeof APPLICATION_RESOURCE_VIEW)[keyof typeof APPLICATION_RESOURCE_VIEW];

/**
 * Resource tree: application -> kind -> resource, drawn with elbow connectors.
 * Same containment data as the radial graph, laid out as a project structure.
 */
export const APPLICATION_RESOURCE_TREE = {
  /** Horizontal offset of each level; also where the connector spine sits. */
  INDENT_PX: 22,
  SPINE_X_PX: 9,
  ELBOW_WIDTH_PX: 11,
  /** Vertical center of a node row, where its elbow meets the spine. */
  ROW_CENTER_PX: 15,
  ROW_GAP_PX: 2,
  LINE_WIDTH_PX: 1,
  KIND_ICON_SIZE_PX: 20,
  ICON_GLYPH_SIZE_PX: 12,
  ICON_RADIUS_PX: 6,
  NODE_GAP_PX: 8,
  NODE_PADDING: '5px 8px',
  LEAF_DOT_SIZE_PX: 5,
  ROOT_FONT_SIZE_PX: 13,
  KIND_FONT_SIZE_PX: 12,
  LEAF_FONT_SIZE_PX: 12,
  COUNT_FONT_SIZE_PX: 11,
} as const;

/**
 * Radial resource graph: the application sits at the center, each kind on a ring
 * around it, and that kind's resources orbit their kind node. The API exposes no
 * owner references, so only this containment is drawn — never inferred edges.
 */
export const APPLICATION_RESOURCE_GRAPH = {
  /** Ring radius grows with the kind count so nodes never overlap. */
  RING_RADIUS_MIN_PX: 96,
  RING_RADIUS_PER_KIND_PX: 11,
  /** Kind pills hang outward from the ring, so the canvas is wider than it is tall. */
  CANVAS_PADDING_X_PX: 150,
  CANVAS_PADDING_Y_PX: 44,
  /** Marks where an edge meets a kind pill, so the join reads as connected. */
  CONNECTOR_DOT_SIZE_PX: 5,
  /** Below this |cos| a node counts as top/bottom rather than left/right. */
  VERTICAL_ANCHOR_THRESHOLD: 0.35,
  /** Sized to hold the application name rather than an icon. */
  CENTER_SIZE_PX: 68,
  CENTER_PADDING_PX: 8,
  CENTER_FONT_SIZE_PX: 11,
  CENTER_LINE_HEIGHT: 1.2,
  KIND_ICON_SIZE_PX: 20,
  KIND_GLYPH_SIZE_PX: 12,
  KIND_FONT_SIZE_PX: 12,
  KIND_COUNT_FONT_SIZE_PX: 11,
  KIND_NODE_PADDING: '5px 9px',
  KIND_NODE_RADIUS_PX: 999,
  KIND_NODE_GAP_PX: 7,
  EDGE_WIDTH_PX: 1,
  DIM_OPACITY: 0.25,
  /** Resource names listed in a kind node's tooltip before it is truncated. */
  TOOLTIP_NAME_LIMIT: 12,
} as const;

/** Change history: an entry shows three one-line changes until it is expanded. */
export const APPLICATION_CHANGE_LIST = {
  VISIBLE_ROWS: 3,
  /** No change line runs the full card width: a long value ellipsizes here until expanded. */
  LINE_MAX_WIDTH: '72ch',
} as const;

/** Change lines: rows sit on the dark card, the panel is a light surface that wraps long values. */
export const APPLICATION_CHANGE_LINE_PALETTE = {
  CARD: {
    text: DEFAULT_COLORS.TEXT_PRIMARY,
    muted: DEFAULT_COLORS.TEXT_MUTED,
    valueClass: undefined,
    wrap: 'anywhere',
    maxWidth: APPLICATION_CHANGE_LIST.LINE_MAX_WIDTH,
  },
  PANEL: {
    text: DEFAULT_COLORS.TEXT_ON_SURFACE,
    muted: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    valueClass: MONOSPACE_CLASS,
    wrap: 'anywhere',
    maxWidth: undefined,
  },
} as const;
