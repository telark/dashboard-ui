import React, { useMemo } from 'react';
import { AppstoreOutlined, BarsOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        minHeight: '60px',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {pageCount > 0 ? (
          <Checkbox
            checked={allPageSelected}
            onChange={(e) => onToggleSelectAllPage(e.target.checked)}
          >
            {APPLICATIONS_UI.TOOLBAR_SELECT_ALL}
          </Checkbox>
        ) : null}
        {selectedCount > 0 ? (
          <>
            <Tooltip
              title={
                bulkForceSyncDisabled
                  ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
                  : undefined
              }
            >
              <Button
                type="default"
                size="small"
                onClick={onBulkForceSync}
                disabled={bulkForceSyncDisabled}
              >
                {APPLICATIONS_UI.TOOLBAR_BULK_FORCE_SYNC}
              </Button>
            </Tooltip>
            <Button type="default" size="small" danger onClick={onBulkDelete}>
              {APPLICATIONS_UI.TOOLBAR_BULK_DELETE}
            </Button>
          </>
        ) : null}
        <Tooltip title={nextLayoutTooltip}>
          <button
            type="button"
            onClick={() => onLayoutModeChange(nextLayoutMode)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#64748b',
              fontFamily: "'Roboto Condensed', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
              e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{nextLayoutIcon}</span>
          </button>
        </Tooltip>
        <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {totalCount} {APPLICATIONS_UI.TOOLBAR_COUNT_SUFFIX}
        </span>
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
        {hasActiveFilters ? (
          <Button size="small" onClick={onClearAllFilters}>
            {APPLICATIONS_UI.TOOLBAR_CLEAR_ALL}
          </Button>
        ) : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <Toolbar config={toolbarConfig} />
        <FilterButton onClick={onOpenFilters} />
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
