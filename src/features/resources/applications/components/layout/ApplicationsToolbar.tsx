import React, { useMemo } from 'react';
import { AppstoreOutlined, BarsOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
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
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0, gap: 8 }}>
      <Tooltip title={APPLICATIONS_UI.TOOLBAR_LAYOUT_SINGLE}>
        <Button
          type={layoutMode === 'single' ? 'primary' : 'default'}
          icon={<BarsOutlined />}
          onClick={() => onLayoutModeChange('single')}
        />
      </Tooltip>
      <Tooltip title={APPLICATIONS_UI.TOOLBAR_LAYOUT_DOUBLE}>
        <Button
          type={layoutMode === 'double' ? 'primary' : 'default'}
          icon={<AppstoreOutlined />}
          onClick={() => onLayoutModeChange('double')}
        />
      </Tooltip>
      <Toolbar config={toolbarConfig} />
      <FilterButton onClick={onOpenFilters} />
    </div>
  );
};

export default ApplicationsToolbar;
