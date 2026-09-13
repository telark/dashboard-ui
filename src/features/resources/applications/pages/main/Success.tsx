import React, { memo, useMemo } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS, LIST_TOOLBAR } from '../../../../../constants';
import { LIST_PAGE } from '../../../../../constants/shared/pages';
import type { Application } from '../../models';
import type { AppDispatch, RootState } from '../../../../../store';
import { ApplicationCard, ApplicationsToolbar } from '../../components';
import { setLayoutMode } from '../../store/slices/applicationsSlice';
import ApplicationDeleteModal from '../../components/delete/ApplicationDeleteModal';
import { deleteApplicationThunk } from '../../store';
import { forceSyncApplication } from '../../utils/management/sync';
import { APPLICATIONS_UI } from '../../constants';
import { DataViewError, PageContainer } from '../../../../../components/shared';
import { TablePagination } from '../../../../../components/display/table';
import { FancySpinner } from '../../../../../components/animation';
import { useDataViewState } from '../../../../../hooks/layout/useDataViewState';

interface ApplicationsSuccessProps {
  applications: Application[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onEditApplication: (application: Application) => void;
  onOpenFilters: () => void;
  onClearAllFilters: () => void;
  filterChips: { key: string; value: string; label: string }[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  totalFiltered: number;
  hasActiveFilters: boolean;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  selectedNames: string[];
  onToggleSelect: (name: string, checked: boolean) => void;
  onToggleSelectAllPage: (checked: boolean) => void;
  allPageSelected: boolean;
  anySelectedSyncing: boolean;
  onClearSelection: () => void;
  healthQuickFilter: 'all' | 'healthy' | 'degraded' | 'unhealthy';
  onHealthQuickFilterChange: (next: 'all' | 'healthy' | 'degraded' | 'unhealthy') => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const ApplicationsSuccess: React.FC<ApplicationsSuccessProps> = memo(
  ({
    applications,
    searchValue,
    onSearchChange,
    onEditApplication,
    onOpenFilters,
    onClearAllFilters,
    filterChips,
    overflowChipsCount,
    onRemoveFilterChip,
    totalFiltered,
    hasActiveFilters,
    pagination,
    bulkMode,
    onToggleBulkMode,
    selectedNames,
    onToggleSelect,
    onToggleSelectAllPage,
    allPageSelected,
    anySelectedSyncing,
    onClearSelection,
    healthQuickFilter,
    onHealthQuickFilterChange,
    loading,
    error,
    onRetry,
  }) => {
    const dispatch: AppDispatch = useDispatch();
    const layoutMode = useSelector((s: RootState) => s.applications.layoutMode);
    const hasApps = applications.length > 0;
    const dataState = useDataViewState({ loading, error, hasData: hasApps });
    const selectedSet = useMemo(() => new Set(selectedNames), [selectedNames]);
    const selectedCount = selectedNames.length;
    const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
    const [bulkDeleteLoading, setBulkDeleteLoading] = React.useState(false);

    const content = useMemo(() => {
      if (!hasApps) return null;
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layoutMode === 'double' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            gap: 16,
            alignItems: 'stretch',
          }}
          className={bulkMode ? LIST_TOOLBAR.BULK_SELECT_CLASS : undefined}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application.name}
              application={application}
              onEditApplication={onEditApplication}
              bulkMode={bulkMode}
              selected={selectedSet.has(application.name)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      );
    }, [
      applications,
      bulkMode,
      hasApps,
      layoutMode,
      onEditApplication,
      onToggleSelect,
      selectedSet,
    ]);

    const handleBulkForceSync = React.useCallback(() => {
      selectedNames.forEach((name) => {
        forceSyncApplication(name).catch(() => undefined);
      });
    }, [selectedNames]);

    const handleConfirmBulkDelete = React.useCallback(async () => {
      setBulkDeleteLoading(true);
      try {
        await Promise.all(
          selectedNames.map((name) => dispatch(deleteApplicationThunk(name)).unwrap()),
        );
        onClearSelection();
        setBulkDeleteOpen(false);
      } finally {
        setBulkDeleteLoading(false);
      }
    }, [dispatch, onClearSelection, selectedNames]);

    return (
      <PageContainer
        title={APPLICATIONS_UI.HEADER_TITLE}
        subtitle={APPLICATIONS_UI.HEADER_SUBTITLE}
        gap={LIST_PAGE.CONTENT_GAP_PX}
      >
        <ApplicationsToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onOpenFilters={onOpenFilters}
          totalCount={totalFiltered}
          filterChips={filterChips}
          overflowCount={overflowChipsCount}
          onRemoveFilterChip={onRemoveFilterChip}
          layoutMode={layoutMode}
          onLayoutModeChange={(mode) => dispatch(setLayoutMode(mode))}
          hasActiveFilters={hasActiveFilters}
          onClearAllFilters={onClearAllFilters}
          bulkMode={bulkMode}
          onToggleBulkMode={() => {
            onToggleBulkMode();
            if (bulkMode) {
              onClearSelection();
            }
          }}
          selectedCount={selectedCount}
          pageCount={applications.length}
          allPageSelected={allPageSelected}
          onToggleSelectAllPage={onToggleSelectAllPage}
          onBulkForceSync={handleBulkForceSync}
          onBulkDelete={() => setBulkDeleteOpen(true)}
          bulkForceSyncDisabled={anySelectedSyncing}
          healthQuickFilter={healthQuickFilter}
          onHealthQuickFilterChange={onHealthQuickFilterChange}
        />

        <div style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>
          {dataState.phase === 'error' ? (
            <DataViewError variant="card" message={dataState.errorMessage} onRetry={onRetry} />
          ) : dataState.phase === 'loading' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: LIST_PAGE.LOADING_MIN_HEIGHT_PX,
              }}
            >
              <FancySpinner size={40} showLabel />
            </div>
          ) : !hasApps && hasActiveFilters ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ marginBottom: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                No applications match the current filters.
              </p>
              <Button type="link" onClick={onClearAllFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            content
          )}
        </div>
        <TablePagination config={pagination} />
        <ApplicationDeleteModal
          open={bulkDeleteOpen}
          onClose={() => setBulkDeleteOpen(false)}
          onConfirm={handleConfirmBulkDelete}
          applicationNames={selectedNames}
          loading={bulkDeleteLoading}
          title={APPLICATIONS_UI.TOOLBAR_BULK_DELETE_CONFIRM_TITLE}
          message={
            <div style={{ display: 'grid', rowGap: 8 }}>
              <div>{APPLICATIONS_UI.TOOLBAR_BULK_DELETE_CONFIRM_MESSAGE}</div>
              <div style={{ maxHeight: 180, overflowY: 'auto', textAlign: 'left' }}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {selectedNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            </div>
          }
        />
      </PageContainer>
    );
  },
);

ApplicationsSuccess.displayName = 'ApplicationsSuccess';

export default ApplicationsSuccess;
