import { useState, useCallback, useMemo } from 'react';
import {
  buildFilterChips,
  hasAnyAppliedFilter,
  removeFilterChip,
  splitFilterChips,
} from '../../../../../utils/layout/filters';
import { USERS_CONSTANTS as UC } from '../../constants';

// The status filter starts on "all", which filters nothing.
const FILTER_DEFAULTS = { [UC.KEYS.FILTER_STATUS]: UC.KEYS.FILTER_STATUS_ALL };

export const useUserFilters = () => {
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

  const { visible: filterChips, overflowCount: overflowChipsCount } = useMemo(
    () => splitFilterChips(buildFilterChips(appliedFilters, FILTER_DEFAULTS)),
    [appliedFilters],
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
