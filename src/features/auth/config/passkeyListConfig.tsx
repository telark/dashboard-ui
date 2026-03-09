import React, { useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Icons } from '../../../constants';
import { PASSKEYS_CONSTANTS as PPC } from '../constants/passkeys';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';

const PasskeyIcon = Icons.Passkey;

interface UsePasskeyListConfigProps {
  onAddPasskeyClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const usePasskeyListConfig = ({
  onAddPasskeyClick,
  searchValue,
  onSearchChange,
}: UsePasskeyListConfigProps): ToolbarConfig => {
  return useMemo(
    () => ({
      search: {
        placeholder: PPC.TOOLBAR.SEARCH_PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
      },
      buttons: [
        {
          key: 'search',
          label: PPC.TOOLBAR.SEARCH_BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'add-passkey',
          label: PPC.LABELS.CREATE_BUTTON,
          icon: <PasskeyIcon size={16} />,
          variant: 'primary',
          onClick: onAddPasskeyClick,
        },
      ],
    }),
    [onAddPasskeyClick, searchValue, onSearchChange],
  );
};
