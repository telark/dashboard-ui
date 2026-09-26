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

export const nameValidationError = <T>({
  value,
  existingItems,
  getName,
  isEditMode = false,
  currentName,
  config,
}: ValidateNameOptions<T>): string | null => {
  if (!value || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim();

  const formatError = validateNameFormat(trimmed, config);
  if (formatError) {
    return formatError;
  }

  // Check uniqueness (case-insensitive)
  const exists = existingItems.some((item) => {
    const itemName = getName(item);
    if (isEditMode && currentName && itemName.toLowerCase() === currentName.toLowerCase()) {
      return false;
    }
    return itemName?.toLowerCase() === trimmed.toLowerCase();
  });

  return exists ? config.duplicateErrorMessage : null;
};

export const validateName = <T>(options: ValidateNameOptions<T>): Promise<void> => {
  const error = nameValidationError(options);
  return error ? Promise.reject(new Error(error)) : Promise.resolve();
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
