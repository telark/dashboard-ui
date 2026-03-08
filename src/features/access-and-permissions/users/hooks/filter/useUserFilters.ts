import { useState, useCallback } from 'react';

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

  return {
    filterPanelOpen,
    openFilterPanel,
    closeFilterPanel,
    appliedFilters,
    handleFilterChange,
    handleFilterApply,
    handleFilterReset,
  };
};
