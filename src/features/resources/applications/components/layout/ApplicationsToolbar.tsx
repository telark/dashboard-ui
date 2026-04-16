import React, { useCallback, useMemo } from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Checkbox, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';
import type { ApplicationLayoutMode } from '../../models';
import { FilterButton } from '../../../../../components/display/buttons';

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
}) => {
  const nextLayoutMode: ApplicationLayoutMode = layoutMode === 'single' ? 'double' : 'single';
  const nextLayoutTooltip =
    nextLayoutMode === 'double'
      ? APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE_TOOLTIP
      : APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE_TOOLTIP;
  const nextLayoutLabel =
    nextLayoutMode === 'double'
      ? APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE
      : APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE;
  const nextLayoutIcon = nextLayoutMode === 'double' ? <AppstoreOutlined /> : <BarsOutlined />;

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
          variant: bulkMode ? 'primary' : 'default',
          onClick: onToggleBulkMode,
          active: bulkMode,
        },
      ],
    }),
    [bulkMode, onToggleBulkMode],
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

  const handleLayoutButtonMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
    e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
  }, []);

  const handleLayoutButtonMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#64748b';
  }, []);

  return (
    <div
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
        <Toolbar config={bulkActionsToolbarConfig} />
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
        <Toolbar config={clearAllToolbarConfig} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
        <Toolbar config={toolbarConfig} />
        <FilterButton onClick={onOpenFilters} />
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
        <Toolbar config={bulkModeToolbarConfig} />
        <Tooltip title={nextLayoutTooltip}>
          <button
            type="button"
            onClick={() => onLayoutModeChange(nextLayoutMode)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#64748b',
              fontFamily: "'Roboto Condensed', sans-serif",
              transition: 'all 0.2s',
              height: 32,
            }}
            onMouseEnter={handleLayoutButtonMouseEnter}
            onMouseLeave={handleLayoutButtonMouseLeave}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{nextLayoutIcon}</span>
            <span>{nextLayoutLabel}</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
