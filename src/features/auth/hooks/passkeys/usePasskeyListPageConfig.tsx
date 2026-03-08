import React, { useMemo } from 'react';
import { usePasskeyListConfig } from '../../config/passkeyListConfig';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

export interface PasskeyListPageConfig {
  title: string;
  subtitle: string;
  toolbarConfig: ToolbarConfig;
}

interface UsePasskeyListPageConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePasskeyClick: () => void;
}

export const usePasskeyListPageConfig = ({
  searchValue,
  onSearchChange,
  onCreatePasskeyClick,
}: UsePasskeyListPageConfigProps): PasskeyListPageConfig => {
  const toolbarConfig = usePasskeyListConfig({
    searchValue,
    onSearchChange,
    onAddPasskeyClick: onCreatePasskeyClick,
  });

  return useMemo(
    () => ({
      title: PPC.LABELS.BREADCRUMBS.PASSKEYS,
      subtitle: PPC.LABELS.HEADER_SUBTITLE,
      toolbarConfig,
    }),
    [toolbarConfig],
  );
};
