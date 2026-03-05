import React from 'react';
import { USERS_CONSTANTS as UC } from '../constants';
import { Icons } from '../../../../constants';
import { SearchOutlined } from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

const UserIcon = Icons.User;

interface UseUserListConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateUserClick: () => void;
}

export const useUserListConfig = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateUserClick,
}: UseUserListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
      search: {
        placeholder: UC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: UC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'create-user',
          label: UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <UserIcon size={14} />,
          variant: 'primary',
          onClick: onCreateUserClick,
        },
      ],
    }),
    [searchValue, onSearchChange, onSearchSubmit, onCreateUserClick],
  );

  return { toolbarConfig };
};
