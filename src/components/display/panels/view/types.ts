import React, { type ReactNode } from 'react';
import type { TopPanelToolbarActions } from '../../../../interfaces/layout/panels';

export interface ViewDetailRow {
  label: string;
  value: ReactNode;
}

// ViewPanel hands these to the frame's toolbar unchanged.
export type ViewPanelActions = TopPanelToolbarActions;

export interface ViewPanelTab {
  key: string;
  label: string;
  count?: number;
  content: ReactNode;
}

export interface ViewPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  name: string;
  description?: string;
  width?: number;
  details?: ViewDetailRow[];
  actions?: ViewPanelActions;
  /** Tabs after a first Details tab that holds `details`. */
  tabs?: ViewPanelTab[];
}

export interface ViewPanelDetailsProps {
  details?: ViewDetailRow[];
}

export interface ViewPanelHeaderProps {
  icon?: React.ReactNode;
  name: string;
  description?: string;
}
