import { useState, useEffect, useRef, startTransition } from 'react';

interface UseRoleTypeFilterOptions {
  open: boolean;
}

interface UseRoleTypeFilterReturn {
  selectedRoleType: string;
  setSelectedRoleType: (type: string) => void;
}

export const useRoleTypeFilter = ({ open }: UseRoleTypeFilterOptions): UseRoleTypeFilterReturn => {
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');
  const previousOpenRef = useRef(false);

  useEffect(() => {
    const isOpening = open && !previousOpenRef.current;
    previousOpenRef.current = open;
    if (isOpening) {
      startTransition(() => {
        setSelectedRoleType('all');
      });
    }
  }, [open]);

  return {
    selectedRoleType,
    setSelectedRoleType,
  };
};
