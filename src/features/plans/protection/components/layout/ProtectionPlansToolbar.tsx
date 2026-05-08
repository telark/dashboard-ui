import React, { useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Icons } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

interface ProtectionPlansToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
}

const ProtectionPlansToolbar: React.FC<ProtectionPlansToolbarProps> = ({
  searchValue,
  onSearchChange,
  onCreatePlanClick,
}) => {
  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      search: {
        placeholder: 'Search plans by name, type, or scope...',
        value: searchValue,
        onChange: onSearchChange,
      },
      buttons: [
        {
          key: 'search',
          label: 'Search',
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'create-plan',
          label: PPC.LABELS.CREATE_BUTTON,
          icon: <Icons.ProtectionPlans size={14} />,
          variant: 'primary',
          onClick: onCreatePlanClick,
        },
      ],
    }),
    [onCreatePlanClick, onSearchChange, searchValue],
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 0,
      }}
    >
      <Toolbar config={toolbarConfig} />
    </div>
  );
};

export default ProtectionPlansToolbar;
