import type React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';

export const ASSIGNED_CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
  padding: '5px 14px',
  background: DEFAULT_COLORS.BACKGROUND_LIGHT,
  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  borderLeft: `3px solid ${DEFAULT_COLORS.SUCCESS}`,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  cursor: 'default',
  minHeight: '48px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

export const ASSIGNED_LIST_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  overflowY: 'auto',
  width: '100%',
  padding: 0,
  boxSizing: 'border-box',
  alignItems: 'stretch',
};

export const ASSIGNED_EMPTY_STATE_STYLE: React.CSSProperties = {
  padding: '24px',
  textAlign: 'center',
  color: DEFAULT_COLORS.TEXT_MUTED,
};
