import React, { useCallback, useMemo } from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckSquareOutlined,
  ClearOutlined,
  DownOutlined,
  EllipsisOutlined,
  HeartOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { DEFAULT_COLORS, LIST_TOOLBAR, TOOLBAR_CONTROL } from '../../../../../constants';
import { ListToolbar } from '../../../../../components/display/toolbar';
import type { FilterChip, ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';
import type { ApplicationLayoutMode } from '../../models';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';

const MORE_MENU_KEYS = {
  LAYOUT: 'layout',
  BULK: 'bulk',
} as const;

type HealthQuickFilter = 'all' | 'healthy' | 'degraded' | 'unhealthy';

interface ApplicationsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  totalCount: number;
  filterChips: FilterChip[];
  overflowCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  layoutMode: ApplicationLayoutMode;
  onLayoutModeChange: (mode: ApplicationLayoutMode) => void;
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
  if (key === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  if (key === 'unhealthy') return DEFAULT_COLORS.DANGER;
  return DEFAULT_COLORS.TEXT_MUTED;
};

interface HealthPillsProps {
  active: HealthQuickFilter;
  compact: boolean;
  onChange: (next: HealthQuickFilter) => void;
}

// Four pills do not fit beside a full-width sidebar, so they fold into one
// control whose dot keeps the active filter readable without its label.
const CompactHealthPills: React.FC<Omit<HealthPillsProps, 'compact'>> = ({ active, onChange }) => {
  const activePill = HEALTH_PILLS.find((pill) => pill.key === active) ?? HEALTH_PILLS[0];
  const activeAccent = getPillAccent(active);
  const title = `${APPLICATIONS_UI.TOOLBAR_HEALTH_FILTER}: ${activePill.label}`;
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectedKeys: [active],
        items: HEALTH_PILLS.map((pill) => ({
          key: pill.key,
          label: pill.label,
          icon: (
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                // The menu's icon slot would otherwise stretch the dot into an oval.
                minWidth: 8,
                flexShrink: 0,
                borderRadius: '50%',
                background: getPillAccent(pill.key),
              }}
            />
          ),
        })),
        onClick: ({ key }) => onChange(key as HealthQuickFilter),
      }}
    >
      <Tooltip title={title}>
        <button
          type="button"
          aria-label={title}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            height: TOOLBAR_CONTROL.HEIGHT,
            boxSizing: 'border-box',
            padding: '0 8px',
            borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
            background: `${activeAccent}18`,
            border: `1px solid ${activeAccent}`,
            color: activeAccent,
          }}
        >
          <HeartOutlined style={{ fontSize: 13 }} />
          <DownOutlined style={{ fontSize: 9 }} />
        </button>
      </Tooltip>
    </Dropdown>
  );
};

const HealthPills: React.FC<HealthPillsProps> = ({ active, compact, onChange }) => {
  if (compact) {
    return <CompactHealthPills active={active} onChange={onChange} />;
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
              background: isActive ? `${accent}18` : DEFAULT_COLORS.CHIP_CUSTOM_BG,
              border: `1px solid ${isActive ? accent : 'transparent'}`,
              color: isActive ? accent : DEFAULT_COLORS.TEXT_MUTED,
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
  layoutMode,
  onLayoutModeChange,
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
  const nextLayoutMode: ApplicationLayoutMode = layoutMode === 'single' ? 'double' : 'single';
  const nextLayoutLabel =
    nextLayoutMode === 'double'
      ? APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE
      : APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE;

  const bulkActions: ToolbarConfig = useMemo(() => {
    const disabledNoSelection = selectedCount <= 0;
    return {
      buttons: [
        {
          key: 'bulkForceSync',
          label: APPLICATIONS_UI.TOOLBAR_BULK_FORCE_SYNC,
          icon: <SyncOutlined />,
          variant: 'default',
          iconOnly: true,
          onClick: () => {
            if (!disabledNoSelection && !bulkForceSyncDisabled) onBulkForceSync();
          },
          disabled: disabledNoSelection || bulkForceSyncDisabled,
          tooltip: bulkForceSyncDisabled
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
          disabled: disabledNoSelection,
        },
      ],
    };
  }, [bulkForceSyncDisabled, onBulkReset, onBulkForceSync, selectedCount]);

  const handleMoreMenuClick = useCallback(
    (key: string) => {
      if (key === MORE_MENU_KEYS.LAYOUT) {
        onLayoutModeChange(nextLayoutMode);
        return;
      }
      if (key === MORE_MENU_KEYS.BULK) {
        onToggleBulkMode();
      }
    },
    [nextLayoutMode, onLayoutModeChange, onToggleBulkMode],
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
    // Layout is a set-once display preference and bulk is an occasional mode, so
    // both sit behind the overflow to leave the toolbar for per-scan controls.
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
                key: MORE_MENU_KEYS.LAYOUT,
                icon: nextLayoutMode === 'double' ? <AppstoreOutlined /> : <BarsOutlined />,
                label: nextLayoutLabel,
              },
              ...(bulkMode
                ? []
                : [
                    {
                      key: MORE_MENU_KEYS.BULK,
                      icon: <CheckSquareOutlined />,
                      label: APPLICATIONS_UI.TOOLBAR_BULK_SELECT,
                    },
                  ]),
            ],
            onItemClick: handleMoreMenuClick,
          },
        },
      ],
    };
    return bulkMode ? [search, exitBulk, more] : [search, more];
  }, [
    bulkMode,
    handleMoreMenuClick,
    nextLayoutLabel,
    nextLayoutMode,
    onSearchChange,
    onToggleBulkMode,
    searchValue,
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
