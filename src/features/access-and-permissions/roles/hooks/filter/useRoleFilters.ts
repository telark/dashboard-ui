import { useState, useCallback, useMemo } from 'react';
import {
  buildFilterChips,
  hasAnyAppliedFilter,
  removeFilterChip,
  splitFilterChips,
} from '../../../../../utils/layout/filters';
import { getCategoryName } from '../../../categories/utils/helpers';
import type { Category } from '../../../categories/models';
import { ROLES_CONSTANTS as RC } from '../../constants';

// Every single-choice role filter starts on "all", which filters nothing.
const FILTER_DEFAULTS = {
  [RC.KEYS.FILTER_ROLE_TYPE]: RC.KEYS.FILTER_ALL,
  [RC.KEYS.CATEGORY]: RC.KEYS.FILTER_ALL,
  [RC.KEYS.VALIDITY]: RC.KEYS.FILTER_ALL,
  [RC.KEYS.STATUS]: RC.KEYS.FILTER_ALL,
};

export const useRoleFilters = (categories: Category[]) => {
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
  const { visible: filterChips, overflowCount: overflowChipsCount } = useMemo(
    () =>
      splitFilterChips(
        buildFilterChips(appliedFilters, FILTER_DEFAULTS).map((chip) =>
          chip.key === RC.KEYS.CATEGORY
            ? { ...chip, label: getCategoryName(chip.value, categories) }
            : chip,
        ),
      ),
    [appliedFilters, categories],
  );
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
