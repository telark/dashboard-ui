import { DEFAULT_COLORS, PAGE_COLORS } from '../../../../constants';

const { dark } = PAGE_COLORS;

// The manifest viewer is a dark code editor in both themes.
export const IDE_MANIFEST_THEME = {
  bg: dark.PAGE_BG,
  border: dark.BORDER_ELEVATED,
  gutterText: dark.ICON_MUTED,
  headerBg: dark.SURFACE_ELEVATED,
  text: DEFAULT_COLORS.IDE_SYNTAX_TEXT,
  key: DEFAULT_COLORS.IDE_SYNTAX_KEY,
  string: DEFAULT_COLORS.IDE_SYNTAX_STRING,
  number: DEFAULT_COLORS.IDE_SYNTAX_NUMBER,
  keyword: DEFAULT_COLORS.IDE_SYNTAX_KEYWORD,
  punct: DEFAULT_COLORS.IDE_SYNTAX_TEXT,
  comment: DEFAULT_COLORS.IDE_SYNTAX_COMMENT,
  copyButton: DEFAULT_COLORS.IDE_SYNTAX_COPY_BUTTON,
} as const;
