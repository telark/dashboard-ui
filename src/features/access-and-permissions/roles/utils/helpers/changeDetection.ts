import { normalizeValue } from './normalizeValue';
import { deepEqual } from './deepEqual';
import type { RoleFormValues } from '../../models';

export interface ChangeDetectionResult {
  protectionHasChanged: boolean;
  unlockingScopes: boolean;
  unlockingName: boolean;
  unlockingCategory: boolean;
  scopesHaveChanged: boolean;
  nameHasChanged: boolean;
  categoryHasChanged: boolean;
  needsTwoStepUpdate: boolean;
}

export const detectChanges = (
  initialValues: RoleFormValues,
  finalValues: RoleFormValues,
): ChangeDetectionResult => {
  const currentProtection = finalValues.protection || {};
  const initialProtection = initialValues.protection || {};

  const normalizedInitialProtection = normalizeValue(initialProtection);
  const normalizedCurrentProtection = normalizeValue(currentProtection);
  const protectionHasChanged = !deepEqual(normalizedInitialProtection, normalizedCurrentProtection);

  const wasPreventScopeChanges = initialProtection.preventScopeChanges || false;
  const isPreventScopeChanges = currentProtection.preventScopeChanges || false;
  const unlockingScopes = wasPreventScopeChanges && !isPreventScopeChanges;

  const wasLockName = initialProtection.lockName || false;
  const isLockName = currentProtection.lockName || false;
  const unlockingName = wasLockName && !isLockName;

  const wasLockCategory = initialProtection.lockCategory || false;
  const isLockCategory = currentProtection.lockCategory || false;
  const unlockingCategory = wasLockCategory && !isLockCategory;

  const normalizedInitialScopes = normalizeValue(initialValues.scopes) || {};
  const normalizedCurrentScopes = normalizeValue(finalValues.scopes) || {};
  const scopesHaveChanged = !deepEqual(normalizedInitialScopes, normalizedCurrentScopes);

  const nameHasChanged = (initialValues.name || '') !== (finalValues.name || '');
  const categoryHasChanged = (initialValues.categoryID || '') !== (finalValues.categoryID || '');

  const needsTwoStepUpdate =
    protectionHasChanged &&
    ((unlockingScopes && scopesHaveChanged) ||
      (unlockingName && nameHasChanged) ||
      (unlockingCategory && categoryHasChanged));

  return {
    protectionHasChanged,
    unlockingScopes,
    unlockingName,
    unlockingCategory,
    scopesHaveChanged,
    nameHasChanged,
    categoryHasChanged,
    needsTwoStepUpdate,
  };
};

