import React, { useCallback, useMemo } from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckSquareOutlined,
  ClearOutlined,
  EllipsisOutlined,
  HeartOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  LIST_TOOLBAR,
  TOOLBAR_CONTROL,
  getQuickFilterPillColors,
} from '../../../../../constants';
import { CompactQuickFilter, ListToolbar } from '../../../../../components/display/toolbar';
import type { FilterChip, ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATION_CARD, APPLICATION_VIEW_MODES, APPLICATIONS_UI } from '../../constants';
import type { ApplicationViewMode } from '../../models';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';

const MORE_MENU_KEYS = {
  BULK: 'bulk',
} as const;

const VIEW_MODE_ICON: Record<ApplicationViewMode, React.ReactNode> = {
  grid: <AppstoreOutlined />,
  list: <BarsOutlined />,
};

type HealthQuickFilter = 'all' | 'healthy' | 'degraded' | 'unhealthy';

interface ApplicationsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  totalCount: number;
  filterChips: FilterChip[];
  overflowCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  viewMode: ApplicationViewMode;
  onViewModeChange: (mode: ApplicationViewMode) => void;
  showViewMode: boolean;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  selectedCount: number;
  pageCount: number;
  allPageSelected: boolean;
  onToggleSelectAllPage: (checked: boolean) => void;
  onBulkForceSync: () => void;
  onBulkReset: () => void;
  bulkForceSyncDisabled: boolean;
  healthQuickFilter: HealthQuickFilter;
  onHealthQuickFilterChange: (next: HealthQuickFilter) => void;
}

const HEALTH_PILLS = [
  { key: 'all', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.ALL },
  { key: 'healthy', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.HEALTHY },
  { key: 'degraded', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.DEGRADED },
  { key: 'unhealthy', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.UNHEALTHY },
] as const;

const getPillAccent = (key: string): string => {
  if (key === 'healthy') return DEFAULT_COLORS.SUCCESS;
  if (key === 'degraded') return DEFAULT_COLORS.WARNING;
  if (key === 'unhealthy') return DEFAULT_COLORS.DANGER;
  return DEFAULT_COLORS.TEXT_MUTED;
};

interface HealthPillsProps {
  active: HealthQuickFilter;
  compact: boolean;
  onChange: (next: HealthQuickFilter) => void;
}

