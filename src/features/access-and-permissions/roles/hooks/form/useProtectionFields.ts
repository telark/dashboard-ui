import { useState } from 'react';

interface UseProtectionFieldsOptions {
  onManualChange?: () => void;
}

export const useProtectionFields = ({ onManualChange }: UseProtectionFieldsOptions = {}) => {
  const [localPreventScopeChanges, setLocalPreventScopeChanges] = useState<boolean | null>(null);

  const updateProtectionFields = (
    setFieldValue: (name: string[], value: unknown) => void,
    updates: Record<string, boolean>,
  ) => {
    const hasPreventScopeChanges = 'preventScopeChanges' in updates;
    if (hasPreventScopeChanges) {
      const newValue = updates.preventScopeChanges;
      setLocalPreventScopeChanges(newValue);
      setTimeout(() => {
        setFieldValue(['protection', 'preventScopeChanges'], newValue);
        setTimeout(() => {
          setLocalPreventScopeChanges(null);
          onManualChange?.();
        }, 100);
      }, 300);
    } else {
      Object.entries(updates).forEach(([field, value]) => {
        setFieldValue(['protection', field], value);
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onManualChange?.();
        });
      });
    }
  };

  const getPreventScopeChanges = (getFieldValue: (name: string[]) => unknown): boolean => {
    const formPreventScopeChanges = (getFieldValue(['protection', 'preventScopeChanges']) ||
      false) as boolean;
    return localPreventScopeChanges !== null ? localPreventScopeChanges : formPreventScopeChanges;
  };

  return {
    updateProtectionFields,
    getPreventScopeChanges,
  };
};
