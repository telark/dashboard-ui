import type { NameValidationConfig } from '../constants/nameValidation';

export const validateNameFormat = (
  value: string,
  config: Pick<
    NameValidationConfig,
    'minLength' | 'maxLength' | 'allowedPattern' | 'invalidCharsErrorMessage' | 'lengthErrorMessage'
  >,
): string | null => {
  if (!value || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length < config.minLength || trimmed.length > config.maxLength) {
    return config.lengthErrorMessage(config.minLength, config.maxLength);
  }

  if (!config.allowedPattern.test(trimmed)) {
    return config.invalidCharsErrorMessage;
  }

  return null;
};

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
