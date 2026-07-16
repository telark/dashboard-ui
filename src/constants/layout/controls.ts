// The one definition every interactive control sizes from: antd buttons, inputs,
// selects and pickers via the tokens in App.tsx, and the app's own unstyled
// buttons via TOOLBAR_CONTROL. Border stays surface-aware (dark page vs white
// panel) in antd.css, so it is not part of this shared box style.
export const CONTROL_HEIGHT = 30;
export const CONTROL_RADIUS = 8;
export const CONTROL_FONT_SIZE = 14;

// Deliberate exception: the login and register pages run their own ConfigProvider
// and want taller controls. Overriding controlHeight there is the whole opt-out.
export const AUTH_CONTROL_HEIGHT = 40;
