import { useMemo } from 'react';
import { createNameValidator, sanitizeName, DEFAULT_NAME_VALIDATION_CONFIG } from '../../../shared';
import { ROLES_CONSTANTS as RPC } from '../constants';
import type { Role } from '../models';

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

  return {
    nameValidator,
    normalizeName,
  };
};
