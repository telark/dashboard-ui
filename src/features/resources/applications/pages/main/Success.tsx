import React, { memo, useMemo } from 'react';
import { Button, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';
import type { Application } from '../../models';
import type { AppDispatch, RootState } from '../../../../../store';
import { useAppearance } from '../../../../settings/sections/appearance';
import { ApplicationCard, ApplicationsHeader, ApplicationsToolbar } from '../../components';
import { setLayoutMode } from '../../store/slices/applicationsSlice';
import ApplicationDeleteModal from '../../components/delete/ApplicationDeleteModal';
import { deleteApplicationThunk } from '../../store';
import { forceSyncApplication } from '../../utils/management/sync';
import { APPLICATIONS_UI } from '../../constants';

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
  }) => {
    const dispatch: AppDispatch = useDispatch();
    const layoutMode = useSelector((s: RootState) => s.applications.layoutMode);
    const { contentGap } = useAppearance();
    const hasApps = applications.length > 0;
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
          className={bulkMode ? 'applications-bulk-select' : undefined}
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
      <div
        style={{
          minHeight: '100vh',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          padding: PAGE_CONTENT_LAYOUT.PADDING,
          marginTop: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap }}>
          <ApplicationsHeader />

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
          />

          <div style={{ marginTop: -10 }}>
            {!hasApps && hasActiveFilters ? (
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span
              style={{ alignSelf: 'center', marginRight: 12, color: DEFAULT_COLORS.TEXT_MUTED }}
            >
              {pagination.total === 0
                ? '0-0 of 0'
                : `${(pagination.currentPage - 1) * pagination.pageSize + 1}-${Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.total,
                  )} of ${pagination.total}`}
            </span>
            <Pagination
              className="applications-pagination"
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={pagination.onPageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
        <style>{`
          .applications-pagination .ant-pagination-item-active {
            border-color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item-active a {
            color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item:hover,
          .applications-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
          .applications-pagination .ant-pagination-next:hover .ant-pagination-item-link {
            border-color: ${DEFAULT_COLORS.SUCCESS};
            color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item:hover a,
          .applications-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
          .applications-pagination .ant-pagination-next:hover .ant-pagination-item-link {
            color: ${DEFAULT_COLORS.SUCCESS};
          }
        `}</style>
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
      </div>
    );
  },
);

ApplicationsSuccess.displayName = 'ApplicationsSuccess';

export default ApplicationsSuccess;
