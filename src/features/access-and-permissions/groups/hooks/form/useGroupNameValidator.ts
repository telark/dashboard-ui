import { useMemo } from 'react';
import { createNameValidator, sanitizeName } from '../../../../shared';
import { DEFAULT_NAME_VALIDATION_CONFIG } from '../../../../shared/constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import type { Group } from '../../models';

interface UseGroupNameValidatorOptions {
  groups: Group[];
  isEditMode?: boolean;
  currentName?: string;
}

export const useGroupNameValidator = ({
  groups,
  isEditMode = false,
  currentName,
}: UseGroupNameValidatorOptions) => {
  const nameValidationConfig = useMemo(
    () => ({
      ...DEFAULT_NAME_VALIDATION_CONFIG,
      minLength: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.MIN_LENGTH,
      maxLength: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.MAX_LENGTH,
      duplicateErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.DUPLICATE_ERROR,
      invalidCharsErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.INVALID_CHARS_ERROR,
      lengthErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.LENGTH_ERROR,
    }),
    [],
  );

  const nameValidator = useMemo(
    () =>
      createNameValidator(
        groups,
        (group: Group) => group.name,
        nameValidationConfig,
        isEditMode,
        currentName,
      ),
    [groups, nameValidationConfig, isEditMode, currentName],
  );

  const normalizeName = useMemo(
    () => (value: string) => sanitizeName(value, nameValidationConfig),
    [nameValidationConfig],
  );

  return {
    nameValidationConfig,
    nameValidator,
    normalizeName,
  };
};
