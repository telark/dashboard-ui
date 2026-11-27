import type { SortFieldConfig, SortOrder } from './types';
import { toTimestamp, type DateInput } from '../../shared/time';

// A text column holds strings or the odd number; an object sorts by its JSON, not "[object Object]".
const asText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  return JSON.stringify(value) ?? '';
};

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
    if (fieldConfig.compare) {
      return fieldConfig.compare(a, b);
    }

    const getValue =
      fieldConfig.getValue || ((item: T) => (item as Record<string, unknown>)[fieldConfig.key]);
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    switch (fieldConfig.type) {
      case 'string':
        return asText(valueA).localeCompare(asText(valueB));
      case 'number':
        return Number(valueA) - Number(valueB);
      case 'date':
        return toTimestamp(valueA as DateInput) - toTimestamp(valueB as DateInput);
      case 'custom':
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      default:
        return asText(valueA).localeCompare(asText(valueB));
    }
  };

  items.sort((a, b) => {
    const result = compare(a, b);
    return sortOrder === 'asc' ? result : -result;
  });

  return items;
};
