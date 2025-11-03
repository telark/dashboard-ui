export type GenericSortKey = string;
export interface DataTableProps<T> {
  columns: any[];
  data: T[];
  rowKey: string | ((record: T) => string);
  rowHeight?: number;
  className?: string;
  containerStyle?: React.CSSProperties;
  tableProps?: Record<string, any>;
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
  activeSortKey: GenericSortKey;
  onSort: (key: GenericSortKey) => void;
}
