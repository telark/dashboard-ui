import type { NameValidationConfig } from '../constants/nameValidation';
import { validateNameFormat } from './nameSanitization';

export interface ValidateNameOptions<T> {
  value: string;
  existingItems: T[];
  getName: (item: T) => string;
  isEditMode?: boolean;
  currentName?: string;
  config: NameValidationConfig;
}

export const validateName = <T>({
  value,
  existingItems,
  getName,
  isEditMode = false,
  currentName,
  config,
}: ValidateNameOptions<T>): Promise<void> => {
  if (!value || value.trim() === '') {
    return Promise.resolve();
  }

  const trimmed = value.trim();

  // Validate format and length
  const formatError = validateNameFormat(trimmed, config);
  if (formatError) {
    return Promise.reject(new Error(formatError));
  }

  // Check uniqueness (case-insensitive)
  const exists = existingItems.some((item) => {
    const itemName = getName(item);
    if (isEditMode && currentName && itemName.toLowerCase() === currentName.toLowerCase()) {
      return false;
    }
    return itemName?.toLowerCase() === trimmed.toLowerCase();
  });

  if (exists) {
    return Promise.reject(new Error(config.duplicateErrorMessage));
  }

  return Promise.resolve();
};

export const createNameValidator = <T>(
  existingItems: T[],
  getName: (item: T) => string,
  config: NameValidationConfig,
  isEditMode: boolean = false,
  currentName?: string,
) => {
  return (_: unknown, value: string) =>
    validateName({
      value,
      existingItems,
      getName,
      isEditMode,
      currentName,
      config,
    });
};
