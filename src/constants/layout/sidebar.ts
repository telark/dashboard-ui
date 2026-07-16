export const SIDEBAR_LAYOUT = {
  WIDTH_EXPANDED: 260,
  WIDTH_COLLAPSED: 52,
  WIDTH_MIN: 200,
  WIDTH_MAX: 330,
  // Dragging the edge narrower than this snaps the sidebar shut.
  COLLAPSE_THRESHOLD: 150,
  // Below this viewport width an expanded sidebar leaves too little room for the
  // content, so it stays collapsed and the toggle is unavailable.
  FORCE_COLLAPSE_BELOW: 768,
  CONTENT_TOP_PADDING: 10,
  CSS_VAR: '--sidebar-width',
  STORAGE_KEY: 'sidebar_collapsed',
  WIDTH_STORAGE_KEY: 'sidebar_width',
  COLLAPSED_EVENT: 'sidebarStateChanged',
  WIDTH_TRANSITION: 'width 200ms ease',
  RESIZE_HANDLE: {
    WIDTH: 5,
    CURSOR: 'col-resize',
    ARIA_LABEL: 'Resize sidebar',
  },
  TOGGLE: {
    // Matches HEADER_LAYOUT.LOGO.HEIGHT so the icon reads level with the logo.
    ICON_SIZE: 18,
    BUTTON_SIZE: 18,
    TRANSITION: 'color 150ms ease',
    SHORTCUT_KEY: 'b',
    SHORTCUT_LABEL_MAC: '⌘B',
    SHORTCUT_LABEL_DEFAULT: 'Ctrl+B',
    EXPAND_LABEL: 'Expand sidebar',
    COLLAPSE_LABEL: 'Collapse sidebar',
    SEPARATOR: '|',
    SEPARATOR_GAP: 12,
  },
} as const;

// The account row reuses BUTTON_CONFIGS.SIDEBAR_BUTTON so it matches the nav items.
export const SIDEBAR_USER_MENU = {
  AVATAR: {
    SIZE: 24,
  },
  USERNAME: {
    FONT_SIZE: 13,
    FONT_WEIGHT: 500,
  },
  CHEVRON: {
    SIZE: 14,
  },
  PLACEMENT: 'topRight' as const,
  FALLBACK_USERNAME: 'User',
  ARIA_LABEL: 'Account menu',
} as const;
