import { DEFAULT_COLORS, getPillColor } from '../shared/colors';

// Pills are antd Tags. These tokens give them the pill box and colors; the TAG_CLASS
// rules in src/styles/antd.css cover what no Tag token reaches.
export const TAG_THEME = {
  // Tag sizes its text from fontSizeSM; its padding is fixed, so TAG_CLASS.PILL sets it.
  fontSizeSM: 11,
  borderRadiusSM: 999,
  // Pills have no border.
  lineWidth: 0,
  colorBgSolid: getPillColor(),
  solidTextColor: DEFAULT_COLORS.PILL_TEXT,
  colorTextLightSolid: DEFAULT_COLORS.PILL_TEXT,
} as const;

/** `PILL` is set on every Tag by the ConfigProvider; the others are per-Tag modifiers. */
export const TAG_CLASS = {
  PILL: 'tk-pill',
  MEDIUM: 'tk-pill-md',
  XSMALL: 'tk-pill-xs',
  AS_IS: 'tk-pill-as-is',
  TRUNCATE: 'tk-pill-truncate',
  // Snapshot and rollback metadata: a lighter, tighter neutral pill.
  META: 'tk-pill-meta',
  // Children laid out in a row (an icon or spinner before the label).
  ICON: 'tk-pill-icon',
} as const;
