import type React from 'react';
import type { TableColumnsType, TableProps } from 'antd';

export interface DataTableProps<T> {
  columns: TableColumnsType<T>;
  data: T[];
  rowKey: string | ((record: T) => string);
  rowHeight?: number;
  className?: string;
  containerStyle?: React.CSSProperties;
  tableProps?: TableProps<T>;
  onRowClick?: (record: T) => void;
  empty?: React.ReactNode;
}

export interface RowTagProps {
  text: string;
  /** Case colour (severity, status…); omitted means a neutral pill. */
  accent?: string;
  fontSize?: number;
  capitalize?: boolean;
  /** Ellipsizes to the container width instead of overflowing it. */
  truncate?: boolean;
}

export interface SortHeaderProps {
  label: string;
  align?: 'left' | 'center';
  leftIcon?: React.ReactNode;
  sortable?: boolean;
  isActive?: boolean;
  onSort?: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export interface GenerateColumnCtx {
  activeSortKey: string;
  onSort: (key: string) => void;
}

export interface TablePaginationConfig {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Omit both to hide the page-size select. */
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showRowsLabel?: string;
}
