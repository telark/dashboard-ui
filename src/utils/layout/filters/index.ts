import { LIST_TOOLBAR } from '../../../constants';
import type { DateRangeFilter } from '../../../interfaces/date/filter';
import type { FilterChip } from '../../../interfaces/layout/toolbar';

const isDateRangeSet = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const range = value as DateRangeFilter;
  return Boolean(range.from || range.to);
};

export const hasAnyAppliedFilter = (
  filters: Record<string, unknown>,
  defaults: Record<string, unknown> = {},
): boolean =>
  Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return Boolean(value) && value !== defaults[key];
    return isDateRangeSet(value);
  });

const dateRangeChip = (key: string, range: DateRangeFilter): FilterChip => {
  const label = `${range.from || LIST_TOOLBAR.DATE_RANGE_ANY} ${LIST_TOOLBAR.DATE_RANGE_SEPARATOR} ${
    range.to || LIST_TOOLBAR.DATE_RANGE_ANY
  }`;
  return { key, value: label, label };
};

/**
 * One chip per applied value. `defaults` names the value each single-choice
 * filter starts at (e.g. an "all" option), which is not worth a chip.
 */
export const buildFilterChips = (
  filters: Record<string, unknown>,
  defaults: Record<string, unknown> = {},
): FilterChip[] =>
  Object.entries(filters).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item))
        .filter((raw) => raw.trim())
        .map((raw) => ({ key, value: raw, label: raw }));
    }
    if (typeof value === 'string') {
      return value.trim() && value !== defaults[key] ? [{ key, value, label: value }] : [];
    }
    if (key === LIST_TOOLBAR.DATE_RANGE_KEY && isDateRangeSet(value)) {
      return [dateRangeChip(key, value as DateRangeFilter)];
    }
    return [];
  });

/** The applied filters with one chip's value taken out. */
export const removeFilterChip = (
  filters: Record<string, unknown>,
  key: string,
  value: string,
): Record<string, unknown> => {
  const current = filters[key];
  if (Array.isArray(current)) {
    return { ...filters, [key]: current.filter((item) => String(item) !== value) };
  }
  const rest = { ...filters };
  delete rest[key];
  return rest;
};

/** The chips the toolbar shows, and how many collapse into the overflow chip. */
export const splitFilterChips = (
  chips: FilterChip[],
): { visible: FilterChip[]; overflowCount: number } => {
  const visible = chips.slice(0, LIST_TOOLBAR.MAX_VISIBLE_CHIPS);
  return { visible, overflowCount: chips.length - visible.length };
};
