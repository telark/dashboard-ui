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
    selectedKeys?: string[];
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

export interface CountLabel {
  one: string;
  other: string;
}

export interface ListToolbarProps {
  // Undefined until the list first loads: no count renders rather than a placeholder that widens.
  totalCount?: number;
  countSuffix: CountLabel;
  /** Measured row widths below which every control falls back to its icon. */
  // QUICK_FILTER folds the quick filter earlier than the buttons lose their labels.
  compactWidth: { DEFAULT: number; BULK: number; QUICK_FILTER?: number };
  filterChips?: FilterChip[];
  overflowChipsCount?: number;
  onRemoveFilterChip?: (key: string, value: string) => void;
  /** Feature-owned muted text right after the filter chips. */
  filterNote?: React.ReactNode;
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
