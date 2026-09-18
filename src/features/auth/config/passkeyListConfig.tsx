import React, { useMemo } from 'react';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { Icons } from '../../../constants';
import { PASSKEYS_CONSTANTS as PPC } from '../constants/passkeys';
import { isWebAuthnSupported } from '../utils/webauthn/core';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';

const PasskeyIcon = Icons.Passkey;

interface UsePasskeyListConfigProps {
  onAddPasskeyClick: () => void;
  onEnrollLinkClick: () => void;
  enrollLinkLoading: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const usePasskeyListConfig = ({
  onAddPasskeyClick,
  onEnrollLinkClick,
  enrollLinkLoading,
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
          key: 'enroll-link',
          label: PPC.ENROLL.BUTTON,
          icon: <LinkOutlined />,
          variant: 'default',
          loading: enrollLinkLoading,
          onClick: onEnrollLinkClick,
        },
        {
          key: 'add-passkey',
          label: PPC.LABELS.CREATE_BUTTON,
          icon: <PasskeyIcon size={16} />,
          variant: 'primary',
          disabled: !isWebAuthnSupported(),
          onClick: onAddPasskeyClick,
        },
      ],
    }),
    [onAddPasskeyClick, onEnrollLinkClick, enrollLinkLoading, searchValue, onSearchChange],
  );
};
