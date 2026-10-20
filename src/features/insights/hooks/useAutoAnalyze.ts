import { useSelector } from 'react-redux';
import { selectGlobalConfigState } from '../../globalconfig/store';

// Whether automatic analysis is on, undefined while the GlobalConfig is unread (or unreadable
// without settings read): then "All clear" can't be claimed.
export const useAutoAnalyze = (): boolean | undefined => {
  const config = useSelector(selectGlobalConfigState).data;
  return config ? Boolean(config.ai?.autoAnalyze) : undefined;
};
