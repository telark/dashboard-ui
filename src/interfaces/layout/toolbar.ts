import React from 'react';
import { MenuProps } from 'antd';

export interface ToolbarButtonConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  /** Renders the icon alone; the label becomes the tooltip and the accessible name. */
  iconOnly?: boolean;
  dropdown?: {
    items: MenuProps['items'];
    onItemClick?: (key: string) => void;
  };
  component?: React.ReactNode;
}

export interface ToolbarSearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export interface ToolbarConfig {
  buttons: ToolbarButtonConfig[];
  search?: ToolbarSearchConfig;
}

export interface FilterChip {
  key: string;
  value: string;
  label: string;
}

export interface ListToolbarSelection {
  pageCount: number;
  selectedCount: number;
  allPageSelected?: boolean;
  /** Omit when the list has its own select-all (a table header); only the count shows. */
  onToggleSelectAllPage?: (checked: boolean) => void;
  label?: string;
}

export interface ListToolbarProps {
  totalCount: number;
  countSuffix: string;
  /** Measured row widths below which every control falls back to its icon. */
  compactWidth: { DEFAULT: number; BULK: number };
  filterChips?: FilterChip[];
  overflowChipsCount?: number;
  onRemoveFilterChip?: (key: string, value: string) => void;
  hasActiveFilters?: boolean;
  onClearAllFilters?: () => void;
  onOpenFilters?: () => void;
  bulkMode?: boolean;
  selection?: ListToolbarSelection;
  bulkActions?: ToolbarConfig;
  /** Feature-owned quick filter rendered before the filter button. */
  quickFilter?: (compact: boolean) => React.ReactNode;
  /** Right-hand toolbars, in order, after the filter button. */
  toolbars: ToolbarConfig[];
}
