import React from 'react';
import type { TableColumnType } from 'antd';
import type { ListToolbarProps } from './toolbar';
import type { TablePaginationConfig } from './table';

export interface PageLayoutConfig<T = unknown> {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; to?: string; onClick?: () => void }>;
  listToolbar: ListToolbarProps;
  columns: TableColumnType<T>[];
  data: T[];
  rowKey: string | ((record: T) => string);
  pagination: TablePaginationConfig;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (keys: React.Key[]) => void;
  };
  onRowClick?: (record: T) => void;
  rowHeight?: number;
  empty?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
