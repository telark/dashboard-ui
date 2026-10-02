import { useMemo } from 'react';
import { usePasskeyListConfig } from '../../config/passkeyListConfig';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

export interface PasskeyListPageConfig {
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
      toolbarConfig,
    }),
    [toolbarConfig],
  );
};
