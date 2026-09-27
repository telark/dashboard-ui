import { useCallback, useMemo } from 'react';
import {
  createNameValidator,
  nameValidationError,
  sanitizeName,
  DEFAULT_NAME_VALIDATION_CONFIG,
} from '../../../../shared';
import { ROLES_CONSTANTS as RPC } from '../../constants';
import type { Role } from '../../models';

interface UseNameValidationOptions {
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
}

export const useNameValidation = ({
  roles,
  isEditMode = false,
  currentName,
}: UseNameValidationOptions) => {
  const validationConfig = useMemo(
    () => ({
      ...DEFAULT_NAME_VALIDATION_CONFIG,
      minLength: RPC.GENERAL.NAME_VALIDATION.MIN_LENGTH,
      maxLength: RPC.GENERAL.NAME_VALIDATION.MAX_LENGTH,
      duplicateErrorMessage: RPC.GENERAL.NAME_VALIDATION.DUPLICATE_ERROR,
      invalidCharsErrorMessage: RPC.GENERAL.NAME_VALIDATION.INVALID_CHARS_ERROR,
      lengthErrorMessage: RPC.GENERAL.NAME_VALIDATION.LENGTH_ERROR,
    }),
    [],
  );

  const nameValidator = useMemo(
    () =>
      createNameValidator(
        roles,
        (role: Role) => role.name,
        validationConfig,
        isEditMode,
        currentName,
      ),
    [roles, validationConfig, isEditMode, currentName],
  );

  const normalizeName = useMemo(
    () => (value: string) => sanitizeName(value, validationConfig),
    [validationConfig],
  );

  // Drives Save's disabled state while typing; the unchanged current name always passes.
  const isNameInvalid = useCallback(
    (value: string | undefined): boolean => {
      const trimmed = value?.trim();
      if (!trimmed) return true;
      if (isEditMode && trimmed.toLowerCase() === currentName?.trim().toLowerCase()) return false;
      return (
        nameValidationError({
          value: trimmed,
          existingItems: roles,
          getName: (role: Role) => role.name,
          isEditMode,
          currentName,
          config: validationConfig,
        }) !== null
      );
    },
    [roles, validationConfig, isEditMode, currentName],
  );

  return {
    nameValidator,
    normalizeName,
    isNameInvalid,
  };
};
