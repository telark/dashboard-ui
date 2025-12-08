export type SortOrder = 'asc' | 'desc';
export type SortValueType = 'string' | 'number' | 'date' | 'custom';

export interface SortFieldConfig<T = unknown> {
  key: string;
  type: SortValueType;
  getValue?: (item: T) => unknown;
  compare?: (a: T, b: T) => number;
}

export interface SortConfig<T = unknown> {
  fields: SortFieldConfig<T>[];
  defaultSortKey?: string;
  defaultSortOrder?: SortOrder;
}

export interface UseSortStateReturn {
  sortKey: string | null;
  sortOrder: SortOrder;
  handleSort: (key: string) => void;
  setSortKey: (key: string | null) => void;
  setSortOrder: (order: SortOrder) => void;
}
