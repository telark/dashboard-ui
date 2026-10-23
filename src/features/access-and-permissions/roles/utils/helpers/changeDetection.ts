import { normalizeValue } from './normalizeValue';
import { deepEqual } from './deepEqual';
import { buildValidityForAPI } from '../validity/builders';
import { textChanged } from '../../../../shared';
import type { RoleFormValues } from '../../models';
import { compareCodeUnits } from '../../../../../utils/layout/sort';

type Protection = NonNullable<RoleFormValues['protection']>;

export interface ChangeDetectionResult {
  protectionHasChanged: boolean;
  unlockingScopes: boolean;
  unlockingName: boolean;
  unlockingCategory: boolean;
  scopesHaveChanged: boolean;
  nameHasChanged: boolean;
  categoryHasChanged: boolean;
  descriptionHasChanged: boolean;
  validityHasChanged: boolean;
  hasChanges: boolean;
  needsTwoStepUpdate: boolean;
  modificationLocked: boolean;
}

// The API omits false flags, so a switch turned on and off again equals a missing flag.
const enabledFlags = (protection: RoleFormValues['protection']) =>
  Object.entries(protection ?? {})
    .filter(([, on]) => on)
    .map(([flag]) => flag)
    .sort(compareCodeUnits);

const unlocking = (before: Protection, after: Protection, flag: keyof Protection) =>
  Boolean(before[flag]) && !after[flag];

const compareProtection = (before: Protection, after: Protection) => ({
  protectionHasChanged: !deepEqual(enabledFlags(before), enabledFlags(after)),
  unlockingScopes: unlocking(before, after, 'preventScopeChanges'),
  unlockingName: unlocking(before, after, 'lockName'),
  unlockingCategory: unlocking(before, after, 'lockCategory'),
  modificationLocked: Boolean(before.preventModification && after.preventModification),
});

const compareGeneral = (before: RoleFormValues, after: RoleFormValues) => ({
  nameHasChanged: textChanged(before.name, after.name),
  categoryHasChanged: textChanged(before.categoryRef, after.categoryRef),
  descriptionHasChanged: textChanged(before.description, after.description),
});

const scopesChanged = (before: RoleFormValues, after: RoleFormValues) =>
  !deepEqual(normalizeValue(before.scopes) || {}, normalizeValue(after.scopes) || {});

const validityChanged = (before: RoleFormValues, after: RoleFormValues) =>
  !deepEqual(buildValidityForAPI(before.validity), buildValidityForAPI(after.validity));

// Lifting a lock and changing what it guarded must land as protection first, then the fields.
const needsTwoStep = (
  protection: ReturnType<typeof compareProtection>,
  general: ReturnType<typeof compareGeneral>,
  scopesHaveChanged: boolean,
) =>
  protection.protectionHasChanged &&
  ((protection.unlockingScopes && scopesHaveChanged) ||
    (protection.unlockingName && general.nameHasChanged) ||
    (protection.unlockingCategory && general.categoryHasChanged));

export const detectChanges = (
  initialValues: RoleFormValues,
  finalValues: RoleFormValues,
): ChangeDetectionResult => {
  const protection = compareProtection(
    initialValues.protection || {},
    finalValues.protection || {},
  );
  const general = compareGeneral(initialValues, finalValues);
  const scopesHaveChanged = scopesChanged(initialValues, finalValues);
  const validityHasChanged = validityChanged(initialValues, finalValues);
  const hasChanges =
    protection.protectionHasChanged ||
    scopesHaveChanged ||
    validityHasChanged ||
    general.nameHasChanged ||
    general.categoryHasChanged ||
    general.descriptionHasChanged;

  return {
    ...protection,
    ...general,
    scopesHaveChanged,
    validityHasChanged,
    hasChanges,
    needsTwoStepUpdate: needsTwoStep(protection, general, scopesHaveChanged),
  };
};