const HealthPills: React.FC<HealthPillsProps> = ({ active, compact, onChange }) => {
  if (compact) {
    return (
      <CompactQuickFilter
        options={HEALTH_PILLS.map((pill) => ({ ...pill, accent: getPillAccent(pill.key) }))}
        active={active}
        title={APPLICATIONS_UI.TOOLBAR_HEALTH_FILTER}
        icon={<HeartOutlined />}
        onChange={onChange}
      />
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: '100%' }}>
      {HEALTH_PILLS.map((pill) => {
        const isActive = active === pill.key;
        const accent = getPillAccent(pill.key);
        return (
          <button
            key={pill.key}
            type="button"
            onClick={() => onChange(pill.key)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              height: TOOLBAR_CONTROL.HEIGHT,
              boxSizing: 'border-box',
              padding: TOOLBAR_CONTROL.PADDING,
              borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
              ...getQuickFilterPillColors(accent, isActive),
              fontSize: 12,
              fontWeight: 700,
              lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
              userSelect: 'none',
            }}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
};

const ApplicationsToolbar: React.FC<ApplicationsToolbarProps> = ({
  searchValue,
  onSearchChange,
  onOpenFilters,
  totalCount,
  filterChips,
  overflowCount,
  onRemoveFilterChip,
  viewMode,
  onViewModeChange,
  showViewMode,
  hasActiveFilters,
  onClearAllFilters,
  bulkMode,
  onToggleBulkMode,
  selectedCount,
  pageCount,
  allPageSelected,
  onToggleSelectAllPage,
  onBulkForceSync,
  onBulkReset,
  bulkForceSyncDisabled,
  healthQuickFilter,
  onHealthQuickFilterChange,
}) => {
  const { forceSync, delete: reset } = ACTION_PERMISSIONS.applications;
  const canForceSync = usePermission(forceSync.scope, forceSync.level, forceSync.deny);
  const canReset = usePermission(reset.scope, reset.level, reset.deny);
  const bulkActions: ToolbarConfig = useMemo(() => {
    const disabledNoSelection = selectedCount <= 0;
    const syncBlocked = disabledNoSelection || bulkForceSyncDisabled || !canForceSync;
    return {
      buttons: [
        {
          key: 'bulkForceSync',
          label: APPLICATIONS_UI.TOOLBAR_BULK_FORCE_SYNC,
          icon: <SyncOutlined />,
          variant: 'default',
          iconOnly: true,
          onClick: () => {
            if (!syncBlocked) onBulkForceSync();
          },
          disabled: syncBlocked,
          tooltip: !canForceSync
            ? APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC_PERMISSION_DENIED_TOOLTIP
            : bulkForceSyncDisabled
              ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
              : undefined,
        },
        {
          key: 'bulkReset',
          label: APPLICATIONS_UI.TOOLBAR_BULK_RESET,
          icon: <ClearOutlined />,
          variant: 'danger',
          iconOnly: true,
          onClick: onBulkReset,
          disabled: disabledNoSelection || !canReset,
          tooltip: canReset
            ? undefined
            : APPLICATIONS_UI.CARD.ACTIONS.RESET_PERMISSION_DENIED_TOOLTIP,
        },
      ],
    };
  }, [bulkForceSyncDisabled, canForceSync, canReset, onBulkReset, onBulkForceSync, selectedCount]);

  const handleMoreMenuClick = useCallback(
    (key: string) => {
      if (key === MORE_MENU_KEYS.BULK) onToggleBulkMode();
    },
    [onToggleBulkMode],
  );

  const toolbars: ToolbarConfig[] = useMemo(() => {
    const search: ToolbarConfig = {
      search: {
        placeholder: APPLICATIONS_UI.TOOLBAR_SEARCH_PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
      },
      buttons: [
        {
          key: 'search',
          label: APPLICATIONS_UI.TOOLBAR_SEARCH_BUTTON,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
      ],
    };
    // Exiting bulk stays inline: it must never be buried behind a menu.
    const exitBulk: ToolbarConfig = {
      buttons: [
        {
          key: 'bulkMode',
          label: APPLICATIONS_UI.TOOLBAR_BULK_SELECT_ACTIVE,
          icon: <CheckSquareOutlined />,
          variant: 'ghost',
          onClick: onToggleBulkMode,
          active: true,
        },
      ],
    };
    const view: ToolbarConfig = {
      buttons: [
        {
          key: 'viewMode',
          label: APPLICATION_CARD.VIEW_MODE_LABEL,
          icon: VIEW_MODE_ICON[viewMode],
          variant: 'ghost',
          iconOnly: true,
          dropdown: {
            items: APPLICATION_VIEW_MODES.map((mode) => ({
              key: mode.key,
              label: mode.label,
              icon: VIEW_MODE_ICON[mode.key],
            })),
            selectedKeys: [viewMode],
            onItemClick: (key) => onViewModeChange(key === 'list' ? 'list' : 'grid'),
          },
        },
      ],
    };
    // Bulk is an occasional mode, so it sits behind the overflow to leave the
    // toolbar for per-scan controls.
    const more: ToolbarConfig = {
      buttons: [
        {
          key: 'more',
          label: APPLICATIONS_UI.TOOLBAR_MORE_LABEL,
          icon: <EllipsisOutlined />,
          variant: 'ghost',
          dropdown: {
            items: [
              {
                key: MORE_MENU_KEYS.BULK,
                icon: <CheckSquareOutlined />,
                label: APPLICATIONS_UI.TOOLBAR_BULK_SELECT,
              },
            ],
            onItemClick: handleMoreMenuClick,
          },
        },
      ],
    };
    // More would be empty in bulk mode: it only holds Bulk.
    const views = showViewMode ? [view] : [];
    return bulkMode ? [search, ...views, exitBulk] : [search, ...views, more];
  }, [
    bulkMode,
    handleMoreMenuClick,
    onSearchChange,
    onToggleBulkMode,
    onViewModeChange,
    searchValue,
    showViewMode,
    viewMode,
  ]);

  return (
    <ListToolbar
      totalCount={totalCount}
      countSuffix={APPLICATIONS_UI.TOOLBAR_COUNT_SUFFIX}
      compactWidth={APPLICATIONS_UI.TOOLBAR_COMPACT_WIDTH}
      filterChips={filterChips}
      overflowChipsCount={overflowCount}
      onRemoveFilterChip={onRemoveFilterChip}
      hasActiveFilters={hasActiveFilters}
      onClearAllFilters={onClearAllFilters}
      onOpenFilters={onOpenFilters}
      bulkMode={bulkMode}
      selection={{
        pageCount,
        selectedCount,
        allPageSelected,
        onToggleSelectAllPage,
        label: APPLICATIONS_UI.TOOLBAR_SELECT_ALL,
      }}
      bulkActions={bulkActions}
      quickFilter={(compact) => (
        <HealthPills
          active={healthQuickFilter || 'all'}
          compact={compact}
          onChange={onHealthQuickFilterChange}
        />
      )}
      toolbars={toolbars}
    />
  );
};

export default ApplicationsToolbar;
