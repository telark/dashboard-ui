import React from 'react';
import type { TableColumnType } from 'antd';
import type { FilterSectionConfig } from './filters';
import type { ToolbarConfig } from './toolbar';
import type { TablePaginationConfig } from './table';

export interface PageLayoutConfig<T = unknown> {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; to?: string; onClick?: () => void }>;
  filterSection?: FilterSectionConfig;
  toolbar?: ToolbarConfig;
  columns: TableColumnType<T>[];
  data: T[];
  rowKey: string | ((record: T) => string);
  pagination: TablePaginationConfig;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (keys: React.Key[]) => void;
  };
  onRowClick?: (record: T) => void;
  containerStyle?: React.CSSProperties;
  rowHeight?: number;
  empty?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
