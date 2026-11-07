import { useMemo } from 'react';
import { usePasskeyListConfig } from '../../config/passkeyListConfig';
import { lockConfig } from '../../../../components/display/toolbar';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';
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
  unreachable: boolean;
}

export const usePasskeyListPageConfig = ({
  searchValue,
  onSearchChange,
  onCreatePasskeyClick,
  onEnrollLinkClick,
  enrollLinkLoading,
  unreachable,
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
      toolbarConfig: lockConfig(
        toolbarConfig,
        unreachable ? CONNECTIVITY_CONSTANTS.UNREACHABLE.ACTION_TOOLTIP : undefined,
      ),
    }),
    [toolbarConfig, unreachable],
  );
};
