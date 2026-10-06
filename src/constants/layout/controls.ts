// The one definition every interactive control sizes from: antd buttons, inputs,
// selects and pickers via the tokens in App.tsx, and the app's own unstyled
// buttons via TOOLBAR_CONTROL. Border stays surface-aware (dark page vs white
// panel) in antd.css, so it is not part of this shared box style.
export const CONTROL_HEIGHT = 30;
export const CONTROL_RADIUS = 8;
export const CONTROL_FONT_SIZE = 14;

// Label to control in every form field: panel form items (antd.css) and settings fields.
export const FORM_LABEL_GAP = 4;

// CSS can't import this file: the gap is exposed as --form-label-gap on :root.
export const applyLayoutVariables = (root: HTMLElement = document.documentElement): void => {
  root.style.setProperty('--form-label-gap', `${FORM_LABEL_GAP}px`);
};

// Borderless icon-only row actions (snapshot rows, insight triage): a square this size.
export const ROW_ICON_BUTTON_SIZE = 28;

// Keyboard focus ring for the list row action buttons, which reset every style inline (index.css).
export const ROW_ACTION_CLASS = 'tk-row-action';

// Deliberate exception: the login and register pages run their own ConfigProvider
// and want taller controls. Overriding controlHeight there is the whole opt-out.
export const AUTH_CONTROL_HEIGHT = 40;
