import type React from 'react';

export interface DataTableProps<T> {
  columns: any[];
  data: T[];
  rowKey: string | ((record: T) => string);
  rowHeight?: number;
  className?: string;
  containerStyle?: React.CSSProperties;
  tableProps?: Record<string, any>;
  onRowClick?: (record: T) => void;
}

export interface RowTagProps {
  text: string;
  background: string;
  color: string;
  fontSize?: number;
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
  onPageSizeChange: (size: number) => void;
  pageSizeOptions: number[];
  showRowsLabel?: string;
}
