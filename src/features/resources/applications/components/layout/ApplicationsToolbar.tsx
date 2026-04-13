import React, { useMemo } from 'react';
import { AppstoreOutlined, BarsOutlined, SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
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
  layoutMode: ApplicationLayoutMode;
  onLayoutModeChange: (mode: ApplicationLayoutMode) => void;
}

const ApplicationsToolbar: React.FC<ApplicationsToolbarProps> = ({
  searchValue,
  onSearchChange,
  onOpenFilters,
  layoutMode,
  onLayoutModeChange,
}) => {
  const nextLayoutMode: ApplicationLayoutMode = layoutMode === 'single' ? 'double' : 'single';
  const nextLayoutTooltip =
    nextLayoutMode === 'double'
      ? APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE
      : APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE;
  const nextLayoutIcon =
    nextLayoutMode === 'double' ? <AppstoreOutlined /> : <BarsOutlined />;

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
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <Toolbar config={toolbarConfig} />
        <FilterButton onClick={onOpenFilters} />
      </div>
    </div>
  );
};

export default ApplicationsToolbar;
