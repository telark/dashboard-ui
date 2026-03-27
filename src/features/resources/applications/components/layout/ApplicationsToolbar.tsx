import React, { useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const ApplicationsToolbar: React.FC<ApplicationsToolbarProps> = ({ searchValue, onSearchChange }) => {
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
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
      <Toolbar config={toolbarConfig} />
    </div>
  );
};

export default ApplicationsToolbar;

