import { useState } from 'react';
import { ROLES_CONSTANTS } from '../../constants';

const { FORM_WRITE_DELAY_MS, LOCAL_VALUE_CLEAR_MS } = ROLES_CONSTANTS.PROTECTION_TIMERS;

export const useProtectionFields = () => {
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
        }, LOCAL_VALUE_CLEAR_MS);
      }, FORM_WRITE_DELAY_MS);
    } else {
      Object.entries(updates).forEach(([field, value]) => {
        setFieldValue(['protection', field], value);
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
