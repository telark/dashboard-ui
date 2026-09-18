import { useMemo } from 'react';
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
  onEnrollLinkClick: () => void;
  enrollLinkLoading: boolean;
}

export const usePasskeyListPageConfig = ({
  searchValue,
  onSearchChange,
  onCreatePasskeyClick,
  onEnrollLinkClick,
  enrollLinkLoading,
}: UsePasskeyListPageConfigProps): PasskeyListPageConfig => {
  const toolbarConfig = usePasskeyListConfig({
    searchValue,
    onSearchChange,
    onAddPasskeyClick: onCreatePasskeyClick,
    onEnrollLinkClick,
    enrollLinkLoading,
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
