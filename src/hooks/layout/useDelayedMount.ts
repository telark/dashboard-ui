import { useState, useEffect } from 'react';

interface UseDelayedMountOptions {
  delay?: number;
}

export const useDelayedMount = ({ delay = 100 }: UseDelayedMountOptions = {}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isMounted;
};
