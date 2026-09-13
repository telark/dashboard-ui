import { useState, useCallback, useMemo } from 'react';
import {
  buildFilterChips,
  hasAnyAppliedFilter,
  removeFilterChip,
  splitFilterChips,
} from '../../../../../utils/layout/filters';
import type { FilterOption } from '../../../../../interfaces/layout/filters';
import { GROUPS_CONSTANTS as GC } from '../../constants';

// The category filter starts on "all", which filters nothing.
const FILTER_DEFAULTS = { [GC.KEYS.FILTER_CATEGORY]: GC.KEYS.FILTER_CATEGORY_ALL };

export const useGroupFilters = (categoryOptions: FilterOption[]) => {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});

  const openFilterPanel = useCallback(() => setFilterPanelOpen(true), []);
  const closeFilterPanel = useCallback(() => setFilterPanelOpen(false), []);

  const handleFilterChange = useCallback((filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
  }, []);

  const handleFilterApply = useCallback((filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
    setFilterPanelOpen(false);
  }, []);

  const handleFilterReset = useCallback(() => {
    setAppliedFilters({});
  }, []);

  const handleRemoveFilterChip = useCallback((key: string, value: string) => {
    setAppliedFilters((current) => removeFilterChip(current, key, value));
  }, []);

  // The category filter stores ids; the chip shows the category name.
  const { visible: filterChips, overflowCount: overflowChipsCount } = useMemo(() => {
    const chips = buildFilterChips(appliedFilters, FILTER_DEFAULTS).map((chip) =>
      chip.key === GC.KEYS.FILTER_CATEGORY
        ? {
            ...chip,
            label: categoryOptions.find((opt) => opt.value === chip.value)?.label ?? chip.label,
          }
        : chip,
    );
    return splitFilterChips(chips);
  }, [appliedFilters, categoryOptions]);
  const hasActiveFilters = useMemo(
    () => hasAnyAppliedFilter(appliedFilters, FILTER_DEFAULTS),
    [appliedFilters],
  );

  return {
    filterPanelOpen,
    openFilterPanel,
    closeFilterPanel,
    appliedFilters,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
    handleRemoveFilterChip,
    filterChips,
    overflowChipsCount,
    hasActiveFilters,
  };
};
