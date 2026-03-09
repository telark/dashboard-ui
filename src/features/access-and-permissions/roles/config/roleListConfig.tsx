import React from 'react';
import { ROLES_CONSTANTS as RC } from '../constants';
import { Icons } from '../../../../constants';
import { SearchOutlined } from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

const RoleIcon = Icons.Role;

interface UseRoleListConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateRoleClick: () => void;
}

export const useRoleListConfig = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateRoleClick,
}: UseRoleListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
      search: {
        placeholder: RC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: RC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'create-role',
          label: RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <RoleIcon size={14} />,
          variant: 'primary',
          onClick: onCreateRoleClick,
        },
      ],
    }),
    [searchValue, onSearchChange, onSearchSubmit, onCreateRoleClick],
  );

  return { toolbarConfig };
};
