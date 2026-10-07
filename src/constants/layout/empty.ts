import type { CSSProperties } from 'react';
import { DEFAULT_COLORS } from '../shared/colors';

/** antd Empty classes in src/styles/antd.css, one per surface an empty state sits on. */
export const EMPTY_CLASS = {
  PAGE: 'tk-empty-page',
  PANEL: 'tk-empty-panel',
  SECTION: 'tk-empty-section',
  // Added to PAGE for the no-access page: a closer icon, and a two-line hint so the
  // card sits in the same place on every feature whatever the hint's length.
  NO_ACCESS: 'tk-empty-no-access',
} as const;

/** Buttons in a page empty state, primary and secondary alike. */
export const EMPTY_ACTION_STYLE: CSSProperties = {
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 600,
  background: DEFAULT_COLORS.SUCCESS,
  borderColor: DEFAULT_COLORS.SUCCESS,
  color: DEFAULT_COLORS.PAGE_BG,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: 'none',
};
