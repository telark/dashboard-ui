import React, { useCallback, useMemo } from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EllipsisOutlined,
  HeartOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Checkbox, Dropdown, Tooltip } from 'antd';
import { DEFAULT_COLORS, TOOLBAR_CONTROL, TOOLBAR_ITEM_GAP } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';
import type { ApplicationLayoutMode } from '../../models';
import { FilterButton } from '../../../../../components/display/buttons';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import { useElementWidth } from '../../../../../hooks/layout';

const MORE_MENU_KEYS = {
  LAYOUT: 'layout',
  BULK: 'bulk',
} as const;

interface ApplicationsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  totalCount: number;
  filterChips: { key: string; value: string; label: string }[];
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
  onBulkDelete: () => void;
  bulkForceSyncDisabled: boolean;
  healthQuickFilter: 'all' | 'healthy' | 'degraded' | 'unhealthy';
  onHealthQuickFilterChange: (next: 'all' | 'healthy' | 'degraded' | 'unhealthy') => void;
}

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
  onBulkDelete,
  bulkForceSyncDisabled,
  healthQuickFilter,
  onHealthQuickFilterChange,
}) => {
  const { ref: rowRef, width: rowWidth } = useElementWidth<HTMLDivElement>();
  // Bulk mode adds the select-all cluster and two actions, so it runs out of room
  // far earlier than the default toolbar.
  const compactThreshold = bulkMode
    ? APPLICATIONS_UI.TOOLBAR_COMPACT_WIDTH.BULK
    : APPLICATIONS_UI.TOOLBAR_COMPACT_WIDTH.DEFAULT;
  const isCompact = rowWidth > 0 && rowWidth < compactThreshold;
  const nextLayoutMode: ApplicationLayoutMode = layoutMode === 'single' ? 'double' : 'single';
  const nextLayoutLabel =
    nextLayoutMode === 'double'
      ? APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE
      : APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE;

  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
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
    }),
    [onSearchChange, searchValue],
  );
  const bulkActionsToolbarConfig: ToolbarConfig | undefined = useMemo(() => {
    if (!bulkMode) {
      return undefined;
    }
    const disabledNoSelection = selectedCount <= 0;
    const handleBulkForceSyncClick = () => {
      if (disabledNoSelection) return;
      if (bulkForceSyncDisabled) return;
      onBulkForceSync();
    };
    return {
      buttons: [
        {
          key: 'bulkForceSync',
          label: APPLICATIONS_UI.TOOLBAR_BULK_FORCE_SYNC,
          icon: <SyncOutlined />,
          variant: 'default',
          iconOnly: true,
          onClick: handleBulkForceSyncClick,
          disabled: disabledNoSelection,
          tooltip: bulkForceSyncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
        },
        {
          key: 'bulkDelete',
          label: APPLICATIONS_UI.TOOLBAR_BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'danger',
          iconOnly: true,
          onClick: onBulkDelete,
          disabled: disabledNoSelection,
        },
      ],
    };
  }, [bulkForceSyncDisabled, bulkMode, onBulkDelete, onBulkForceSync, selectedCount]);
  const bulkModeToolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'bulkMode',
          label: bulkMode
            ? APPLICATIONS_UI.TOOLBAR_BULK_SELECT_ACTIVE
            : APPLICATIONS_UI.TOOLBAR_BULK_SELECT,
          icon: <CheckSquareOutlined />,
          // Ghost like Search and Filter beside it: a bordered pill reads heavier
          // than its neighbours even at the same 30px height.
          variant: 'ghost',
          onClick: onToggleBulkMode,
          active: bulkMode,
        },
      ],
    }),
    [bulkMode, onToggleBulkMode],
  );
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

  // Layout is a set-once display preference and bulk is an occasional mode, so
  // both sit behind the overflow to leave the toolbar for per-scan controls.
  // Exiting bulk stays inline: it must never be buried behind a menu.
  const moreToolbarConfig: ToolbarConfig = useMemo(
    () => ({
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
    }),
    [bulkMode, handleMoreMenuClick, nextLayoutLabel, nextLayoutMode],
  );
  const clearAllToolbarConfig: ToolbarConfig | undefined = useMemo(() => {
    if (!hasActiveFilters) {
      return undefined;
    }
    return {
      buttons: [
        {
          key: 'clearAll',
          label: APPLICATIONS_UI.TOOLBAR_CLEAR_ALL,
          icon: <CloseOutlined />,
          variant: 'default',
          onClick: onClearAllFilters,
        },
      ],
    };
  }, [hasActiveFilters, onClearAllFilters]);

  const healthPills = useMemo(
    () =>
      [
        { key: 'all', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.ALL },
        { key: 'healthy', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.HEALTHY },
        { key: 'degraded', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.DEGRADED },
        { key: 'unhealthy', label: APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.UNHEALTHY },
      ] as const,
    [],
  );

  const getPillAccent = useCallback((key: string) => {
    if (key === 'healthy') return DEFAULT_COLORS.SUCCESS;
    if (key === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
    if (key === 'unhealthy') return DEFAULT_COLORS.DANGER;
    return DEFAULT_COLORS.TEXT_MUTED;
  }, []);

  const pillsNode = useMemo(() => {
    const activeKey = healthQuickFilter || 'all';
    // Four pills do not fit beside a full-width sidebar, so they fold into one
    // control whose dot keeps the active filter readable without its label.
    if (isCompact) {
      const activePill = healthPills.find((pill) => pill.key === activeKey) ?? healthPills[0];
      const activeAccent = getPillAccent(activeKey);
      return (
        <Dropdown
          trigger={['click']}
          menu={{
            selectedKeys: [activeKey],
            items: healthPills.map((pill) => ({
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
            onClick: ({ key }) =>
              onHealthQuickFilterChange(key as ApplicationsToolbarProps['healthQuickFilter']),
          }}
        >
          <Tooltip title={`${APPLICATIONS_UI.TOOLBAR_HEALTH_FILTER}: ${activePill.label}`}>
            <button
              type="button"
              aria-label={`${APPLICATIONS_UI.TOOLBAR_HEALTH_FILTER}: ${activePill.label}`}
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
                borderRadius: 999,
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
    }
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: '100%' }}>
        {healthPills.map((pill) => {
          const active = (healthQuickFilter || 'all') === pill.key;
          const accent = getPillAccent(pill.key);
          const background = active ? `${accent}18` : DEFAULT_COLORS.CHIP_CUSTOM_BG;
          const borderColor = active ? accent : 'transparent';
          const color = active ? accent : DEFAULT_COLORS.TEXT_MUTED;
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => onHealthQuickFilterChange(pill.key)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                height: TOOLBAR_CONTROL.HEIGHT,
                boxSizing: 'border-box',
                padding: TOOLBAR_CONTROL.PADDING,
                borderRadius: 999,
                background,
                border: `1px solid ${borderColor}`,
                color,
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
  }, [getPillAccent, healthPills, healthQuickFilter, isCompact, onHealthQuickFilterChange]);

  return (
    <div
      ref={rowRef}
      className="applications-bulk-select"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 60,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          minWidth: 0,
          height: '100%',
        }}
      >
        {bulkMode && pageCount > 0 ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              color: DEFAULT_COLORS.TEXT_MUTED,
              paddingLeft: 16,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <Checkbox
              checked={allPageSelected}
              onChange={(e) => onToggleSelectAllPage(e.target.checked)}
              style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}
            >
              {APPLICATIONS_UI.TOOLBAR_SELECT_ALL} · {selectedCount} selected
            </Checkbox>
          </span>
        ) : null}
        <Toolbar config={bulkActionsToolbarConfig} compact={isCompact} />
        {bulkMode ? (
          <span
            style={{
              fontSize: 12,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {totalCount} {APPLICATIONS_UI.TOOLBAR_COUNT_SUFFIX}
          </span>
        ) : null}
        {filterChips.map((chip) => (
          <span
            key={`${chip.key}:${chip.value}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 8px',
              borderRadius: 999,
              background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
              color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {chip.label}
            <button
              type="button"
              onClick={() => onRemoveFilterChip(chip.key, chip.value)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
              }}
            >
              <CloseOutlined />
            </button>
          </span>
        ))}
        {overflowCount > 0 ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 999,
              background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
              color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            +{overflowCount} more
          </span>
        ) : null}
        <Toolbar config={clearAllToolbarConfig} compact={isCompact} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: TOOLBAR_ITEM_GAP, height: '100%' }}>
        {!bulkMode ? (
          <span
            style={{
              fontSize: 12,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1,
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {totalCount} {APPLICATIONS_UI.TOOLBAR_COUNT_SUFFIX}
          </span>
        ) : null}
        {pillsNode}
        <FilterButton onClick={onOpenFilters} compact={isCompact} />
        <Toolbar config={toolbarConfig} compact={isCompact} />
        {bulkMode ? <Toolbar config={bulkModeToolbarConfig} compact={isCompact} /> : null}
        <Toolbar config={moreToolbarConfig} compact={isCompact} />
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
