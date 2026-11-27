import type React from 'react';
import type { TableColumnsType, TableProps } from 'antd';
import type { SortOrder } from '../../utils/layout/sort';

export interface DataTableProps<T> {
  columns: TableColumnsType<T>;
  data: T[];
  rowKey: string | ((record: T) => string);
  className?: string;
  containerStyle?: React.CSSProperties;
  tableProps?: TableProps<T>;
  empty?: React.ReactNode;
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
  sortOrder: SortOrder;
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
  /** antd's compact pager (current / total), for narrow pages. */
  simple?: boolean;
}
