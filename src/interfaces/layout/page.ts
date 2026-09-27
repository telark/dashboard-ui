import React from 'react';
import type { TableColumnType } from 'antd';
import type { ListToolbarProps } from './toolbar';
import type { TablePaginationConfig } from './table';

export interface PageLayoutConfig<T = unknown> {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; to?: string; onClick?: () => void }>;
  /** Page-level tabs rendered between the header and the toolbar. */
  tabs?: React.ReactNode;
  listToolbar: ListToolbarProps;
  columns: TableColumnType<T>[];
  data: T[];
  rowKey: string | ((record: T) => string);
  pagination: TablePaginationConfig;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (keys: React.Key[]) => void;
    /** Hides or disables the checkbox of rows that are not selectable (e.g. group headers). */
    getCheckboxProps?: (record: T) => { disabled?: boolean; style?: React.CSSProperties };
  };
  onRowClick?: (record: T) => void;
  rowHeight?: number;
  empty?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
