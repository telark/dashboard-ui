import React, { memo, useMemo } from 'react';
import { App as AntdApp } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CARD_LAYOUT, LIST_TOOLBAR, getCardGridColumns } from '../../../../../constants';
import EmptyState from '../../../../../components/display/views/EmptyState';
import { LIST_PAGE } from '../../../../../constants/shared/pages';
import type { Application } from '../../models';
import type { AppDispatch, RootState } from '../../../../../store';
import { ApplicationCard, ApplicationsToolbar, DiscoveryStatusBar } from '../../components';
import { setViewMode } from '../../store/slices/applicationsSlice';
import ApplicationResetModal from '../../components/reset/ApplicationResetModal';
import { resetApplicationThunk } from '../../store';
import { forceSyncApplication } from '../../utils/management/sync';
import { loadApplicationsSilent } from '../../utils/management/state';
import { APPLICATIONS_UI } from '../../constants';
import { DataViewError, PageContainer } from '../../../../../components/shared';
import { TablePagination } from '../../../../../components/display/table';
import { FancySpinner } from '../../../../../components/animation';
import { useDataViewState } from '../../../../../hooks/layout/useDataViewState';
import { useElementWidth } from '../../../../../hooks/layout';
import { useApplicationCoverage } from '../../hooks/useApplicationCoverage';

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
    const viewMode = useSelector((s: RootState) => s.applications.viewMode);
    const coverageOf = useApplicationCoverage();
    const { message } = AntdApp.useApp();
    const hasApps = applications.length > 0;
    const dataState = useDataViewState({ loading, error, hasData: hasApps });
    const selectedSet = useMemo(() => new Set(selectedNames), [selectedNames]);
    const selectedCount = selectedNames.length;
    const [bulkResetOpen, setBulkResetOpen] = React.useState(false);
    const [bulkResetLoading, setBulkResetLoading] = React.useState(false);
    const { ref: gridRef, width: gridWidth } = useElementWidth<HTMLDivElement>();
    const gridColumns = viewMode === 'list' ? 1 : getCardGridColumns(gridWidth);
    // A width that fits a single card leaves nothing for the view switch to change.
    const canShowGrid = gridWidth === 0 || getCardGridColumns(gridWidth) > 1;

    const content = useMemo(() => {
      if (!hasApps) return null;
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gap: CARD_LAYOUT.GRID_GAP_PX,
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
              coverage={coverageOf(application)}
            />
          ))}
        </div>
      );
    }, [
      applications,
      bulkMode,
      coverageOf,
      hasApps,
      onEditApplication,
      onToggleSelect,
      gridColumns,
      selectedSet,
    ]);

    const handleBulkForceSync = React.useCallback(async () => {
      const errors = await Promise.all(selectedNames.map((name) => forceSyncApplication(name)));
      const firstError = errors.find(Boolean);
      if (firstError) message.error(firstError);
    }, [message, selectedNames]);

    const handleConfirmBulkReset = React.useCallback(async () => {
      setBulkResetLoading(true);
      try {
        const results = await Promise.allSettled(
          selectedNames.map((name) => dispatch(resetApplicationThunk(name)).unwrap()),
        );
        const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
        if (failed) {
          const reason: unknown = failed.reason;
          message.error(
            typeof reason === 'string' ? reason : APPLICATIONS_UI.CARD.ACTIONS.RESET_FAILED,
          );
          return;
        }
        onClearSelection();
        setBulkResetOpen(false);
      } finally {
        setBulkResetLoading(false);
      }
    }, [dispatch, message, onClearSelection, selectedNames]);

    const handleCycleComplete = React.useCallback(() => {
      void loadApplicationsSilent(dispatch);
    }, [dispatch]);

    return (
      <PageContainer
        title={APPLICATIONS_UI.HEADER_TITLE}
        subtitle={APPLICATIONS_UI.HEADER_SUBTITLE}
        gap={LIST_PAGE.CONTENT_GAP_PX}
      >
        <DiscoveryStatusBar onCycleComplete={handleCycleComplete} />
        <ApplicationsToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onOpenFilters={onOpenFilters}
          totalCount={totalFiltered}
          filterChips={filterChips}
          overflowCount={overflowChipsCount}
          onRemoveFilterChip={onRemoveFilterChip}
          viewMode={viewMode}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
          showViewMode={canShowGrid}
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
          onBulkReset={() => setBulkResetOpen(true)}
          bulkForceSyncDisabled={anySelectedSyncing}
          healthQuickFilter={healthQuickFilter}
          onHealthQuickFilterChange={onHealthQuickFilterChange}
        />

        <div ref={gridRef} style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>
          {dataState.phase === 'error' ? (
            <DataViewError
              variant="card"
              message={dataState.errorMessage}
              onRetry={onRetry}
              connectivity={dataState.connectivity}
            />
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
          ) : !hasApps ? (
            <div style={{ display: 'flex', minHeight: LIST_PAGE.LOADING_MIN_HEIGHT_PX }}>
              <EmptyState
                title={APPLICATIONS_UI.NO_MATCH_TITLE}
                description={APPLICATIONS_UI.NO_MATCH_DESCRIPTION}
                secondaryAction={
                  hasActiveFilters
                    ? { label: APPLICATIONS_UI.CLEAR_ALL_FILTERS, onClick: onClearAllFilters }
                    : undefined
                }
              />
            </div>
          ) : (
            content
          )}
        </div>
        {hasApps ? <TablePagination config={pagination} /> : null}
        <ApplicationResetModal
          open={bulkResetOpen}
          onClose={() => setBulkResetOpen(false)}
          onConfirm={handleConfirmBulkReset}
          applicationNames={selectedNames}
          loading={bulkResetLoading}
          title={APPLICATIONS_UI.TOOLBAR_BULK_RESET_CONFIRM_TITLE}
          message={
            <div style={{ display: 'grid', rowGap: 8 }}>
              <div>{APPLICATIONS_UI.TOOLBAR_BULK_RESET_CONFIRM_MESSAGE}</div>
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
