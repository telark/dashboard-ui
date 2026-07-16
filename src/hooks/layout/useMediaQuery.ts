import { useCallback, useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = globalThis.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => globalThis.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot);
};
