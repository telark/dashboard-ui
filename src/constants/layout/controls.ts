// The one definition every interactive control sizes from: antd buttons, inputs,
// selects and pickers via the tokens in App.tsx, and the app's own unstyled
// buttons via TOOLBAR_CONTROL. Border stays surface-aware (dark page vs white
// panel) in antd.css, so it is not part of this shared box style.
export const CONTROL_HEIGHT = 30;
export const CONTROL_RADIUS = 8;
export const CONTROL_FONT_SIZE = 14;
export const SELECT_LOADING_ICON_SIZE = 12;

// Label to control in every form field: panel form items (antd.css) and settings fields.
export const FORM_LABEL_GAP = 4;

// Between stacked form items (components.Form.itemMarginBottom in App.tsx).
export const FORM_ITEM_GAP = 16;

// CSS can't import this file: the gap is exposed as --form-label-gap on :root.
export const applyLayoutVariables = (root: HTMLElement = document.documentElement): void => {
  root.style.setProperty('--form-label-gap', `${FORM_LABEL_GAP}px`);
};

// Borderless icon-only row actions (snapshot rows, insight triage): a square this size.
export const ROW_ICON_BUTTON_SIZE = 28;

// Keyboard focus ring for the list row action buttons, which reset every style inline (index.css).
export const ROW_ACTION_CLASS = 'tk-row-action';

// How far the app's own buttons (toolbar, filter, search, row actions) dim when disabled.
export const DISABLED_OPACITY = 0.6;

// Deliberate exception: the login and register pages run their own ConfigProvider
// and want taller controls. Overriding controlHeight there is the whole opt-out.
export const AUTH_CONTROL_HEIGHT = 40;

// Spacing and radius scales for inline gaps, paddings, margins and corners. A value off the
// scale stays literal with a one-line reason.
export const SPACING = {
  NONE: 0,
  XXS: 2,
  XS: 4,
  S6: 6,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

export const RADIUS = {
  XS: 4,
  SM: 6,
  MD: CONTROL_RADIUS,
  LG: 12,
  PILL: 999,
} as const;
