import type { SortFieldConfig, SortOrder } from './types';
import { toTimestamp, type DateInput } from '../../shared/time';

export const sortData = <T>(
  data: T[],
  sortKey: string | null,
  sortOrder: SortOrder,
  fieldConfigs: SortFieldConfig<T>[],
): T[] => {
  if (!sortKey || data.length === 0) {
    return data;
  }

  const fieldConfig = fieldConfigs.find((config) => config.key === sortKey);
  if (!fieldConfig) {
    return data;
  }

  const items = [...data];

  const compare = (a: T, b: T): number => {
    // Use custom comparator if provided
    if (fieldConfig.compare) {
      return fieldConfig.compare(a, b);
    }

    // Get values using custom getValue or default to accessing by key
    const getValue =
      fieldConfig.getValue || ((item: T) => (item as Record<string, unknown>)[fieldConfig.key]);
    const valueA = getValue(a);
    const valueB = getValue(b);

    // Handle null/undefined values
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Compare based on type
    switch (fieldConfig.type) {
      case 'string':
        return String(valueA).localeCompare(String(valueB));
      case 'number':
        return Number(valueA) - Number(valueB);
      case 'date':
        return toTimestamp(valueA as DateInput) - toTimestamp(valueB as DateInput);
      case 'custom':
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      default:
        return String(valueA).localeCompare(String(valueB));
    }
  };

  items.sort((a, b) => {
    const result = compare(a, b);
    return sortOrder === 'asc' ? result : -result;
  });

  return items;
};
