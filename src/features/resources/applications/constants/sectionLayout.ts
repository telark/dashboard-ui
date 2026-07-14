import { DEFAULT_COLORS } from '../../../../constants';
import { SETTINGS_CONSTANTS } from '../../../settings/constants';

/** Applications feature: spacing and dividers aligned with settings/content tokens. */
export const APPLICATION_SECTION_LAYOUT = {
  STACK_GAP_PX: SETTINGS_CONSTANTS.CONTENT.GAP_BETWEEN_CARDS,
  CARD_RADIUS: SETTINGS_CONSTANTS.CONTENT.CARD_BORDER_RADIUS,
  CARD_PADDING: SETTINGS_CONSTANTS.CONTENT.CARD_PADDING,
  TITLE_TO_SUBTITLE_GAP_PX: SETTINGS_CONSTANTS.CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX,
  FIELD_LABEL_FONT_SIZE: 11,
  FIELD_VALUE_FONT_SIZE: 13,
  COLUMN_HEADER_FONT_SIZE: 12,
  SUBTLE_DIVIDER: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
  COLUMN_INNER_RADIUS: SETTINGS_CONSTANTS.CONTENT.CARD_BORDER_RADIUS,
  TAG_CLOUD_MAX_HEIGHT_PX: 120,
  STAT_MIN_WIDTH_PX: 120,
  /** RowTag display for runtime list values (ports, env keys, snapshot field tags). */
  RUNTIME_VALUE_ROW_TAG: {
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
    fontSize: 11,
  },
} as const;

/** Workload metrics: usage-vs-baseline meters, one row per workload. */
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
  /** Limit marker drawn on the meter track. */
  LIMIT_TICK_WIDTH_PX: 2,
  NAME_FONT_SIZE_PX: 13,
  LABEL_FONT_SIZE_PX: 11,
  /** Fraction of the limit above which usage turns amber, then red at 1. */
  WARN_RATIO: 0.85,
  PAGE_SIZE: 5,
  PAGINATION_CLASS: 'applications-pagination',
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
  /** Vertical centre of a node row, where its elbow meets the spine. */
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
 * Radial resource graph: the application sits at the centre, each kind on a ring
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
