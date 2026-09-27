import React, { type ReactNode } from 'react';
import type { TopPanelToolbarActions } from '../../../../interfaces/layout/panels';

export interface ViewAvatar {
  key: string;
  src?: string;
  fallback?: string;
  tooltip: string;
}

export interface ViewOverflowItem {
  key: string;
  src?: string;
  username: string;
}

export interface ViewDetailRow {
  label: string;
  value: ReactNode;
}

// ViewPanel hands these to the frame's toolbar unchanged.
export type ViewPanelActions = TopPanelToolbarActions;

export interface ViewPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  name: string;
  description?: string;
  avatars?: ViewAvatar[];
  overflowItems?: ViewOverflowItem[];
  width?: number;
  details?: ViewDetailRow[];
  extraContent?: ReactNode;
  actions?: ViewPanelActions;
}

export interface ViewPanelDetailsProps {
  details?: ViewDetailRow[];
}

export interface ViewPanelHeaderProps {
  icon?: React.ReactNode;
  name: string;
  description?: string;
  avatars?: ViewAvatar[];
  overflowItems?: ViewOverflowItem[];
  maxVisibleAvatars?: number;
}
