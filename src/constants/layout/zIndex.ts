// Stacking order, lowest first. The header sits below the panel backdrop so an open panel dims it.
export const Z_INDEX = {
  SIDEBAR: 1,
  SIDEBAR_RESIZE: 2,
  STICKY: 5,
  SECTION_OVERLAY: 10,
  HEADER: 100,
  PANEL_BACKDROP: 1000,
  PANEL: 1001,
  MODAL: 1100,
  APP_ERROR: 9999,
} as const;
